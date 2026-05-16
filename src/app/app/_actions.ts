'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { SectionKey, ZineFormat, ZineStyle } from '@/lib/supabase/types';

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
