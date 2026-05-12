import { Barcode, BrandMark, romanize } from '../atoms';
import type { SpreadProps } from '../types';

/**
 * Cover — yellow page, ink-bordered frame, dramatic stroked masthead,
 * a generated TOC, and a feature block. The masthead text is derived from
 * the zine title or falls back to the issue Roman numeral.
 */
export function Cover({ data }: SpreadProps) {
  const { zine, personal } = data;
  const issue = romanize(zine.issue_number);
  const displayName = personal.display_name || personal.full_name || 'you';
  const location = personal.location || 'On Earth';
  const season = seasonFromDate(zine.created_at);
  const year = new Date(zine.created_at).getFullYear();

  const mastheadText = (zine.title ? zine.title : 'VISION').toUpperCase();
  const mastheadFontSize = mastheadSizeForLength(mastheadText);
  const tocItems = buildToc(data);

  return (
    <article
      className="text-vz-ink relative overflow-hidden"
      style={{ background: 'var(--color-vz-yellow)' }}
    >
      <div
        className="border-vz-ink relative flex flex-col"
        style={{
          border: '1px solid var(--color-vz-ink)',
          margin: 'clamp(16px, 3vw, 40px)',
          padding: 'clamp(28px, 4vw, 56px)',
          minHeight: '900px',
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <span className="flex items-center gap-3">
            <span className="inline-block size-1.5 rounded-full bg-current" />
            Issue {issue}
            <span className="inline-block size-1.5 rounded-full bg-current" />
            {season} {year}
          </span>
          <BrandMark letter={(displayName?.[0] ?? 'V').toUpperCase()} />
        </div>

        {/* Overline */}
        <div
          className="mt-2 text-center"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: -6,
            position: 'relative',
            zIndex: 2,
          }}
        >
          From the desk of{' '}
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 18,
              letterSpacing: 0,
              textTransform: 'none',
              fontWeight: 400,
            }}
          >
            {displayName}
          </span>{' '}
          · {location}
        </div>

        {/* Masthead — font size adapts to title length so long titles
            like "THE BROADWATER CHRONICLE" don't bleed off the page. */}
        <h1
          aria-label={mastheadText}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: mastheadFontSize,
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            fontWeight: 400,
            margin: '0 -10px',
            color: 'var(--color-vz-yellow)',
            WebkitTextStroke: '2px var(--color-vz-ink)',
            textShadow:
              '4px 4px 0 var(--color-vz-ink), -1px 0 0 var(--color-vz-ink), 1px 0 0 var(--color-vz-ink)',
            position: 'relative',
            zIndex: 1,
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
          }}
        >
          {mastheadText}
        </h1>

        {/* Subline */}
        <div
          className="mt-2 flex flex-wrap items-center justify-center gap-3.5 text-center"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <span>The Magazine That Explains the Years Ahead</span>
          <span className="inline-block size-1 rounded-full bg-current" />
          <span>A Private Edition for {displayName}</span>
        </div>

        {/* Body: TOC + ornament */}
        <div className="mt-8 grid grow gap-8 sm:grid-cols-[1.4fr_1fr]">
          {/* TOC */}
          <div className="grid grid-cols-1 gap-x-7 sm:grid-cols-2">
            {tocItems.map((item, i) => {
              const lastTwoStart = tocItems.length - 2;
              const hasBottomBorder = i >= lastTwoStart;
              return (
                <div
                  key={item.title}
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: '24px 1fr',
                    paddingTop: 10,
                    paddingBottom: 12,
                    borderTop: '1px solid var(--color-vz-ink)',
                    borderBottom: hasBottomBorder ? '1px solid var(--color-vz-ink)' : 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      lineHeight: 1,
                      fontWeight: 400,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 15,
                        lineHeight: 1.1,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                        fontWeight: 400,
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 13,
                        lineHeight: 1.35,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative italic mark */}
          <div className="flex flex-col items-center justify-center">
            <BrandMark
              letter={(displayName?.[0] ?? 'V').toUpperCase()}
              style={{
                width: 140,
                height: 140,
                fontSize: 96,
                borderWidth: 2,
              }}
            />
            <p
              className="mt-6 text-center"
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 22,
                lineHeight: 1.1,
                maxWidth: 240,
              }}
            >
              Always seeing forward.
            </p>
          </div>
        </div>

        {/* Feature block */}
        <div
          className="mt-8 grid items-end gap-8 pt-5 sm:grid-cols-[1.4fr_1fr]"
          style={{ borderTop: '1px solid var(--color-vz-ink)' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(34px, 5vw, 64px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              fontWeight: 400,
            }}
          >
            {tocItems[0]?.title === 'The Vision' ? (
              <>
                Inside: the <em>year ahead</em>, in plain ink.
              </>
            ) : (
              <>
                A magazine for <em>your year</em>.
              </>
            )}
          </h2>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 15,
              lineHeight: 1.45,
            }}
          >
            <p>
              {tocItems.length} sections. {personal.short_intro || `Composed for ${displayName}.`}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 18,
                marginTop: 10,
                marginBottom: 4,
              }}
            >
              + a private edition.
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="mt-6 flex items-end justify-between pt-4"
          style={{
            borderTop: '1px solid var(--color-vz-ink)',
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <div className="flex flex-col leading-relaxed">
            <span>Vol. I · No. {zine.issue_number}</span>
            <span>For private circulation only</span>
          </div>
          <Barcode seed={zine.id} />
        </div>
      </div>
    </article>
  );
}

