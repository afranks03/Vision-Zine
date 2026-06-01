-- Phase 7a: The Practice — new contemplative section that sits between
-- Personal and Vision Statement in the studio.
--
-- One section, six fields, two groups:
--   Inward  — gratitude, forgiveness, grounding, spirituality
--   Outward — environment, friend_circle
--
-- All fields are optional. The shape of content_json is documented in
-- src/lib/supabase/types.ts → PracticeContent.

alter table public.zine_data
  drop constraint if exists zine_data_section_key_check;

alter table public.zine_data
  add constraint zine_data_section_key_check
  check (section_key in (
    'personal',
    'vision',
    'bio',
    'resume',
    'achievements',
    'goals',
    'tenets',
    'online',
    'documents',
    'coauthor',
    'practice'
  ));
