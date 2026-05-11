import type { Metadata } from 'next';
import { Archivo, DM_Serif_Display, Source_Serif_4 } from 'next/font/google';
import './globals.css';

// Editorial display — used for headlines and the magazine masthead.
const dmSerifDisplay = DM_Serif_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
});

// Body serif — used for long-form reading copy.
const sourceSerif = Source_Serif_4({
  variable: '--font-serif',
  subsets: ['latin'],
});

// UI sans — used for labels, navigation, eyebrows.
const archivo = Archivo({
  variable: '--font-sans',
  subsets: ['latin'],
});

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
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${sourceSerif.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col font-serif">
        {children}
      </body>
    </html>
  );
}
