import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, Meta } from '@/components/editorial';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

/**
 * Global 404 (Phase 5e). Catches anywhere `notFound()` is called or
 * an unmatched route is requested. Editorial fallback — not a generic
 * "Page not found" but a quiet "This page hasn't been written."
 */
export default function NotFound() {
  return (
    <div className="bg-vz-oat flex min-h-screen items-center justify-center px-6 py-20">
      <div className="border-vz-ink bg-vz-cream w-full max-w-xl border p-10 sm:p-14">
        <Eyebrow className="text-vz-coral">Error · 404</Eyebrow>
        <h1
          className="font-display mt-3 leading-[0.95] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}
        >
          This page <em>hasn&rsquo;t been written</em>.
        </h1>
        <p className="vz-prose text-vz-ink/75 mt-6 max-w-prose text-base">
          The URL doesn&rsquo;t match anything in this issue. Either the link is wrong, the page
          was archived, or it never existed. Three doors back:
        </p>
        <ul className="vz-prose text-vz-ink mt-5 list-none space-y-1.5 text-base">
          <li>
            ·{' '}
            <Link href="/" className="hover:text-vz-coral underline-offset-2 hover:underline">
              The cover (home)
            </Link>
          </li>
          <li>
            ·{' '}
            <Link
              href="/examples"
              className="hover:text-vz-coral underline-offset-2 hover:underline"
            >
              Examples
            </Link>
          </li>
          <li>
            ·{' '}
            <Link href="/app" className="hover:text-vz-coral underline-offset-2 hover:underline">
              Your dashboard
            </Link>
          </li>
        </ul>
        <Meta className="text-vz-ink/50 mt-9 block">Vision Zine · Brooklyn × Athens</Meta>
      </div>
    </div>
  );
}
