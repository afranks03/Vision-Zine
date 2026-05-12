import { NextResponse, type NextRequest } from 'next/server';
import { launchBrowser } from '@/lib/pdf/browser';
import { createClient } from '@/lib/supabase/server';
import type { ZineFormat, ZineRow } from '@/lib/supabase/types';

export const runtime = 'nodejs';
// PDF rendering can take 10–25s depending on cold-start. Give it room.
export const maxDuration = 60;

/**
 * Generate a print-ready PDF of a zine. The user must own the zine.
 *
 * Implementation: launch headless Chromium, copy the caller's Supabase
 * session cookies onto the browser context, navigate to the preview route
 * in print mode, and call page.pdf() with the right paper size.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Auth + ownership check.
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
  const typedZine = zine as Pick<ZineRow, 'id' | 'user_id' | 'title' | 'format' | 'issue_number'>;
  if (typedZine.user_id !== user.id) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }

  // 2. Build the preview URL. Use the request's own origin so this works
  // identically on localhost and production without env var coupling.
  const origin = request.nextUrl.origin;
  const previewUrl = `${origin}/app/zines/${id}/preview?print=1`;

  // 3. Copy auth cookies from the incoming request onto the browser.
  const reqCookies = request.cookies.getAll();
  const browserCookies = reqCookies.map((c) => ({
    name: c.name,
    value: c.value,
    domain: new URL(origin).hostname,
    path: '/',
    httpOnly: false,
    secure: origin.startsWith('https://'),
    sameSite: 'Lax' as const,
  }));

  let browser;
  try {
    browser = await launchBrowser();
    const context = await browser.newContext({
      viewport: paperViewport(typedZine.format),
      deviceScaleFactor: 2,
    });
    await context.addCookies(browserCookies);
    const page = await context.newPage();
    await page.emulateMedia({ media: 'print' });
    await page.goto(previewUrl, { waitUntil: 'networkidle', timeout: 30_000 });
    // Wait for fonts so display serif renders correctly (not Times fallback).
    await page.evaluate(() => document.fonts.ready);

    const pdfOpts = pdfOptions(typedZine.format);
    const pdfBuffer = await page.pdf(pdfOpts);

    const filename = buildFilename(typedZine);

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
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // best-effort cleanup
      }
    }
  }
}

/* ---- helpers ---- */

function paperViewport(format: ZineFormat) {
  // CSS pixels at 96dpi. Letter 8.5×11in → 816×1056; Tabloid 11×17 →
  // 1056×1632; Pocket 4.25×5.5 → 408×528.
  switch (format) {
    case 'tabloid':
      return { width: 1056, height: 1632 };
    case 'pocket':
      return { width: 408, height: 528 };
    case 'letter':
    default:
      return { width: 816, height: 1056 };
  }
}

function pdfOptions(format: ZineFormat) {
  const common = {
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: false as const,
  };
  switch (format) {
    case 'tabloid':
      return { ...common, format: 'Tabloid' as const };
    case 'pocket':
      return { ...common, width: '4.25in', height: '5.5in' };
    case 'letter':
    default:
      return { ...common, format: 'Letter' as const };
  }
}

function buildFilename(zine: { title: string | null; issue_number: number; format: ZineFormat }) {
  const titleSlug = (zine.title || `issue-${zine.issue_number}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${titleSlug || 'vision-zine'}-${zine.format}.pdf`;
}
