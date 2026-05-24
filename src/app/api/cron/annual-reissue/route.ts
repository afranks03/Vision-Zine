import { NextResponse, type NextRequest } from 'next/server';
import { sendAnnualReminderEmail } from '@/lib/email/send';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ZineRow } from '@/lib/supabase/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Annual reissue reminder cron (Phase 5d).
 *
 * Wired via vercel.json to fire daily at 09:00 UTC. Vercel sets
 * Authorization: Bearer ${CRON_SECRET} on the request; we reject
 * anything without that header so the route can't be hit from
 * outside Vercel.
 *
 * Per-day flow:
 *   1. Find zines created 365+ days ago, not archived, never reminded.
 *   2. For each candidate, skip if the same owner has a newer issue
 *      (they already moved on — no reminder needed).
 *   3. Look up the owner's email + display name.
 *   4. Send the reminder; stamp last_reminder_sent_at on success.
 *
 * Idempotent on its own: the reminder marker prevents repeat sends.
 * Resend's idempotency-key (keyed on zine id) is a second guard
 * against same-day double-firing.
 */
export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json(
      {
        error:
          'CRON_SECRET is not set. Generate a random string and add it to Vercel env (Production).',
      },
      { status: 500 },
    );
  }
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();

  // Stale candidates: 365+ days old, never reminded, not archived.
  const { data: candidatesRaw, error: queryErr } = await admin
    .from('zines')
    .select('*')
    .lt('created_at', cutoff)
    .is('last_reminder_sent_at', null)
    .neq('status', 'archived');
  if (queryErr) {
    return NextResponse.json({ error: queryErr.message }, { status: 500 });
  }
  const candidates = (candidatesRaw ?? []) as ZineRow[];

  const summary = {
    candidates: candidates.length,
    sent: 0,
    skipped_has_newer: 0,
    skipped_no_email: 0,
    skipped_send_failed: 0,
    errors: [] as string[],
  };

  for (const zine of candidates) {
    // Has the owner already moved on to a newer issue?
    const { data: newer } = await admin
      .from('zines')
      .select('id')
      .eq('user_id', zine.user_id)
      .gt('issue_number', zine.issue_number)
      .limit(1)
      .maybeSingle();
    if (newer) {
      summary.skipped_has_newer++;
      continue;
    }

    // Owner email — auth.admin is service-role only.
    const { data: userData, error: userErr } = await admin.auth.admin.getUserById(zine.user_id);
    if (userErr || !userData?.user?.email) {
      summary.skipped_no_email++;
      continue;
    }
    const ownerEmail = userData.user.email;

    // Owner display name from the zine's personal section.
    const { data: personalRow } = await admin
      .from('zine_data')
      .select('content_json')
      .eq('zine_id', zine.id)
      .eq('section_key', 'personal')
      .maybeSingle();
    const personal = (personalRow?.content_json ?? {}) as {
      display_name?: string;
      full_name?: string;
    };
    const ownerName =
      personal.display_name?.trim() ||
      personal.full_name?.trim() ||
      ownerEmail.split('@')[0] ||
      'Editor';

    const zineTitle = zine.title?.trim() || `Issue ${zine.issue_number}`;
    const previousYear = new Date(zine.created_at).getFullYear();

    const result = await sendAnnualReminderEmail({
      to: ownerEmail,
      zineTitle,
      currentIssue: zine.issue_number,
      ownerName,
      zineId: zine.id,
      previousYear,
    });
    if (!result.ok) {
      summary.skipped_send_failed++;
      summary.errors.push(`${zine.id}: ${result.reason}`);
      continue;
    }

    // Mark sent. We do this AFTER the email succeeds so a Resend
    // hiccup doesn't permanently mute the owner.
    const { error: stampErr } = await admin
      .from('zines')
      .update({ last_reminder_sent_at: new Date().toISOString() })
      .eq('id', zine.id);
    if (stampErr) {
      // The email went out — they got the reminder. Just log and
      // continue; the next cron run will see this zine again and
      // re-send (Resend's idempotency-key will dedup within a day).
      summary.errors.push(`${zine.id}: stamp failed: ${stampErr.message}`);
    }
    summary.sent++;
  }

  return NextResponse.json(summary);
}
