import { romanize } from '../atoms';
import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';

/**
 * The Daily Code — Tenets spread. Style-dispatcher (Phase 3d-iv).
 *
 * Editorial variant: bordered 2-column grid of tenets. Original.
 *
 * Fashion variant: manifesto poster. Single column, oversized
 * numerals leading each line, generous letter-spacing on the
 * tenet text. Reads like a fashion brand's "rules" page.
 */
export function DailyCode(props: SpreadProps & { palette: SpreadPalette }) {
  switch (props.data.zine.style) {
    case 'fashion':
      return <FashionDailyCode {...props} />;
    case 'art_catalog':
      return <ArtCatalogDailyCode {...props} />;
    case 'editorial':
    case 'lifestyle':
    case 'travel':
    case 'financial':
    default:
      return <EditorialDailyCode {...props} />;
  }
}

/* -------------------- Editorial (baseline) -------------------- */

function EditorialDailyCode({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const tenets = data.tenets.tenets?.filter((t) => t.trim().length > 0) ?? [];

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
        }}
      >
        <h2
          className="mx-auto text-center"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 128px)',
            lineHeight: 0.85,
            letterSpacing: '-0.03em',
            fontWeight: 400,
            margin: '0 auto clamp(48px, 7vw, 84px)',
            maxWidth: 1000,
          }}
        >
          The <em>Daily</em> Code.
        </h2>

        {tenets.length === 0 ? (
          <p className="vz-prose mx-auto max-w-xl text-center opacity-70">
            Add tenets in the studio — short, declarative, first-person ideally. Each one appears in
            its own framed cell here.
          </p>
        ) : (
          <ol
            className="grid list-none"
            style={{
              gridTemplateColumns: 'repeat(2, 1fr)',
              border: `1px solid ${palette.fg}`,
            }}
          >
            {tenets.map((tenet, i) => {
              const isLastRowFirst = i >= tenets.length - 2 && i % 2 === 0;
              const isLastRowSecond = i === tenets.length - 1 && i % 2 === 1;
              const isLastTwo = isLastRowFirst || isLastRowSecond || i === tenets.length - 1;
              return (
                <li
                  key={i}
                  className="grid items-start"
                  style={{
                    gridTemplateColumns: 'auto 1fr',
                    padding: 'clamp(20px, 3vw, 32px)',
                    borderRight: i % 2 === 0 ? `1px solid ${palette.fg}` : 'none',
                    borderBottom: isLastTwo ? 'none' : `1px solid ${palette.fg}`,
                    gap: 18,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 48,
                      lineHeight: 0.85,
                      fontWeight: 400,
                    }}
                  >
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 17,
                      lineHeight: 1.4,
                      fontWeight: 400,
                    }}
                  >
                    {tenet}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </article>
  );
}

/* -------------------- Art Catalog (exhibition placards) -------------------- */

function ArtCatalogDailyCode({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { zine } = data;
  const tenets = data.tenets.tenets?.filter((t) => t.trim().length > 0) ?? [];

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
          maxWidth: 920,
        }}
      >
        {/* Catalog eyebrow */}
        <div
          className="flex items-baseline justify-between"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            borderTop: `1px solid ${palette.fg}`,
            borderBottom: `1px solid ${palette.fg}`,
            padding: '10px 0',
            marginBottom: 'clamp(40px, 6vw, 64px)',
          }}
        >
          <span>The Daily Code · Wall Texts</span>
          <span>Vol. {zine.issue_number}</span>
        </div>

        {/* Quiet italic title */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(40px, 5.5vw, 72px)',
            lineHeight: 1.05,
            letterSpacing: '-0.012em',
            fontWeight: 400,
            margin: '0 0 14px',
          }}
        >
          Ten placards.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.5,
            opacity: 0.7,
            marginBottom: 'clamp(40px, 6vw, 64px)',
            maxWidth: 560,
          }}
        >
          Read on the wall, in passing. Tenets framed like exhibition labels — small, declarative,
          one beside the next.
        </p>

        {tenets.length === 0 ? (
          <p
            className="font-serif italic"
            style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.6 }}
          >
            Add tenets in the studio. Each becomes a placard here.
          </p>
        ) : (
          <ol
            className="grid list-none"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {tenets.map((tenet, i) => (
              <li
                key={i}
                style={{
                  border: `1px solid ${palette.fg}`,
                  padding: 'clamp(18px, 2.4vw, 26px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: palette.accent,
                  }}
                >
                  Placard {String(i + 1).padStart(2, '0')}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(18px, 1.9vw, 22px)',
                    lineHeight: 1.25,
                    letterSpacing: '-0.005em',
                    fontWeight: 400,
                  }}
                >
                  {tenet}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}

/* -------------------- Fashion (manifesto) -------------------- */

function FashionDailyCode({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { zine } = data;
  const tenets = data.tenets.tenets?.filter((t) => t.trim().length > 0) ?? [];

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
        }}
      >
        {/* Eyebrow strip */}
        <div
          className="flex items-baseline justify-between"
          style={{
            borderBottom: `2px solid ${palette.fg}`,
            paddingBottom: 14,
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <span>The Daily Code · No. {romanize(zine.issue_number)}</span>
          <span>
            {tenets.length} tenet{tenets.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Manifesto headline */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px, 9vw, 140px)',
            lineHeight: 0.85,
            letterSpacing: '-0.03em',
            fontWeight: 400,
            margin: '36px 0 56px',
            maxWidth: '11em',
          }}
        >
          <em style={{ color: palette.accent }}>Read first thing.</em>
          <br />
          Read last thing.
        </h2>

        {tenets.length === 0 ? (
          <p
            className="font-serif italic"
            style={{ fontSize: 18, lineHeight: 1.45, opacity: 0.6, maxWidth: 520 }}
          >
            Add tenets in the studio — short, declarative, first-person. Each one becomes a line of
            the manifesto.
          </p>
        ) : (
          <ol className="list-none">
            {tenets.map((tenet, i) => (
              <li
                key={i}
                className="grid items-baseline gap-6"
                style={{
                  gridTemplateColumns: 'auto 1fr',
                  padding: 'clamp(18px, 3vw, 32px) 0',
                  borderBottom: i === tenets.length - 1 ? 'none' : `1px solid ${palette.rule}`,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(56px, 7vw, 96px)',
                    lineHeight: 0.85,
                    fontWeight: 400,
                    color: palette.accent,
                    width: '2.2ch',
                  }}
                >
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(24px, 2.8vw, 36px)',
                    lineHeight: 1.15,
                    letterSpacing: '-0.005em',
                    fontWeight: 400,
                  }}
                >
                  {tenet}
                </p>
              </li>
            ))}
          </ol>
        )}

        {/* Closing tag */}
        {tenets.length > 0 && (
          <div
            className="mt-12 flex items-center justify-end gap-3"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: palette.accent,
            }}
          >
            <span style={{ display: 'block', width: 36, height: 1, background: palette.accent }} />
            <span>The Daily Code</span>
          </div>
        )}
      </div>
    </article>
  );
}
