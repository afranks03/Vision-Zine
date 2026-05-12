import { Barcode, BrandMark, romanize } from '../../atoms';
import type { SpreadPalette } from '../../styles';
import type { SpreadProps } from '../../types';
import { buildToc, getDisplayName, mastheadSizeForLength, seasonFromDate } from './_shared';

/**
 * Editorial cover — the canonical reference. Yellow page with an
 * ink-bordered frame, dramatic stroked masthead, generated TOC,
 * decorative italic brand mark, feature block, barcode at the bottom.
 */
export function EditorialCover({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { zine } = data;
  const displayName = getDisplayName(data);
  const location = data.personal.location || 'On Earth';
  const season = seasonFromDate(zine.created_at);
  const year = new Date(zine.created_at).getFullYear();
  const mastheadText = (zine.title ? zine.title : 'VISION').toUpperCase();
  const mastheadFontSize = mastheadSizeForLength(mastheadText);
  const tocItems = buildToc(data);

  return (
    <article
      className="relative overflow-hidden"
      style={{ background: palette.bg, color: palette.fg }}
    >
      <div
        className="relative flex flex-col"
        style={{
          border: `1px solid ${palette.fg}`,
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
            Issue {romanize(zine.issue_number)}
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

        {/* Masthead */}
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
            color: palette.bg,
            WebkitTextStroke: `2px ${palette.fg}`,
            textShadow: `4px 4px 0 ${palette.fg}, -1px 0 0 ${palette.fg}, 1px 0 0 ${palette.fg}`,
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
                    borderTop: `1px solid ${palette.fg}`,
                    borderBottom: hasBottomBorder ? `1px solid ${palette.fg}` : 'none',
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
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, lineHeight: 1.35 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-center">
            <BrandMark
              letter={(displayName?.[0] ?? 'V').toUpperCase()}
              style={{ width: 140, height: 140, fontSize: 96, borderWidth: 2 }}
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

        {/* Bottom strip */}
        <div
          className="mt-6 flex items-end justify-between pt-4"
          style={{
            borderTop: `1px solid ${palette.fg}`,
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
