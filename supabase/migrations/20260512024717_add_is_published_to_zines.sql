-- =============================================================================
-- Add is_published flag to zines.
-- =============================================================================
-- Default false — users explicitly publish when they want a shareable URL.
-- The public route /z/[id] uses a service-role client to read the row and
-- 404s if is_published is false. Owner RLS policies are untouched; the
-- service-role read intentionally bypasses RLS for the public view.
-- =============================================================================

alter table public.zines
  add column if not exists is_published boolean not null default false;

comment on column public.zines.is_published is
  'When true, /z/[id] renders the zine publicly without auth. Toggled by the owner.';

-- Index for the (rare) case where we want to enumerate published zines
-- (e.g. a future "discover" page). Partial index keeps it small.
create index if not exists zines_is_published_idx
  on public.zines (id)
  where is_published = true;
