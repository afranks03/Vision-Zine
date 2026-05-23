import { romanize } from '../atoms';
import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';

/**
 * The Foundation — Achievements spread. Style-dispatcher (Phase 3d-iv).
 *
 * Editorial variant: numbered receipts in two columns. The original
 * Vision Zine treatment, preserved.
 *
 * Fashion variant: runway-list. Single column, generous breathing,
 * huge display-serif numerals, year and tag arranged like a magazine's
 * fashion credit. Each item reads like a runway "look."
 */
export function Foundation(props: SpreadProps & { palette: SpreadPalette }) {
  switch (props.data.zine.style) {
    case 'fashion':
      return <FashionFoundation {...props} />;
    case 'art_catalog':
      return <ArtCatalogFoundation {...props} />;
    case 'editorial':
    case 'lifestyle':
    case 'travel':
    case 'financial':
    default:
      return <EditorialFoundation {...props} />;
  }
}

/* -------------------- Editorial (baseline) -------------------- */

function EditorialFoundation({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const items = data.achievements.items ?? [];

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
        }}
      >
        <FoundationQuote palette={palette} />

        {items.length === 0 ? (
          <p className="vz-prose mx-auto max-w-xl text-center opacity-70">
            Add achievements in the studio — Title, Year, Tag — and they&apos;ll appear here as
            numbered receipts across two columns.
          </p>
        ) : (
          <ol
            className="list-none"
            style={{
              columns: 2,
              columnGap: 48,
            }}
          >
            {items.map((item, i) => (
              <li
                key={i}
                className="grid items-baseline gap-3.5"
                style={{
                  gridTemplateColumns: '36px 1fr auto',
                  breakInside: 'avoid',
                  borderBottom: `1px solid ${palette.fg}`,
                  padding: '14px 0',
                  fontFamily: 'var(--font-serif)',
                  fontSize: 16,
                  lineHeight: 1.4,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                >
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <span>
                  {item.title}
                  {item.year && (
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontStyle: 'italic',
                        marginLeft: 8,
                        opacity: 0.6,
                      }}
                    >
                      {item.year}
                    </span>
                  )}
                </span>
                {item.tag && (
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: palette.fg,
                      color: palette.bg,
                      padding: '3px 7px',
                      whiteSpace: 'nowrap',
                      alignSelf: 'center',
                    }}
                  >
                    {item.tag}
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}

function FoundationQuote({ palette }: { palette: SpreadPalette }) {
  return (
    <blockquote
      className="mx-auto text-center"
      style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: 'clamp(24px, 3vw, 38px)',
        lineHeight: 1.2,
        fontWeight: 400,
        maxWidth: 780,
        margin: '0 auto clamp(40px, 6vw, 72px)',
        padding: '0 24px',
        position: 'relative',
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'block',
          width: 80,
          height: 2,
          background: palette.fg,
          margin: '18px auto',
        }}
      />
      The case for the next chapter, in receipts.
      <span
        aria-hidden
        style={{
          display: 'block',
          width: 80,
          height: 2,
          background: palette.fg,
          margin: '18px auto',
        }}
      />
    </blockquote>
  );
}

/* -------------------- Art Catalog (museum wall labels) -------------------- */

function ArtCatalogFoundation({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const items = data.achievements.items ?? [];
  const { zine } = data;
  const displayName = data.personal.display_name || data.personal.full_name || 'the artist';
  const yearAcc = new Date(zine.created_at).getFullYear() % 100; // last 2 digits

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
          maxWidth: 760,
        }}
      >
        {/* Catalog cover-strip eyebrow */}
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
          <span>The Foundation</span>
          <span>Catalogue Raisonné · {zine.created_at.slice(0, 4)}</span>
        </div>

        {/* Reserved gallery title */}
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
          Selected works.
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
          A record of acquisitions and exhibitions assembled by {displayName} for the present
          volume. Each entry catalogued by year, medium, and accession.
        </p>

        {items.length === 0 ? (
          <p
            className="font-serif italic"
            style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.6 }}
          >
            Add achievements in the studio. Each becomes a wall label here — accession number,
            year, medium, title.
          </p>
        ) : (
          <ol className="list-none" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {items.map((item, i) => {
              const accession = `${String(yearAcc).padStart(2, '0')}.${String(i + 1).padStart(3, '0')}`;
              return (
                <li
                  key={i}
                  style={{
                    border: `1px solid ${palette.fg}`,
                    padding: 'clamp(22px, 3vw, 32px)',
                  }}
                >
                  {/* Accession number */}
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      color: palette.accent,
                      marginBottom: 12,
                    }}
                  >
                    Acc. No. {accession}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(22px, 2.4vw, 32px)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.005em',
                      fontWeight: 400,
                      marginBottom: 8,
                    }}
                  >
                    {item.title}.
                  </h3>

                  {/* Year + medium ("tag") line */}
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      opacity: 0.7,
                    }}
                  >
                    {item.year ? <span>{item.year}</span> : null}
                    {item.year && item.tag ? <span> · </span> : null}
                    {item.tag ? <span>{item.tag}</span> : null}
                    {!item.year && !item.tag ? <span>Undated · Mixed media</span> : null}
                  </p>
                </li>
              );
            })}
          </ol>
        )}

        {/* Catalog footer */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginTop: 'clamp(40px, 6vw, 64px)',
            opacity: 0.5,
          }}
        >
          Catalogued by {displayName} · Volume {zine.issue_number}
        </p>
      </div>
    </article>
  );
}

