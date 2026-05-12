#!/usr/bin/env node
/**
 * Capture screenshots of every public route at desktop + mobile breakpoints.
 *
 * Usage:
 *   pnpm exec node scripts/screenshot.mjs                 # against localhost:3000
 *   BASE_URL=https://... pnpm exec node scripts/screenshot.mjs
 *
 * Output: design/screenshots/{route-name}-{1440|390}.png
 */
// playwright-core resolves chromium from ~/Library/Caches/ms-playwright after
// `pnpm exec playwright install chromium` has been run once.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUT_DIR = 'design/screenshots';

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/examples', name: 'examples' },
  { path: '/pricing', name: 'pricing' },
  { path: '/about', name: 'about' },
  { path: '/faq', name: 'faq' },
  { path: '/signin', name: 'signin' },
  { path: '/styleguide', name: 'styleguide' },
  // Note: /app routes are auth-gated; we'd need to inject a session cookie
  // to capture them. Out of scope for this pass — Adrian can screenshot the
  // signed-in views himself for now.
];

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900, deviceScaleFactor: 2 },
  { name: '390', width: 390, height: 844, deviceScaleFactor: 2 }, // iPhone 14
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const results = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.deviceScaleFactor,
    });
    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `${BASE_URL}${route.path}`;
      const file = `${route.name}-${viewport.name}.png`;
      const out = join(OUT_DIR, file);

      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
        // Wait for fonts to be ready.
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: out, fullPage: true });
        results.push({ ok: true, route: route.path, viewport: viewport.name, file });
        console.log(`  ✓ ${file}`);
      } catch (err) {
        results.push({ ok: false, route: route.path, viewport: viewport.name, error: String(err) });
        console.error(`  ✗ ${file}: ${err.message}`);
      }
    }

    await context.close();
  }

  await browser.close();

  const ok = results.filter((r) => r.ok).length;
  const fail = results.length - ok;
  console.log(`\n${ok} captured, ${fail} failed.`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
