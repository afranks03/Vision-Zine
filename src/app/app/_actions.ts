'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sendCoauthorInviteEmail } from '@/lib/email/send';
import { createClient } from '@/lib/supabase/server';
import type {
  CoauthorInvitationRow,
  CoverAccent,
  CoverLayout,
  SectionKey,
  ZineFormat,
  ZineStyle,
} from '@/lib/supabase/types';
import type { TypographyPreset } from '@/lib/typography/presets';

/**
 * Server actions for the authenticated app: create a zine, save a section.
 * All operations run under the user's auth context — RLS in Postgres enforces
 * that callers can only touch their own rows.
 */

interface CreateZineInput {
  style: ZineStyle;
  format: ZineFormat;
  title?: string;
}

export async function createZine(input: CreateZineInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not signed in.' };
  }

  const { data: zine, error } = await supabase
    .from('zines')
    .insert({
      user_id: user.id,
      style: input.style,
      format: input.format,
      title: input.title ?? null,
      // issue_number is set by the DB trigger
    })
    .select('id, issue_number')
    .single();

  if (error || !zine) {
    return { error: error?.message ?? 'Failed to create zine.' };
  }

  revalidatePath('/app');
  redirect(`/app/zines/${zine.id}`);
}

interface SaveSectionInput {
  zineId: string;
  sectionKey: SectionKey;
  contentJson: Record<string, unknown>;
}

