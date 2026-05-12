import type { Browser } from 'playwright-core';

/**
 * Remote pack of the chromium binary, matched to the installed
 * @sparticuz/chromium-min version. Downloaded + cached in /tmp on the
 * function's first cold start; subsequent invocations on the same warm
 * instance reuse the cached binary.
 *
 * Why -min + remote URL: bundling the full @sparticuz/chromium package
 * via Vercel's tracer is brittle under pnpm — the bin/ directory often
 * doesn't make it into the function bundle, causing
 *   "input directory .../@sparticuz/chromium/bin does not exist"
 * at runtime. -min ships zero binary content and resolves the pack from
 * a URL we control.
 */
const CHROMIUM_PACK_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v148.0.0/chromium-v148.0.0-pack.x64.tar';

/**
 * Launch a headless Chromium for server-side rendering.
 *
 * On Vercel / AWS Lambda: download (first cold start) or read from /tmp
 * (warm) the chromium pack via @sparticuz/chromium-min, then drive it
 * with playwright-core.
 *
 * Locally: use the playwright-core cache binary. Run
 *   pnpm exec playwright install chromium
 * once on a fresh checkout.
 */
export async function launchBrowser(): Promise<Browser> {
  const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
  const { chromium: pwChromium } = await import('playwright-core');

  if (isServerless) {
    const { default: chromiumMin } = await import('@sparticuz/chromium-min');
    return pwChromium.launch({
      args: chromiumMin.args,
      executablePath: await chromiumMin.executablePath(CHROMIUM_PACK_URL),
      headless: true,
    });
  }

  return pwChromium.launch({ headless: true });
}
