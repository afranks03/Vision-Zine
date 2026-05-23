import { romanize } from '../atoms';
import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';

const CLUSTERS: {
  key: 'financial' | 'creative' | 'place' | 'body_spirit';
  label: string;
}[] = [
  { key: 'financial', label: 'Financial' },
  { key: 'creative', label: 'Creative' },
  { key: 'place', label: 'Place' },
  { key: 'body_spirit', label: 'Body & Spirit' },
];

/**
 * The Forecast — Goals spread. Style-dispatcher (Phase 3d-iv).
 *
 * Editorial variant: four-quadrant grid, palette-tinted. Original.
 *
 * Fashion variant: four "looks" instead of quadrants. Each cluster
 * is a full-width band with a huge "LOOK 01 — FINANCIAL" header
 * and items below, runway-style.
 */
export function Forecast(props: SpreadProps & { palette: SpreadPalette }) {
  switch (props.data.zine.style) {
    case 'fashion':
      return <FashionForecast {...props} />;
    case 'editorial':
    case 'lifestyle':
    case 'art_catalog':
    case 'travel':
    case 'financial':
    default:
      return <EditorialForecast {...props} />;
  }
}

/* -------------------- Editorial (baseline) -------------------- */

function EditorialForecast({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { goals, zine } = data;
  const total =
    (goals.financial?.length ?? 0) +
    (goals.creative?.length ?? 0) +
    (goals.place?.length ?? 0) +
    (goals.body_spirit?.length ?? 0);

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
              textAlign: 'left',
            }}
          >
            The <em>Forecast</em>.
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
            {total} goal{total === 1 ? '' : 's'}
            <br />
            this issue
          </span>
        </header>

        {total === 0 ? (
          <p
            className="vz-prose mx-auto max-w-xl"
            style={{ color: palette.fg, opacity: 0.7, textAlign: 'center' }}
          >
            Fill in the Goals section in the studio — financial, creative, place, body &amp; spirit
            — and they&apos;ll appear here, sorted and ruled.
          </p>
        ) : (
          <div className="grid gap-12 md:grid-cols-2" style={{ columnGap: 64, rowGap: 48 }}>
            {CLUSTERS.map((cluster, idx) => {
              const items = goals[cluster.key] ?? [];
              return (
                <div key={cluster.key}>
                  <div
                    className="flex items-baseline gap-3.5 pb-2.5"
                    style={{
                      borderBottom: `1px solid ${palette.fg}`,
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 36,
                        lineHeight: 1,
                        fontWeight: 400,
                        color: palette.accent,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {cluster.label}
                    </span>
                  </div>
                  <ol className="list-none">
                    {items.length === 0 ? (
                      <li
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 15,
                          fontStyle: 'italic',
                          opacity: 0.5,
                          padding: '12px 0',
                        }}
                      >
                        — nothing here yet —
                      </li>
                    ) : (
                      items.map((item, i) => (
                        <li
                          key={i}
                          className="grid items-center gap-3.5"
                          style={{
                            gridTemplateColumns: '36px 1fr',
                            padding: '12px 0',
                            borderBottom: `1px solid ${palette.rule}`,
                            fontFamily: 'var(--font-serif)',
                            fontSize: 17,
                            lineHeight: 1.4,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: '0.06em',
                              color: palette.accent,
                            }}
                          >
                            {(i + 1).toString().padStart(2, '0')}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))
                    )}
                  </ol>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

/* -------------------- Fashion (four looks) -------------------- */

function FashionForecast({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { goals, zine } = data;
  const total =
    (goals.financial?.length ?? 0) +
    (goals.creative?.length ?? 0) +
    (goals.place?.length ?? 0) +
    (goals.body_spirit?.length ?? 0);

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
          <span>The Forecast · No. {romanize(zine.issue_number)}</span>
          <span>
            {total} goal{total === 1 ? '' : 's'} in four looks
          </span>
        </div>

        {/* Big italic headline */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 7vw, 108px)',
            lineHeight: 0.88,
            letterSpacing: '-0.025em',
            fontWeight: 400,
            margin: '36px 0 56px',
            maxWidth: '13em',
          }}
        >
          The year ahead, <em style={{ color: palette.accent }}>in four looks</em>.
        </h2>

        {total === 0 ? (
          <p
            className="font-serif italic"
            style={{ fontSize: 18, lineHeight: 1.45, opacity: 0.6, maxWidth: 520 }}
          >
            Add goals to financial, creative, place, body &amp; spirit in the studio. Each cluster
            becomes a look in this lineup.
          </p>
        ) : (
          <ol className="list-none flex flex-col" style={{ gap: 'clamp(36px, 5vw, 64px)' }}>
            {CLUSTERS.map((cluster, idx) => {
              const items = goals[cluster.key] ?? [];
              return (
                <li key={cluster.key}>
                  {/* Look banner */}
                  <div
                    className="flex items-baseline justify-between"
                    style={{
                      borderTop: `1px solid ${palette.rule}`,
                      paddingTop: 14,
                      marginBottom: 18,
                      gap: 24,
                    }}
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontStyle: 'italic',
                          fontSize: 'clamp(40px, 5vw, 64px)',
                          lineHeight: 1,
                          fontWeight: 400,
                          color: palette.accent,
                        }}
                      >
                        Look {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                        }}
                      >
                        — {cluster.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        opacity: 0.55,
                      }}
                    >
                      {items.length} entr{items.length === 1 ? 'y' : 'ies'}
                    </span>
                  </div>

                  {/* Items in this look */}
                  {items.length === 0 ? (
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 16,
                        fontStyle: 'italic',
                        opacity: 0.45,
                      }}
                    >
                      — empty this issue —
                    </p>
                  ) : (
                    <ul
                      className="grid list-none"
                      style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: 'clamp(12px, 1.6vw, 22px)',
                      }}
                    >
                      {items.map((item, i) => (
                        <li
                          key={i}
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 'clamp(18px, 1.9vw, 22px)',
                            lineHeight: 1.35,
                            paddingLeft: 18,
                            borderLeft: `2px solid ${palette.accent}`,
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </article>
  );
}