export async function saveSection(input: SaveSectionInput) {
  const supabase = await createClient();

  // Upsert on (zine_id, section_key). The unique constraint in the schema
  // enforces one row per section per zine.
  const { error } = await supabase.from('zine_data').upsert(
    {
      zine_id: input.zineId,
      section_key: input.sectionKey,
      content_json: input.contentJson,
    },
    { onConflict: 'zine_id,section_key' },
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/app/zines/${input.zineId}`);
  return { ok: true as const };
}

export async function setZinePublished(zineId: string, isPublished: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('zines')
    .update({ is_published: isPublished })
    .eq('id', zineId);
  if (error) return { error: error.message };
  revalidatePath(`/app/zines/${zineId}/preview`);
  // Public route also benefits from a fresh fetch.
  revalidatePath(`/z/${zineId}`);
  return { ok: true as const };
}

export async function setZineStyle(zineId: string, style: ZineStyle) {
  const supabase = await createClient();
  const { error } = await supabase.from('zines').update({ style }).eq('id', zineId);
  if (error) {
    return { error: error.message };
  }
  revalidatePath(`/app/zines/${zineId}`);
  revalidatePath(`/app/zines/${zineId}/preview`);
  return { ok: true as const };
}

/* ----- Phase 3d-i-b: cover composer setters ----- */

/**
 * Set the zine title (was previously only settable at creation time).
 * The cover composer surfaces the title field because "title" is most
 * fundamentally a cover concern in editorial design.
 */
export async function setZineTitle(zineId: string, title: string) {
  const supabase = await createClient();
  const trimmed = title.trim();
  const { error } = await supabase
    .from('zines')
    .update({ title: trimmed.length > 0 ? trimmed : null })
    .eq('id', zineId);
  if (error) return { error: error.message };
  revalidatePath(`/app/zines/${zineId}`);
  revalidatePath(`/app/zines/${zineId}/preview`);
  revalidatePath(`/z/${zineId}`);
  return { ok: true as const };
}

export async function setCoverLayout(zineId: string, cover_layout: CoverLayout) {
  const supabase = await createClient();
  const { error } = await supabase.from('zines').update({ cover_layout }).eq('id', zineId);
  if (error) return { error: error.message };
  revalidatePath(`/app/zines/${zineId}`);
  revalidatePath(`/app/zines/${zineId}/preview`);
  revalidatePath(`/z/${zineId}`);
  return { ok: true as const };
}

export async function setCoverAccent(zineId: string, cover_accent: CoverAccent) {
  const supabase = await createClient();
  const { error } = await supabase.from('zines').update({ cover_accent }).eq('id', zineId);
  if (error) return { error: error.message };
  revalidatePath(`/app/zines/${zineId}`);
  revalidatePath(`/app/zines/${zineId}/preview`);
  revalidatePath(`/z/${zineId}`);
  return { ok: true as const };
}

export async function setCoverSubtitle(zineId: string, subtitle: string) {
  const supabase = await createClient();
  const trimmed = subtitle.trim();
  const { error } = await supabase
    .from('zines')
    .update({ cover_subtitle: trimmed.length > 0 ? trimmed : null })
    .eq('id', zineId);
  if (error) return { error: error.message };
  revalidatePath(`/app/zines/${zineId}`);
  revalidatePath(`/app/zines/${zineId}/preview`);
  revalidatePath(`/z/${zineId}`);
  return { ok: true as const };
}

/**
 * Save the focal-point position (0..1, both axes). The cover's CSS
 * `object-position` reads from these, so the subject stays in frame
 * across the different photo-bleed layouts.
 */
export async function setCoverFocalPoint(zineId: string, x: number, y: number) {
  const cx = clamp01(x);
  const cy = clamp01(y);
  const supabase = await createClient();
  const { error } = await supabase
    .from('zines')
    .update({ cover_image_focal_x: cx, cover_image_focal_y: cy })
    .eq('id', zineId);
  if (error) return { error: error.message };
  revalidatePath(`/app/zines/${zineId}`);
  revalidatePath(`/app/zines/${zineId}/preview`);
  revalidatePath(`/z/${zineId}`);
  return { ok: true as const };
}

/**
 * Phase 3d-ii: typography preset. One of five curated pairings
 * (see lib/typography/presets.ts). Independent of style + cover_layout.
 */
export async function setTypographyPreset(zineId: string, typography_preset: TypographyPreset) {
  const supabase = await createClient();
  const { error } = await supabase.from('zines').update({ typography_preset }).eq('id', zineId);
  if (error) return { error: error.message };
  revalidatePath(`/app/zines/${zineId}`);
  revalidatePath(`/app/zines/${zineId}/preview`);
  revalidatePath(`/z/${zineId}`);
  return { ok: true as const };
}

/**
 * Clear the cover image (sets path to null). Doesn't delete the file
 * from storage — storage cleanup is a follow-up cron concern, not
 * critical-path for the composer.
 */
export async function clearCoverImage(zineId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('zines')
    .update({ cover_image_path: null })
    .eq('id', zineId);
  if (error) return { error: error.message };
  revalidatePath(`/app/zines/${zineId}`);
  revalidatePath(`/app/zines/${zineId}/preview`);
  revalidatePath(`/z/${zineId}`);
  return { ok: true as const };
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0.5;
  return Math.max(0, Math.min(1, n));
}

export async function setZineFormat(zineId: string, format: ZineFormat) {
  const supabase = await createClient();
  const { error } = await supabase.from('zines').update({ format }).eq('id', zineId);
  if (error) {
    return { error: error.message };
  }
  revalidatePath(`/app/zines/${zineId}`);
  revalidatePath(`/app/zines/${zineId}/preview`);
  return { ok: true as const };
}

/* ----- Phase 5c: co-author invitations ----- */

/**
 * Invite a partner to co-author a zine. Creates a coauthor_invitations
 * row (auto-generating a 64-char hex token via DB default), then sends
 * the invitation email via Resend.
 *
 * The unique(zine_id, email) constraint means re-inviting the same
 * email returns an error — use resendCoauthorInvite for that case.
 */
export async function inviteCoauthor(
  zineId: string,
  email: string,
): Promise<{ ok: true; id: string } | { error: string }> {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { error: 'That doesn’t look like an email address.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  // RLS will block this insert unless the caller owns the zine.
  const { data: invite, error: insertErr } = await supabase
    .from('coauthor_invitations')
    .insert({
      zine_id: zineId,
      email: normalized,
      invited_by: user.id,
    })
    .select('id, token, zine_id')
    .single();

  if (insertErr || !invite) {
    if (insertErr?.code === '23505') {
      return { error: 'That email is already invited to this issue.' };
    }
    return { error: insertErr?.message ?? 'Could not create invitation.' };
  }

  // Look up the zine title + inviter display name for the email body.
  const [{ data: zine }, { data: personalRow }] = await Promise.all([
    supabase.from('zines').select('title, issue_number').eq('id', zineId).single(),
    supabase
      .from('zine_data')
      .select('content_json')
      .eq('zine_id', zineId)
      .eq('section_key', 'personal')
      .maybeSingle(),
  ]);
  const zineTitle =
    (zine as { title: string | null; issue_number: number } | null)?.title?.trim() ||
    `Issue ${(zine as { issue_number: number } | null)?.issue_number ?? 1}`;
  const personal = (personalRow?.content_json ?? {}) as {
    display_name?: string;
    full_name?: string;
  };
  const inviterName =
    personal.display_name?.trim() || personal.full_name?.trim() || user.email || 'A friend';

  // Send the invitation email. Fail-soft: if Resend isn't configured
  // or the send fails, the invitation row is still saved and can be
  // resent later from the studio.
  await sendCoauthorInviteEmail({
    to: normalized,
    zineTitle,
    inviterName,
    token: (invite as { token: string }).token,
  });

  revalidatePath(`/app/zines/${zineId}`);
  return { ok: true as const, id: (invite as { id: string }).id };
}

export async function revokeCoauthorInvite(
  invitationId: string,
): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('coauthor_invitations')
    .update({ status: 'revoked' })
    .eq('id', invitationId);
  if (error) return { error: error.message };
  // We don't know zine_id from the call site without a round-trip;
  // the studio refresh covers it.
  return { ok: true as const };
}

export async function resendCoauthorInvite(
  invitationId: string,
): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const { data: inv, error: fetchErr } = await supabase
    .from('coauthor_invitations')
    .select('id, zine_id, email, token, status')
    .eq('id', invitationId)
    .single();
  if (fetchErr || !inv) return { error: fetchErr?.message ?? 'Invitation not found.' };
  const row = inv as Pick<CoauthorInvitationRow, 'id' | 'zine_id' | 'email' | 'token' | 'status'>;
  if (row.status !== 'pending') {
    return { error: 'Only pending invitations can be resent.' };
  }

  // Look up zine title + inviter name again.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const [{ data: zine }, { data: personalRow }] = await Promise.all([
    supabase.from('zines').select('title, issue_number').eq('id', row.zine_id).single(),
    supabase
      .from('zine_data')
      .select('content_json')
      .eq('zine_id', row.zine_id)
      .eq('section_key', 'personal')
      .maybeSingle(),
  ]);
  const zineTitle =
    (zine as { title: string | null; issue_number: number } | null)?.title?.trim() ||
    `Issue ${(zine as { issue_number: number } | null)?.issue_number ?? 1}`;
  const personal = (personalRow?.content_json ?? {}) as {
    display_name?: string;
    full_name?: string;
  };
  const inviterName =
    personal.display_name?.trim() || personal.full_name?.trim() || user.email || 'A friend';

  await sendCoauthorInviteEmail({
    to: row.email,
    zineTitle,
    inviterName,
    token: row.token,
  });
  return { ok: true as const };
}

export async function deleteZine(zineId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('zines').delete().eq('id', zineId);
  if (error) {
    return { error: error.message };
  }
  revalidatePath('/app');
  return { ok: true as const };
}

/**
 * Soft-delete: flip status to 'archived'. Hidden from the main dashboard
 * list by default; reachable by future archive view. Reversible.
 */
export async function archiveZine(zineId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('zines').update({ status: 'archived' }).eq('id', zineId);
  if (error) return { error: error.message };
  revalidatePath('/app');
  return { ok: true as const };
}

/**
 * Restore an archived zine back to 'draft'. We don't remember the
 * pre-archive status — paid/printed zines that were archived will need
 * a fresh checkout if re-printed. Deliberate quirk for now.
 */
export async function unarchiveZine(zineId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('zines').update({ status: 'draft' }).eq('id', zineId);
  if (error) return { error: error.message };
  revalidatePath('/app');
  return { ok: true as const };
}

/**
 * Duplicate a zine and all its section data as a new draft. The new zine
 * gets the next issue_number (DB trigger handles that on insert) and is
 * owned by the current user. Useful for the annual "Time for Issue II"
 * flow as well as ad-hoc cloning from the dashboard.
 *
 * Returns the new zine id so the caller can navigate to it.
 */
export async function duplicateZine(zineId: string): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  // RLS will block reading a zine the user doesn't own.
  const { data: source, error: fetchErr } = await supabase
    .from('zines')
    .select('style, format, title')
    .eq('id', zineId)
    .single();
  if (fetchErr || !source) return { error: fetchErr?.message ?? 'Source zine not found.' };

  const { data: newZine, error: insertErr } = await supabase
    .from('zines')
    .insert({
      user_id: user.id,
      style: source.style,
      format: source.format,
      title: source.title ? `${source.title} (copy)` : null,
      // issue_number set by the DB trigger
    })
    .select('id')
    .single();
  if (insertErr || !newZine) return { error: insertErr?.message ?? 'Failed to duplicate zine.' };

  // Copy section data in one batch insert.
  const { data: srcData, error: dataErr } = await supabase
    .from('zine_data')
    .select('section_key, content_json')
    .eq('zine_id', zineId);
  if (dataErr) {
    return { error: `Created copy but couldn't read section data: ${dataErr.message}` };
  }
  if (srcData && srcData.length > 0) {
    const rows = srcData.map((row) => ({
      zine_id: newZine.id,
      section_key: row.section_key,
      content_json: row.content_json,
    }));
    const { error: copyErr } = await supabase.from('zine_data').insert(rows);
    if (copyErr) return { error: `Copy data failed: ${copyErr.message}` };
  }

  revalidatePath('/app');
  return { id: newZine.id };
}
