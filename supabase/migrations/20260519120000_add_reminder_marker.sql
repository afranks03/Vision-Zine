-- Phase 5d: annual reissue reminder marker.
--
-- The cron at /api/cron/annual-reissue runs daily, identifies zines that
-- are 365+ days old and whose owner has no newer issue, and sends a
-- "Time for Issue II?" email via Resend. This column records when the
-- reminder was fired so we don't re-spam the same owner.
--
-- Set once per zine, never reset. If the owner creates a new issue, the
-- cron sees that newer zine and skips the older one anyway — no need to
-- clear the marker.

alter table zines
  add column last_reminder_sent_at timestamptz;

create index if not exists zines_last_reminder_idx
  on zines (last_reminder_sent_at)
  where last_reminder_sent_at is null;

comment on column zines.last_reminder_sent_at is
  'When the Phase 5d annual reissue reminder email was sent for this zine. Null means never reminded.';
