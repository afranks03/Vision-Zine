'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Eyebrow, Meta } from '@/components/editorial';

/**
 * Root error boundary (Phase 5e). Catches unexpected JS errors thrown
 * by any descendant route. Editorial fallback with a "try again" button
 * (reset()) and a way back to the dashboard or home.
 *
 * Phase 6 will plug Sentry into the useEffect log call.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side logged via Next.js; client log is useful in dev.
    // Phase 6: Sentry.captureException(error).
    console.error('[app error boundary]', error);
  }, [error]);

  return (
    <div className="bg-vz-oat flex min-h-screen items-center justify-center px-6 py-20">
      <div className="border-vz-ink bg-vz-cream w-full max-w-xl border p-10 sm:p-14">
        <Eyebrow className="text-vz-coral">Error</Eyebrow>
        <h1
          className="font-display mt-3 leading-[0.95] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}
        >
          <em>Something</em> went sideways.
        </h1>
        <p className="vz-prose text-vz-ink/75 mt-6 max-w-prose text-base">
          A piece of the page didn&rsquo;t render. It&rsquo;s on our end, not yours. Try again, or
          go somewhere safer while we look into it.
        </p>

        {error.digest && (
          <Meta className="text-vz-ink/40 mt-5 block font-mono">Reference: {error.digest}</Meta>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="vz-eyebrow border-vz-ink bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream cursor-pointer border px-4 py-2 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/app"
            className="vz-eyebrow border-vz-ink text-vz-ink hover:bg-vz-yellow border px-4 py-2 transition-colors"
          >
            Open dashboard
          </Link>
          <Link
            href="/"
            className="vz-eyebrow text-vz-ink/60 hover:text-vz-coral transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
