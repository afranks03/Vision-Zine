-- Phase 3d-ii: typography presets.
--
-- Adds a per-zine `typography_preset` choice. Five curated pairings
-- defined in src/lib/typography/presets.ts: Editorial (default,
-- preserves current behavior), Modern, Romantic, News, Brutalist.
-- The choice maps to a set of font CSS variables that the zine root
-- applies via inline style; the rest of the app stays on Editorial.

alter table zines
  add column typography_preset text not null default 'editorial'
    check (typography_preset in ('editorial', 'modern', 'romantic', 'news', 'brutalist'));
