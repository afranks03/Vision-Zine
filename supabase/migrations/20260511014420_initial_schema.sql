-- =============================================================================
-- Vision Zine — initial schema
-- =============================================================================
-- Covers: zines, zine_data, zine_assets, coauthor_invitations, subscriptions.
-- RLS is enabled on every table — users can only access their own zines and
-- their derived rows. Co-author read access will be added in a later migration
-- once the invitation flow is built (Phase 2d).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- helpers
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at is
  'Generic trigger function: sets updated_at = now() on every UPDATE.';

-- -----------------------------------------------------------------------------
-- zines
-- Purpose: one row per magazine issue a user creates.
-- Ownership: user_id, full RLS.
-- -----------------------------------------------------------------------------

create table public.zines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  issue_number integer not null default 0,
  style text not null default 'editorial'
    check (style in ('editorial','lifestyle','fashion','art_catalog','travel','financial')),
  format text not null default 'letter'
    check (format in ('letter','tabloid','pocket')),
  status text not null default 'draft'
    check (status in ('draft','paid','generating','printed','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.zines is
  'Top-level zine record. One row per issue. Owned by user_id.';

create index zines_user_id_idx on public.zines(user_id);
create index zines_user_status_idx on public.zines(user_id, status);

create trigger zines_set_updated_at
  before update on public.zines
  for each row execute function public.set_updated_at();

-- Auto-increment issue_number per user when inserting a new zine.
-- If the caller passes a non-zero issue_number, respect it (e.g. duplications).
create or replace function public.set_zine_issue_number()
returns trigger
language plpgsql
as $$
begin
  if new.issue_number is null or new.issue_number = 0 then
    new.issue_number := coalesce(
      (select max(issue_number) from public.zines where user_id = new.user_id),
      0
    ) + 1;
  end if;
  return new;
end;
$$;

create trigger zines_set_issue_number
  before insert on public.zines
  for each row execute function public.set_zine_issue_number();

-- -----------------------------------------------------------------------------
-- zine_data
-- Purpose: section content as JSONB. One row per (zine, section_key).
-- Ownership: derived via zine_id -> zines.user_id.
-- -----------------------------------------------------------------------------

create table public.zine_data (
  id uuid primary key default gen_random_uuid(),
  zine_id uuid not null references public.zines(id) on delete cascade,
  section_key text not null check (section_key in (
    'personal','vision','bio','resume','achievements',
    'goals','tenets','online','documents','coauthor'
  )),
  content_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(zine_id, section_key)
);

comment on table public.zine_data is
  'Section content for a zine, keyed by section_key. One row per section per zine.';

create index zine_data_zine_id_idx on public.zine_data(zine_id);

create trigger zine_data_set_updated_at
  before update on public.zine_data
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- zine_assets
-- Purpose: uploaded files referenced by a zine.
-- Ownership: derived via zine_id.
-- Storage: actual bytes live in Supabase Storage; this row holds the path.
-- -----------------------------------------------------------------------------

create table public.zine_assets (
  id uuid primary key default gen_random_uuid(),
  zine_id uuid not null references public.zines(id) on delete cascade,
  asset_type text not null check (asset_type in ('document','image','audio','other')),
  storage_path text not null,
  url text,
  mime_type text,
  size_bytes bigint,
  original_filename text,
  created_at timestamptz not null default now()
);

comment on table public.zine_assets is
  'Files uploaded for a zine (documents, images). Bytes live in Supabase Storage.';

create index zine_assets_zine_id_idx on public.zine_assets(zine_id);

-- -----------------------------------------------------------------------------
-- coauthor_invitations
-- Purpose: invite a partner to fill the co-author section of a zine.
-- Ownership: invited_by is the zine owner; accepted_by is the partner.
-- -----------------------------------------------------------------------------

create table public.coauthor_invitations (
  id uuid primary key default gen_random_uuid(),
  zine_id uuid not null references public.zines(id) on delete cascade,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending','accepted','revoked','expired')),
  token text unique not null default encode(gen_random_bytes(32), 'hex'),
  invited_by uuid not null references auth.users(id) on delete cascade,
  accepted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  unique(zine_id, email)
);

comment on table public.coauthor_invitations is
  'Pending/accepted co-author invitations. One per (zine, email).';

create index coauthor_invitations_token_idx on public.coauthor_invitations(token);
create index coauthor_invitations_zine_idx on public.coauthor_invitations(zine_id);
create index coauthor_invitations_accepted_by_idx on public.coauthor_invitations(accepted_by);

-- -----------------------------------------------------------------------------
-- subscriptions
-- Purpose: link a user to their Stripe customer + active plan.
-- Ownership: user_id.
-- -----------------------------------------------------------------------------

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text,
  tier text check (tier in ('free','one_issue','annual')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.subscriptions is
  'Stripe linkage for billing. One row per user.';

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
-- Every table is locked down by default. Users can only see/modify their own
-- zines and their derived rows. Co-author read access will be layered in
-- Phase 2d once we know exactly what a co-author can see.
-- =============================================================================

alter table public.zines enable row level security;
alter table public.zine_data enable row level security;
alter table public.zine_assets enable row level security;
alter table public.coauthor_invitations enable row level security;
alter table public.subscriptions enable row level security;

-- ---- zines ----
create policy "zines: owner can select"
  on public.zines for select
  using (user_id = (select auth.uid()));

create policy "zines: owner can insert"
  on public.zines for insert
  with check (user_id = (select auth.uid()));

create policy "zines: owner can update"
  on public.zines for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "zines: owner can delete"
  on public.zines for delete
  using (user_id = (select auth.uid()));

-- ---- zine_data ----
create policy "zine_data: owner can select"
  on public.zine_data for select
  using (exists (
    select 1 from public.zines z
    where z.id = zine_data.zine_id and z.user_id = (select auth.uid())
  ));

create policy "zine_data: owner can insert"
  on public.zine_data for insert
  with check (exists (
    select 1 from public.zines z
    where z.id = zine_data.zine_id and z.user_id = (select auth.uid())
  ));

create policy "zine_data: owner can update"
  on public.zine_data for update
  using (exists (
    select 1 from public.zines z
    where z.id = zine_data.zine_id and z.user_id = (select auth.uid())
  ));

create policy "zine_data: owner can delete"
  on public.zine_data for delete
  using (exists (
    select 1 from public.zines z
    where z.id = zine_data.zine_id and z.user_id = (select auth.uid())
  ));

-- ---- zine_assets ----
create policy "zine_assets: owner can select"
  on public.zine_assets for select
  using (exists (
    select 1 from public.zines z
    where z.id = zine_assets.zine_id and z.user_id = (select auth.uid())
  ));

create policy "zine_assets: owner can insert"
  on public.zine_assets for insert
  with check (exists (
    select 1 from public.zines z
    where z.id = zine_assets.zine_id and z.user_id = (select auth.uid())
  ));

create policy "zine_assets: owner can delete"
  on public.zine_assets for delete
  using (exists (
    select 1 from public.zines z
    where z.id = zine_assets.zine_id and z.user_id = (select auth.uid())
  ));

-- ---- coauthor_invitations ----
-- Owner sees and manages invitations for their zines.
create policy "coauthor_invitations: owner can select"
  on public.coauthor_invitations for select
  using (invited_by = (select auth.uid()));

create policy "coauthor_invitations: owner can insert"
  on public.coauthor_invitations for insert
  with check (invited_by = (select auth.uid()) and exists (
    select 1 from public.zines z
    where z.id = zine_id and z.user_id = (select auth.uid())
  ));

create policy "coauthor_invitations: owner can update"
  on public.coauthor_invitations for update
  using (invited_by = (select auth.uid()));

create policy "coauthor_invitations: owner can delete"
  on public.coauthor_invitations for delete
  using (invited_by = (select auth.uid()));

-- Invitee (once accepted) can see their own invitation row.
create policy "coauthor_invitations: invitee can select"
  on public.coauthor_invitations for select
  using (accepted_by = (select auth.uid()));

-- ---- subscriptions ----
create policy "subscriptions: owner can select"
  on public.subscriptions for select
  using (user_id = (select auth.uid()));

-- Inserts and updates on subscriptions go through the service role (Stripe
-- webhook handler), so we do NOT add insert/update/delete policies for the
-- anon/authenticated roles. RLS will block any attempt from a regular user.
