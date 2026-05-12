import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // playwright-core and @sparticuz/chromium-min both rely on filesystem
  // resolution (playwright-core's browser binary cache, chromium-min's
  // /tmp pack). Keep them external so the bundler doesn't relocate them.
  serverExternalPackages: ['@sparticuz/chromium-min', 'playwright-core'],
};

export default nextConfig;
