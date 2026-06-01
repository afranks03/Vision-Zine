import type { ZineFormat } from '@/lib/supabase/types';
import { romanize } from './atoms';
import type { SpreadPalette } from './styles';

/**
 * Page chrome (Phase 3d-iii). Wraps each inner spread with running
 * head + page number. The cover is intentionally unwrapped — real
 * magazines don't number their cover or print running heads on it.
 *
 * Variant maps to verso/recto positioning (the side the chrome sits on):
 *   - verso (even-numbered): page number on the left, running head right
 *   - recto (odd-numbered):  page number on the right, running head left
 *
 * Format-aware density: Pocket pages get only a page number (no
 * running head) since the trim is too small to carry both legibly.
 */
export type PageVariant = 'verso' | 'recto';

interface PageProps {
  number: number;
  total: number;
  /** "Issue I · The Broadwater Chronicle" — usually `${IssueRoman} · ${title}` */
  runningHead: string;
  /** Section name shown small under the running head — "The Vision". */
  sectionEyebrow?: string;
  variant: PageVariant;
  palette: SpreadPalette;
  format: ZineFormat;
  children: React.ReactNode;
}

export function Page({
  number,
  total,
  runningHead,
  sectionEyebrow,
  variant,
  palette,
  format,
  children,
}: PageProps) {
  const minimal = format === 'pocket';

  return (
    <div
      className="relative"
      style={{
        // Force every wrapped spread onto its own printed page. Property
        // is ignored in screen rendering (vertical scroll keeps working
        // in the live preview), only honored by the PDF / print pipeline.
        breakBefore: 'page',
        pageBreakBefore: 'always',
      }}
    >
      {children}
      <PageChrome
        number={number}
        total={total}
        runningHead={runningHead}
        sectionEyebrow={sectionEyebrow}
        variant={variant}
        palette={palette}
        minimal={minimal}
      />
    </div>
  );
}

function PageChrome({
  number,
  total,
  runningHead,
  sectionEyebrow,
  variant,
  palette,
  minimal,
}: {
  number: number;
  total: number;
  runningHead: string;
  sectionEyebrow?: string;
  variant: PageVariant;
  palette: SpreadPalette;
  minimal: boolean;
}) {
  // Stamp at the bottom-outside corner of the page (book-publishing
  // convention). Verso pages: outside = left. Recto pages: outside =
  // right. We position chrome inside the page so it never bleeds.
  const outside = variant === 'verso' ? 'left' : 'right';

  return (
    <>
      {/* Top running head — only on Letter (skipped for Pocket) */}
      {!minimal && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex items-baseline justify-between px-8 pt-4 print:px-6"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: palette.fg,
            opacity: 0.55,
          }}
        >
          {variant === 'verso' ? (
            <>
              <span>{runningHead}</span>
              <span>{sectionEyebrow}</span>
            </>
          ) : (
            <>
              <span>{sectionEyebrow}</span>
              <span>{runningHead}</span>
            </>
          )}
        </div>
      )}

      {/* Bottom page number — bottom-outside corner */}
      <div
        className="pointer-events-none absolute bottom-0 px-8 pb-4 print:px-6"
        style={{
          [outside]: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: palette.fg,
          opacity: 0.6,
        }}
      >
        <span>
          {number} <span style={{ opacity: 0.5 }}>/ {total}</span>
        </span>
      </div>
    </>
  );
}

/**
 * Compose the running head for an issue. Used by the Zine root when
 * wrapping each spread. Falls back gracefully when title is null.
 */
export function buildRunningHead(zine: {
  title: string | null;
  issue_number: number;
}): string {
  const issue = `Issue ${romanize(zine.issue_number)}`;
  return zine.title ? `${issue} · ${zine.title}` : issue;
}
