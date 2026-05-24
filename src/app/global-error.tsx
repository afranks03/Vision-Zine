'use client';

import { useEffect } from 'react';

/**
 * Global error boundary (Phase 5e). Catches errors that escape even
 * the root layout — when error.tsx itself can't render. Next.js
 * requires this file to declare its own <html> + <body> since the
 * normal layout is unavailable.
 *
 * Bare-bones on purpose: if we're here, even Tailwind / next/font may
 * not have loaded. Inline styles are the safest path.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global error boundary]', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          backgroundColor: '#eae6d8',
          color: '#0a0a0a',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        <div
          style={{
            maxWidth: 560,
            border: '1px solid #0a0a0a',
            backgroundColor: '#f5efdd',
            padding: '40px 32px',
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
              margin: '0 0 12px',
              color: '#e8584c',
            }}
          >
            Error · Fatal
          </p>
          <h1
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 48,
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              fontWeight: 400,
              margin: '0 0 20px',
            }}
          >
            <em>The whole page</em> failed to render.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.5, margin: '0 0 20px' }}>
            Even our fallback couldn&rsquo;t load. Refresh the page, or try again in a moment.
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 700,
                opacity: 0.55,
                margin: '0 0 24px',
                fontFamily: 'Menlo, Monaco, monospace',
              }}
            >
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              backgroundColor: '#0a0a0a',
              color: '#ffd629',
              border: '1px solid #0a0a0a',
              padding: '10px 18px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
