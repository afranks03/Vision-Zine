import { launchBrowser } from './browser';
import type { ZineFormat } from '@/lib/supabase/types';

/**
 * Render a zine to a PDF buffer. Two call sites:
 *   1. /api/zines/[id]/pdf — user clicks "Download PDF" (auth + ownership
 *      verified in the route handler before this is called).
 *   2. Stripe webhook — print job pipeline calls this after marking the
 *      zine paid (auth bypassed via the trusted webhook context).
 *
 * The caller is responsible for auth. This function trusts whoever
 * invokes it.
 */
export interface RenderPdfOptions {
  /** The full preview URL we should screenshot. Must include any auth
   *  cookies needed to render — we don't add them here. */
  previewUrl: string;
  /** Auth cookies to attach to the browser context, if any. Pass an
   *  empty array when the URL is public (e.g. a /z/[id] route). */
  cookies?: Array<{ name: string; value: string }>;
  format: ZineFormat;
}

export async function renderZineToPdf(opts: RenderPdfOptions): Promise<Buffer> {
  const browser = await launchBrowser();
  try {
    const context = await browser.newContext({
      viewport: paperViewport(opts.format),
      deviceScaleFactor: 2,
    });

    if (opts.cookies && opts.cookies.length > 0) {
      const origin = new URL(opts.previewUrl).origin;
      await context.addCookies(
        opts.cookies.map((c) => ({
          name: c.name,
          value: c.value,
          domain: new URL(origin).hostname,
          path: '/',
          httpOnly: false,
          secure: origin.startsWith('https://'),
          sameSite: 'Lax' as const,
        })),
      );
    }

    const page = await context.newPage();
    await page.emulateMedia({ media: 'print' });
    await page.goto(opts.previewUrl, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);

    const pdfBuffer = await page.pdf(pdfOptions(opts.format));
    return pdfBuffer as Buffer;
  } finally {
    try {
      await browser.close();
    } catch {
      // best-effort cleanup
    }
  }
}

/**
 * CSS pixels at 96dpi for each paper size.
 *
 * Pocket = 4.25 × 6.875 in (Mass Market Paperback). The "airport novel"
 * standard. Matches Lulu's `0425X0687...` pod_package_id; previously was
 * 4.25 × 5.5 but Lulu doesn't carry that exact trim.
 */
function paperViewport(format: ZineFormat) {
  switch (format) {
    case 'pocket':
      return { width: 408, height: 660 };
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
    case 'pocket':
      return { ...common, width: '4.25in', height: '6.875in' };
    case 'letter':
    default:
      return { ...common, format: 'Letter' as const };
  }
}

/** Helper to build a slugified filename for the PDF. */
export function buildPdfFilename(zine: {
  title: string | null;
  issue_number: number;
  format: ZineFormat;
}): string {
  const titleSlug = (zine.title || `issue-${zine.issue_number}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${titleSlug || 'vision-zine'}-${zine.format}.pdf`;
}
