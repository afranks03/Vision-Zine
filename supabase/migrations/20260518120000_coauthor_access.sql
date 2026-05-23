-- Phase 5c: co-author access policies.
--
-- An accepted co-author (a user whose row in coauthor_invitations is
-- status='accepted' with accepted_by = themselves) gets:
--   - SELECT on the zine they're invited to
--   - SELECT on any zine_data row of that zine (read-only on owner's content)
--   - INSERT / UPDATE on the 'coauthor' section_key only — the partner can
--     edit the joint section but never the owner's other sections.
--
-- Per the v1 model (Option A): co-author cannot touch other sections.
-- Tightening to multi-author editing is a later phase.

-- ---- zines: accepted coauthor can SELECT ----

create policy "zines: accepted coauthor can select"
  on public.zines for select
  using (
    exists (
      select 1
      from public.coauthor_invitations inv
      where inv.zine_id = zines.id
        and inv.status = 'accepted'
        and inv.accepted_by = (select auth.uid())
    )
  );

-- ---- zine_data: accepted coauthor can SELECT (any section) ----

create policy "zine_data: accepted coauthor can select"
  on public.zine_data for select
  using (
    exists (
      select 1
      from public.coauthor_invitations inv
      where inv.zine_id = zine_data.zine_id
        and inv.status = 'accepted'
        and inv.accepted_by = (select auth.uid())
    )
  );

-- ---- zine_data: accepted coauthor can INSERT the coauthor section ----

create policy "zine_data: accepted coauthor can insert coauthor"
  on public.zine_data for insert
  with check (
    zine_data.section_key = 'coauthor'
    and exists (
      select 1
      from public.coauthor_invitations inv
      where inv.zine_id = zine_data.zine_id
        and inv.status = 'accepted'
        and inv.accepted_by = (select auth.uid())
    )
  );

-- ---- zine_data: accepted coauthor can UPDATE the coauthor section ----

create policy "zine_data: accepted coauthor can update coauthor"
  on public.zine_data for update
  using (
    zine_data.section_key = 'coauthor'
    and exists (
      select 1
      from public.coauthor_invitations inv
      where inv.zine_id = zine_data.zine_id
        and inv.status = 'accepted'
        and inv.accepted_by = (select auth.uid())
    )
  )
  with check (
    zine_data.section_key = 'coauthor'
    and exists (
      select 1
      from public.coauthor_invitations inv
      where inv.zine_id = zine_data.zine_id
        and inv.status = 'accepted'
        and inv.accepted_by = (select auth.uid())
    )
  );

-- ---- zine_assets: accepted coauthor can SELECT (read uploaded files) ----

create policy "zine_assets: accepted coauthor can select"
  on public.zine_assets for select
  using (
    exists (
      select 1
      from public.coauthor_invitations inv
      where inv.zine_id = zine_assets.zine_id
        and inv.status = 'accepted'
        and inv.accepted_by = (select auth.uid())
    )
  );