/* ---- helpers ---- */

/**
 * Adaptive masthead font-size. The prototype's "FORECAST" (8 chars) sits
 * at clamp(72, 17vw, 240). Longer titles need to shrink so the masthead
 * holds the cover frame. Tiers are tuned against DM Serif Display.
 */
function mastheadSizeForLength(text: string): string {
  const len = text.length;
  if (len <= 7) return 'clamp(80px, 17vw, 240px)'; // VISION, FORECAST
  if (len <= 11) return 'clamp(64px, 13vw, 180px)'; // ISSUE I, TWO WORDS
  if (len <= 18) return 'clamp(48px, 9vw, 120px)'; // medium-length
  if (len <= 26) return 'clamp(40px, 6vw, 88px)'; // THE BROADWATER CHRONICLE (24)
  return 'clamp(32px, 5vw, 64px)'; // very long; will likely wrap
}

function seasonFromDate(iso: string): string {
  const m = new Date(iso).getMonth();
  if (m <= 1 || m === 11) return 'Winter';
  if (m <= 4) return 'Spring';
  if (m <= 7) return 'Summer';
  return 'Autumn';
}

interface TocItem {
  title: string;
  desc: string;
  filled: boolean;
}

function buildToc(data: SpreadProps['data']): TocItem[] {
  const items: TocItem[] = [];
  const has = <K extends keyof typeof data>(key: K, check: (v: (typeof data)[K]) => boolean) =>
    check(data[key]);

  if (has('vision', (v) => !!(v.statement && v.statement.trim().length > 0))) {
    items.push({
      title: 'The Vision',
      desc: 'A first-person manifesto for the year ahead.',
      filled: true,
    });
  }
  if (has('bio', (v) => !!(v.summary && v.summary.trim().length > 0))) {
    items.push({ title: 'Bio', desc: 'A short editorial introduction.', filled: true });
  }
  if (has('resume', (v) => !!(v.highlights && v.highlights.length > 0))) {
    items.push({
      title: 'Career',
      desc: 'Highlights of the work behind the next chapter.',
      filled: true,
    });
  }
  if (
    has(
      'goals',
      (v) =>
        (v.financial?.length ?? 0) +
          (v.creative?.length ?? 0) +
          (v.place?.length ?? 0) +
          (v.body_spirit?.length ?? 0) >
        0,
    )
  ) {
    items.push({
      title: 'The Forecast',
      desc: 'Goals by domain — money, art, place, body.',
      filled: true,
    });
  }
  if (has('achievements', (v) => !!(v.items && v.items.length > 0))) {
    items.push({
      title: 'The Foundation',
      desc: 'The case for the next chapter, in evidence.',
      filled: true,
    });
  }
  if (has('tenets', (v) => !!(v.tenets && v.tenets.length > 0))) {
    items.push({
      title: 'The Daily Code',
      desc: 'Ten tenets. Read first thing. Read last thing.',
      filled: true,
    });
  }
  // Add unfilled placeholders to make the TOC look generous.
  while (items.length < 6) {
    items.push({
      title: ['Online', 'Documents', 'Co-author', 'Closing'][items.length - 2] ?? 'Section',
      desc: 'Reserved for the next issue.',
      filled: false,
    });
  }
  return items;
}