/* -------------------- Fashion (runway list) -------------------- */

function FashionFoundation({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const items = data.achievements.items ?? [];
  const { zine } = data;

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
        }}
      >
        {/* Eyebrow + big editorial headline */}
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
          <span>Foundation · No. {romanize(zine.issue_number)}</span>
          <span>
            {items.length} look{items.length === 1 ? '' : 's'}
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px, 9vw, 132px)',
            lineHeight: 0.88,
            letterSpacing: '-0.025em',
            fontWeight: 400,
            margin: '36px 0 56px',
            maxWidth: '11em',
          }}
        >
          The work <em style={{ color: palette.accent }}>behind</em> the next chapter.
        </h2>

        {items.length === 0 ? (
          <p
            className="font-serif italic"
            style={{
              fontSize: 18,
              lineHeight: 1.45,
              opacity: 0.6,
              maxWidth: 520,
            }}
          >
            Add achievements in the studio — Title, Year, Tag. Each appears here as a runway look
            with a huge numeral and an editor&apos;s tag.
          </p>
        ) : (
          <ol className="list-none">
            {items.map((item, i) => (
              <li
                key={i}
                className="grid items-baseline"
                style={{
                  gridTemplateColumns: 'auto 1fr auto',
                  columnGap: 'clamp(24px, 4vw, 56px)',
                  rowGap: 4,
                  padding: 'clamp(28px, 5vw, 56px) 0',
                  borderBottom: i === items.length - 1 ? 'none' : `1px solid ${palette.rule}`,
                }}
              >
                {/* Big runway numeral */}
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(72px, 10vw, 144px)',
                    lineHeight: 0.85,
                    fontWeight: 400,
                    color: palette.accent,
                    fontStyle: 'italic',
                    width: '1.4em',
                  }}
                >
                  {(i + 1).toString().padStart(2, '0')}
                </span>

                {/* Title + year */}
                <div className="flex flex-col">
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(28px, 3.5vw, 44px)',
                      lineHeight: 1.05,
                      letterSpacing: '-0.012em',
                      fontWeight: 400,
                    }}
                  >
                    {item.title}
                  </span>
                  {item.year && (
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        marginTop: 10,
                        opacity: 0.6,
                      }}
                    >
                      {item.year}
                    </span>
                  )}
                </div>

                {/* Tag — bold magazine credit-pill, vertical on right */}
                {item.tag && (
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      borderLeft: `2px solid ${palette.accent}`,
                      paddingLeft: 10,
                      paddingTop: 6,
                      paddingBottom: 6,
                      alignSelf: 'stretch',
                    }}
                  >
                    {item.tag}
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}

        {/* End-of-feature marker */}
        {items.length > 0 && (
          <div
            className="mt-12 flex items-center justify-center gap-3"
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
            End of looks
            <span style={{ display: 'block', width: 36, height: 1, background: palette.accent }} />
          </div>
        )}
      </div>
    </article>
  );
}
