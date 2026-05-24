import type { Metadata } from 'next';
import { PlausibleScript } from '@/components/analytics/plausible';
import { allFontVariables } from '@/lib/typography/presets';
import './globals.css';

// All preset fonts are declared centrally in lib/typography/presets.ts
// and exposed via CSS variables (--font-dm-serif-display, etc.).
// globals.css :root binds the "active" --font-display / --font-serif /
// --font-sans to the Editorial preset; the zine root overrides them
// per-zine via inline style for non-default presets.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vision Zine — Editorial vision boards, printed.',
    template: '%s · Vision Zine',
  },
  description:
    'Turn the story of your year into a printable, shareable magazine. Editorial typography, real paper, your life on the cover.',
  openGraph: {
    type: 'website',
    siteName: 'Vision Zine',
    url: SITE_URL,
    title: 'Vision Zine — Editorial vision boards, printed.',
    description:
      'Turn the story of your year into a printable, shareable magazine. Editorial typography, real paper, your life on the cover.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${allFontVariables} h-full antialiased`}>
      <head>
        <PlausibleScript />
      </head>
      <body className="bg-background text-foreground flex min-h-full flex-col font-serif">
        {children}
      </body>
    </html>
  );
}
