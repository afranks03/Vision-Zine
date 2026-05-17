import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Cover image upload helper. Mirrors the lib/storage/zine-pdf.ts pattern
 * but produces both a stable storage path (kept on the zine row) and a
 * signed URL (used by the headless renderer when generating the PDF).
 *
 * Bucket: 'zine-covers' (private, created in 20260517160000 migration).
 * Path: {zine_id}/{ts}-{safe-filename}
 *
 * We don't transcode HEIC here — the studio composer rejects HEIC at
 * upload time and asks the user to choose a JPG/PNG/WEBP. Adding a
 * Sharp/HEIF transcode is its own follow-up (3d-i-extended).
 */
const BUCKET = 'zine-covers';

export interface UploadedCover {
  storagePath: string;
  signedUrl: string;
  sizeBytes: number;
  contentType: string;
}

export async function uploadCoverImage(
  zineId: string,
  file: Buffer,
  filename: string,
  contentType: string,
): Promise<UploadedCover> {
  const admin = createAdminClient();
  const stamp = Date.now();
  const safeName = filename.replace(/[^a-z0-9.-]+/gi, '-');
  const path = `${zineId}/${stamp}-${safeName}`;

  const { error: uploadErr } = await admin.storage.from(BUCKET).upload(path, file, {
    contentType,
    upsert: false,
  });
  if (uploadErr) {
    throw new Error(`Cover upload failed: ${uploadErr.message}`);
  }

  const { data, error: signErr } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7); // 7-day signed URL — used by
  // both the public web edition and the headless renderer
  if (signErr || !data?.signedUrl) {
    throw new Error(`Signed URL mint failed: ${signErr?.message ?? 'no URL returned'}`);
  }

  return {
    storagePath: path,
    signedUrl: data.signedUrl,
    sizeBytes: file.byteLength,
    contentType,
  };
}

/**
 * Mint a fresh signed URL for an existing cover path. Use this from
 * render pathways (PDF generation, OG image) so URLs don't expire.
 */
export async function signCoverUrl(storagePath: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 60 * 24 * 7);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/**
 * Delete a cover image from storage. Best-effort; safe to call on a
 * path that no longer exists (Supabase returns null error).
 */
export async function deleteCoverImage(storagePath: string): Promise<void> {
  const admin = createAdminClient();
  await admin.storage.from(BUCKET).remove([storagePath]);
}
