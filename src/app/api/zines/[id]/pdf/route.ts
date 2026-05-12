import { NextResponse, type NextRequest } from 'next/server';
import { buildPdfFilename, renderZineToPdf } from '@/lib/pdf/render';
import { createClient } from '@/lib/supabase/server';
import type { ZineRow } from '@/lib/supabase/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Generate a print-ready PDF of a zine. The user must own the zine.
 * Delegates the actual rendering to lib/pdf/render.ts which is also used
 * by the Stripe webhook print pipeline.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { data: zine, error } = await supabase
    .from('zines')
    .select('id, user_id, title, format, issue_number')
    .eq('id', id)
    .single();
  if (error || !zine) {
    return NextResponse.json({ error: 'Zine not found.' }, { status: 404 });
  }
  const typedZine = zine as Pick<
    ZineRow,
    'id' | 'user_id' | 'title' | 'format' | 'issue_number'
  >;
  if (typedZine.user_id !== user.id) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }

  const origin = request.nextUrl.origin;
  const previewUrl = `${origin}/app/zines/${id}/preview?print=1`;

  const reqCookies = request.cookies.getAll();

  try {
    const pdfBuffer = await renderZineToPdf({
      previewUrl,
      cookies: reqCookies,
      format: typedZine.format,
    });
    const filename = buildPdfFilename(typedZine);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'PDF generation failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
