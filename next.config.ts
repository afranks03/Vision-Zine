import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // @sparticuz/chromium ships a binary in /bin that the serverless bundler
  // can't trace. Externalize it (keep it as a runtime require) and trace
  // the package into the function bundle so the binary is available at
  // /var/task/node_modules/@sparticuz/chromium/bin on Vercel.
  serverExternalPackages: ['@sparticuz/chromium', 'playwright-core'],
  outputFileTracingIncludes: {
    '/api/zines/[id]/pdf': ['./node_modules/@sparticuz/chromium/**/*'],
  },
};

export default nextConfig;
