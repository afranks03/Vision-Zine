import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { uploadCoverImage } from '@/lib/storage/zine-cover';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Upload a cover image for a zine. Auth via user cookies — the route
 * verifies the zine belongs to the caller before doing anything.
 *
 * Body: multipart/form-data with a single 'file' field. Accept JPG,
 * PNG, WebP up to ~10 MB. HEIC is rejected with a 415 — we ask the
 * client to convert first (a server-side Sharp/HEIF transcode is a
 * sensible follow-up but not on the 3d-i-b critical path).
 *
 * On success: returns { storagePath, signedUrl } and stamps
 * zines.cover_image_path on the row.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: zineId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  // Ownership gate.
  const { data: zine, error: zineErr } = await supabase
    .from('zines')
    .select('id, user_id')
    .eq('id', zineId)
    .single();
  if (zineErr || !zine) {
    return NextResponse.json({ error: 'Zine not found.' }, { status: 404 });
  }
  if (zine.user_id !== user.id) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }

  // Parse multipart.
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
  }
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file field.' }, { status: 400 });
  }

  // Accept only common web image formats.
  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      {
        error: `Unsupported image type "${file.type}". Use JPG, PNG, or WebP. (HEIC: convert first.)`,
      },
      { status: 415 },
    );
  }

  // Size cap. Cover images don't need to be huge — most magazines
  // render covers at ~2400px wide.
  const MAX_BYTES = 12 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 12 MB.` },
      { status: 413 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let uploaded;
  try {
    uploaded = await uploadCoverImage(zineId, buffer, file.name, file.type);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // Stamp the new path on the zine. Uses admin client to skip RLS for
  // this single update — RLS already verified ownership above.
  const admin = createAdminClient();
  const { error: stampErr } = await admin
    .from('zines')
    .update({
      cover_image_path: uploaded.storagePath,
      // Reset focal point to center on each new upload so the new image
      // shows cleanly until the user repositions it.
      cover_image_focal_x: 0.5,
      cover_image_focal_y: 0.5,
    })
    .eq('id', zineId);
  if (stampErr) {
    return NextResponse.json({ error: stampErr.message }, { status: 500 });
  }

  revalidatePath(`/app/zines/${zineId}`);
  revalidatePath(`/app/zines/${zineId}/preview`);
  revalidatePath(`/z/${zineId}`);

  return NextResponse.json({
    ok: true,
    storagePath: uploaded.storagePath,
    signedUrl: uploaded.signedUrl,
  });
}
