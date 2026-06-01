import { romanize } from '../atoms';
import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';

/**
 * The Career — Resume spread (Phase 8). Highlights of the work behind
 * this issue, rendered as a numbered list. Style-dispatcher pattern.
 */
export function Career(props: SpreadProps & { palette: SpreadPalette }) {
  switch (props.data.zine.style) {
    case 'fashion':
      return <FashionCareer {...props} />;
    case 'art_catalog':
      return <ArtCatalogCareer {...props} />;
    case 'travel':
      return <TravelCareer {...props} />;
    case 'lifestyle':
      return <LifestyleCareer {...props} />;
    case 'financial':
      return <FinancialCareer {...props} />;
    case 'editorial':
    default:
      return <EditorialCareer {...props} />;
  }
}

function highlightsOf(data: SpreadProps['data']): string[] {
  return data.resume.highlights?.filter((h) => h.trim().length > 0) ?? [];
}

/* -------------------- Editorial -------------------- */

function EditorialCareer({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const items = highlightsOf(data);
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
        <header
          className="grid items-end gap-6"
          style={{
            gridTemplateColumns: 'auto 1fr auto',
            borderBottom: `2px solid ${palette.fg}`,
            paddingBottom: 18,
            marginBottom: 'clamp(40px, 6vw, 72px)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(64px, 9vw, 120px)',
              lineHeight: 0.85,
              fontWeight: 400,
            }}
          >
            {romanize(zine.issue_number)}
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5.5vw, 72px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              fontWeight: 400,
            }}
          >
            The <em>Career</em>.
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textAlign: 'right',
              lineHeight: 1.6,
              alignSelf: 'end',
            }}
          >
            {items.length} highlight{items.length === 1 ? '' : 's'}
          </span>
        </header>

        {items.length === 0 ? (
          <p
            className="vz-prose mx-auto max-w-xl text-center"
            style={{ opacity: 0.7 }}
          >
            Fill in your Resume / Career highlights in the studio — they appear here as a numbered
            list of the work behind the year ahead.
          </p>
        ) : (
          <ol className="list-none">
            {items.map((item, i) => (
              <li
                key={i}
                className="grid items-baseline gap-4"
                style={{
                  gridTemplateColumns: '36px 1fr',
                  padding: '14px 0',
                  borderBottom: `1px solid ${palette.rule}`,
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(16px, 1.4vw, 18px)',
                  lineHeight: 1.4,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20,
                    lineHeight: 1,
                    color: palette.accent,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}

/* -------------------- Fashion (career as looks) -------------------- */

function FashionCareer({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const items = highlightsOf(data);
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
          <span>The Career · No. {romanize(zine.issue_number)}</span>
          <span>
            {items.length} look{items.length === 1 ? '' : 's'} on the runway
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
            maxWidth: '12em',
          }}
        >
          The <em style={{ color: palette.accent }}>work</em>, in passing.
        </h2>

        {items.length === 0 ? (
          <p className="font-serif italic" style={{ fontSize: 18, opacity: 0.6, maxWidth: 520 }}>
            Add Career highlights in the studio. Each becomes a look here.
          </p>
        ) : (
          <ol className="list-none">
            {items.map((item, i) => (
              <li
                key={i}
                className="grid items-baseline"
                style={{
                  gridTemplateColumns: 'auto 1fr',
                  columnGap: 'clamp(24px, 4vw, 56px)',
                  padding: 'clamp(28px, 5vw, 56px) 0',
                  borderBottom: i === items.length - 1 ? 'none' : `1px solid ${palette.rule}`,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(72px, 10vw, 144px)',
                    lineHeight: 0.85,
                    fontWeight: 400,
                    color: palette.accent,
                    width: '1.4em',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(22px, 2.6vw, 32px)',
                    lineHeight: 1.15,
                    fontWeight: 400,
                  }}
                >
                  {item}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}

/* -------------------- Art Catalog (works exhibited) -------------------- */

function ArtCatalogCareer({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const items = highlightsOf(data);
  const { zine } = data;
  const yearAcc = new Date(zine.created_at).getFullYear() % 100;

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
          <span>The Career · Works Exhibited</span>
          <span>Vol. {zine.issue_number}</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(40px, 5.5vw, 72px)',
            lineHeight: 1.05,
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
            opacity: 0.7,
            marginBottom: 'clamp(40px, 6vw, 56px)',
            maxWidth: 540,
          }}
        >
          The career as a catalog of exhibited pieces. Each entry numbered, framed, dated.
        </p>

        {items.length === 0 ? (
          <p className="font-serif italic" style={{ fontSize: 16, opacity: 0.6 }}>
            Add Career highlights in the studio. Each becomes a catalog entry here.
          </p>
        ) : (
          <ol className="list-none" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {items.map((item, i) => {
              const accession = `${String(yearAcc).padStart(2, '0')}.C${String(i + 1).padStart(3, '0')}`;
              return (
                <li
                  key={i}
                  style={{
                    border: `1px solid ${palette.fg}`,
                    padding: 'clamp(22px, 3vw, 32px)',
                  }}
                >
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
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(20px, 2.2vw, 26px)',
                      lineHeight: 1.15,
                      fontWeight: 400,
                    }}
                  >
                    {item}
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

/* -------------------- Travel (career as expeditions) -------------------- */

function TravelCareer({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const items = highlightsOf(data);
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
        <div
          className="flex items-baseline justify-between"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            borderTop: `2px solid ${palette.fg}`,
            borderBottom: `1px solid ${palette.fg}`,
            padding: '12px 0',
            marginBottom: 'clamp(40px, 6vw, 64px)',
          }}
        >
          <span>The Career · Past Expeditions</span>
          <span>Volume {zine.issue_number}</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 7vw, 96px)',
            lineHeight: 0.95,
            letterSpacing: '-0.018em',
            fontWeight: 400,
            margin: '0 0 16px',
            maxWidth: '14ch',
          }}
        >
          Where the <em style={{ color: palette.accent }}>work</em> has gone.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 15,
            opacity: 0.7,
            marginBottom: 'clamp(40px, 6vw, 56px)',
            maxWidth: 540,
          }}
        >
          A log of routes the career has taken. Each highlight a leg in a longer journey.
        </p>

        {items.length === 0 ? (
          <p className="font-serif italic" style={{ fontSize: 16, opacity: 0.6 }}>
            Add Career highlights in the studio. Each becomes a leg in the log here.
          </p>
        ) : (
          <ol className="list-none">
            {items.map((item, i) => (
              <li
                key={i}
                className="grid items-baseline"
                style={{
                  gridTemplateColumns: '90px 1fr',
                  columnGap: 'clamp(16px, 2vw, 28px)',
                  padding: 'clamp(20px, 3vw, 28px) 0',
                  borderTop: `1px solid ${palette.rule}`,
                  borderBottom: i === items.length - 1 ? `2px solid ${palette.fg}` : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: palette.accent,
                  }}
                >
                  Leg {String(i + 1).padStart(2, '0')}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(20px, 2.2vw, 28px)',
                    lineHeight: 1.15,
                  }}
                >
                  {item}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}

/* -------------------- Lifestyle (quiet) -------------------- */

function LifestyleCareer({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const items = highlightsOf(data);

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(80px, 12vw, 180px)',
          paddingBottom: 'clamp(80px, 12vw, 180px)',
          maxWidth: 620,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 24,
            opacity: 0.7,
          }}
        >
          The career
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(36px, 5vw, 56px)',
            lineHeight: 1.05,
            fontWeight: 400,
            margin: '0 0 16px',
          }}
        >
          What I&apos;ve been doing.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 15,
            opacity: 0.7,
            marginBottom: 'clamp(48px, 7vw, 72px)',
          }}
        >
          A short list of the things that filled the years.
        </p>

        {items.length === 0 ? (
          <p className="font-serif italic" style={{ fontSize: 16, opacity: 0.6 }}>
            Add Career highlights in the studio. They&apos;ll appear as a quiet centered list.
          </p>
        ) : (
          <ol
            className="list-none"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(24px, 3.5vw, 36px)',
              textAlign: 'center',
            }}
          >
            {items.map((item, i) => (
              <li key={i}>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(22px, 2.6vw, 28px)',
                    lineHeight: 1.2,
                    fontWeight: 400,
                  }}
                >
                  {item}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}

/* -------------------- Financial (positions held ledger) -------------------- */

function FinancialCareer({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const items = highlightsOf(data);
  const { zine } = data;
  const year = new Date(zine.created_at).getFullYear();

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
        }}
      >
        <div
          className="flex items-baseline justify-between"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            borderTop: `2px solid ${palette.fg}`,
            borderBottom: `1px solid ${palette.fg}`,
            padding: '10px 0',
            marginBottom: 28,
          }}
        >
          <span>The Career · Track Record</span>
          <span>FY {year} · Vol. {zine.issue_number}</span>
        </div>

        <div className="mb-10 flex items-baseline justify-between">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1,
              letterSpacing: '-0.018em',
              fontWeight: 400,
              margin: 0,
            }}
          >
            Positions, held.
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.6,
            }}
          >
            {items.length} of record
          </span>
        </div>

        {items.length === 0 ? (
          <p className="font-serif italic" style={{ fontSize: 16, opacity: 0.6 }}>
            Add Career highlights in the studio. They post to the track record here.
          </p>
        ) : (
          <ol className="list-none" style={{ borderTop: `1px solid ${palette.fg}` }}>
            {items.map((item, i) => (
              <li
                key={i}
                className="grid items-baseline"
                style={{
                  gridTemplateColumns: '60px 1fr',
                  columnGap: 18,
                  padding: '14px 0',
                  borderBottom: `1px solid ${palette.rule}`,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: palette.accent,
                  }}
                >
                  § {String(i + 1).padStart(2, '0')}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(16px, 1.7vw, 19px)',
                    lineHeight: 1.45,
                  }}
                >
                  {item}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}
