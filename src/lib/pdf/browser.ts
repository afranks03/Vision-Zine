import type { Browser } from 'playwright-core';

/**
 * Launch a headless Chromium for server-side rendering.
 *
 * On Vercel / AWS Lambda: use @sparticuz/chromium (slim binary that fits in
 * the function bundle), with playwright-core.
 *
 * Locally: use the system-installed Chromium from playwright's cache. The
 * dev environment runs `playwright install chromium` once; playwright-core
 * resolves the binary from there.
 */
export async function launchBrowser(): Promise<Browser> {
  const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
  const { chromium: pwChromium } = await import('playwright-core');

  if (isServerless) {
    const { default: sparticuzChromium } = await import('@sparticuz/chromium');
    return pwChromium.launch({
      args: sparticuzChromium.args,
      executablePath: await sparticuzChromium.executablePath(),
      headless: true,
    });
  }

  // Local — playwright-core picks up Chromium from ~/Library/Caches/ms-playwright
  return pwChromium.launch({ headless: true });
}
