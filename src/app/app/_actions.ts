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
  const { error } = await supabase
    .from('zine_data')
    .upsert(
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

export async function deleteZine(zineId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('zines').delete().eq('id', zineId);
  if (error) {
    return { error: error.message };
  }
  revalidatePath('/app');
  return { ok: true as const };
}
