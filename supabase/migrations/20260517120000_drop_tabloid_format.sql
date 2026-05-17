-- Drop tabloid from the supported zine formats.
--
-- Phase 4d decision: Lulu xPress (our print partner) doesn't carry 11×17.
-- Until we add a large-format print partner, tabloid prints aren't
-- fulfillable, so we remove it as an option entirely. The cleaner UX is
-- "two sizes that actually print" rather than "three sizes, one secretly
-- digital-only."
--
-- Safety: migrate any existing tabloid zines to 'letter' before we
-- tighten the check constraint. Letter is the closer aesthetic for
-- editorial spreads than pocket.

-- 1. Re-home any existing tabloid zines to letter.
update zines
   set format = 'letter',
       updated_at = now()
 where format = 'tabloid';

-- 2. Replace the check constraint with the two-format version.
alter table zines
  drop constraint if exists zines_format_check;

alter table zines
  add constraint zines_format_check
  check (format in ('letter','pocket'));
