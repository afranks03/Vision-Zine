import { createHash } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';

const BUCKET = 'zine-pdfs';

/**
 * Upload a rendered zine PDF to Supabase Storage and return both a signed
 * URL (for Lulu to fetch) and the md5 hash (Lulu requires it for content
 * verification).
 *
 * Path layout: zine-pdfs/{zine_id}/{ts}-{filename}.pdf
 * Signed URL TTL: 24h — Lulu typically fetches within minutes of order
 * submission, but we give headroom for retries.
 */
export interface UploadedPdf {
  storagePath: string;
  signedUrl: string;
  md5: string;
  sizeBytes: number;
}

export async function uploadZinePdf(
  zineId: string,
  pdf: Buffer,
  filename: string,
): Promise<UploadedPdf> {
  const admin = createAdminClient();
  const md5 = createHash('md5').update(pdf).digest('hex');
  const stamp = Date.now();
  const safeName = filename.replace(/[^a-z0-9.-]+/gi, '-');
  const path = `${zineId}/${stamp}-${safeName}`;

  const { error: uploadErr } = await admin.storage.from(BUCKET).upload(path, pdf, {
    contentType: 'application/pdf',
    upsert: false,
  });
  if (uploadErr) {
    throw new Error(`Storage upload failed: ${uploadErr.message}`);
  }

  // 24-hour signed URL.
  const { data, error: signErr } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24);
  if (signErr || !data?.signedUrl) {
    throw new Error(`Signed URL mint failed: ${signErr?.message ?? 'no URL returned'}`);
  }

  return {
    storagePath: path,
    signedUrl: data.signedUrl,
    md5,
    sizeBytes: pdf.byteLength,
  };
}
