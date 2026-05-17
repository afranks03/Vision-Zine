-- Phase 3d-i: cover system.
--
-- Decouples cover treatment from the zine's content style. A user can now
-- pick 'fashion' style for inner spreads (runway-list achievements, etc.)
-- AND 'big_type' cover_layout for the cover. The two were previously
-- conflated (cover.tsx dispatched on zine.style).
--
-- New columns on zines:
--   cover_layout         — which of the 5 cover treatments to render
--   cover_image_path     — Supabase Storage path in the zine-covers bucket
--                          (null when cover_layout='big_type' or before upload)
--   cover_image_focal_x  — 0..1, horizontal focal point for object-position
--   cover_image_focal_y  — 0..1, vertical focal point
--   cover_accent         — name of one of six brand-locked accent swatches
--   cover_subtitle       — optional one-line tagline shown under masthead
--
-- Storage:
--   New 'zine-covers' bucket, private. Same access pattern as zine-pdfs:
--   the admin client uploads + mints signed URLs; the headless renderer
--   fetches the signed URL when generating the PDF.

-- ---- columns ----

alter table zines
  add column cover_layout text not null default 'big_type'
    check (cover_layout in ('fashion', 'travel', 'design', 'daily_life', 'big_type')),
  add column cover_image_path text,
  add column cover_image_focal_x real not null default 0.5
    check (cover_image_focal_x >= 0 and cover_image_focal_x <= 1),
  add column cover_image_focal_y real not null default 0.5
    check (cover_image_focal_y >= 0 and cover_image_focal_y <= 1),
  add column cover_accent text not null default 'coral'
    check (cover_accent in ('coral', 'yellow', 'magenta', 'blue', 'green', 'ink')),
  add column cover_subtitle text;

-- Backfill: pick a sensible default cover_layout based on the existing
-- style so that pre-3d-i zines render with a cover that resembles their
-- old style-specific cover.
update zines set cover_layout = case style
  when 'editorial'   then 'big_type'
  when 'lifestyle'   then 'daily_life'
  when 'fashion'     then 'fashion'
  when 'art_catalog' then 'design'
  when 'travel'      then 'travel'
  when 'financial'   then 'big_type'
  else 'big_type'
end;

-- ---- storage bucket ----

insert into storage.buckets (id, name, public)
values ('zine-covers', 'zine-covers', false)
on conflict (id) do nothing;

-- RLS policies for zine-covers: owners can read/write their own files.
-- Path convention is enforced in app code: zine-covers/{zine_id}/{ts}-{name}.

drop policy if exists "Cover owner read" on storage.objects;
create policy "Cover owner read" on storage.objects
  for select using (
    bucket_id = 'zine-covers'
    and exists (
      select 1 from zines z
      where z.id::text = split_part(name, '/', 1)
        and z.user_id = auth.uid()
    )
  );

drop policy if exists "Cover owner write" on storage.objects;
create policy "Cover owner write" on storage.objects
  for insert with check (
    bucket_id = 'zine-covers'
    and exists (
      select 1 from zines z
      where z.id::text = split_part(name, '/', 1)
        and z.user_id = auth.uid()
    )
  );

drop policy if exists "Cover owner delete" on storage.objects;
create policy "Cover owner delete" on storage.objects
  for delete using (
    bucket_id = 'zine-covers'
    and exists (
      select 1 from zines z
      where z.id::text = split_part(name, '/', 1)
        and z.user_id = auth.uid()
    )
  );
