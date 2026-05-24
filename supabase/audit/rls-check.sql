-- RLS audit script (Phase 6c).
--
-- Run in Supabase SQL Editor. Verifies every public table has
-- RLS enabled, lists each table's policies grouped by command,
-- and flags storage buckets that aren't owner-scoped.
--
-- This script is read-only — safe to run on production any time.
-- Output is meant for human review; there's no PASS/FAIL gate.
--
-- Expected baseline (as of Phase 6):
--   zines                  — 4 owner CRUD + 1 accepted-coauthor select
--   zine_data              — 4 owner CRUD + 3 accepted-coauthor
--                            (select all / insert coauthor / update coauthor)
--   zine_assets            — 4 owner CRUD + 1 accepted-coauthor select
--   coauthor_invitations   — 4 owner CRUD + 1 invitee select
--   print_orders           — 1 owner select  (only path that writes is
--                            the admin-client print pipeline)
--   subscriptions          — 1 owner select
--   storage.objects (zine-pdfs)   — owner read/write
--   storage.objects (zine-covers) — owner read/write/delete

-- ---- 1. Every public table has RLS enabled ----

select
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  case when rowsecurity then 'OK' else '⚠️ RLS DISABLED' end as status
from pg_tables
where schemaname = 'public'
order by tablename;

-- ---- 2. Policies grouped by table + command ----

select
  schemaname,
  tablename,
  cmd as command,
  count(*) as policy_count,
  string_agg(policyname, '; ' order by policyname) as policies
from pg_policies
where schemaname = 'public'
group by schemaname, tablename, cmd
order by tablename, cmd;

-- ---- 3. Tables with NO policies (potentially dangerous) ----

with policy_counts as (
  select schemaname, tablename, count(*) as policy_count
  from pg_policies
  where schemaname = 'public'
  group by schemaname, tablename
)
select
  t.schemaname,
  t.tablename,
  t.rowsecurity as rls_enabled,
  coalesce(p.policy_count, 0) as policy_count,
  case
    when not t.rowsecurity then '🚨 RLS off — everyone has full access'
    when coalesce(p.policy_count, 0) = 0 then '🚨 RLS on but no policies — denies all access'
    else 'OK'
  end as status
from pg_tables t
left join policy_counts p
  on p.schemaname = t.schemaname and p.tablename = t.tablename
where t.schemaname = 'public'
order by t.tablename;

-- ---- 4. Storage bucket policies ----
-- The zine-pdfs and zine-covers buckets should each have at least
-- one policy gating access by zine ownership.

select
  policyname,
  cmd as command,
  pg_get_expr(qual, polrelid) as using_clause,
  pg_get_expr(with_check, polrelid) as with_check_clause
from pg_policy p
join pg_policies pp using (policyname)
where pp.schemaname = 'storage'
  and pp.tablename = 'objects'
order by policyname;

-- ---- 5. Public buckets (red flag — should be empty) ----

select id, name, public
from storage.buckets
where public = true;
-- If this query returns rows, those buckets are publicly readable
-- to anyone with a URL. None of Vision Zine's buckets should be
-- public; cover images and PDFs are served via signed URLs.

-- ---- 6. Indexes on RLS predicate columns (perf sanity) ----
-- Policies that filter by user_id or accepted_by run a query each
-- request — these columns should be indexed.

select
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and (
    indexdef ilike '%user_id%'
    or indexdef ilike '%accepted_by%'
    or indexdef ilike '%invited_by%'
    or indexdef ilike '%zine_id%'
  )
order by tablename, indexname;
