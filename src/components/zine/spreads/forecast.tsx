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
    case 'art_catalog':
      return <ArtCatalogForecast {...props} />;
    case 'travel':
      return <TravelForecast {...props} />;
    case 'lifestyle':
      return <LifestyleForecast {...props} />;
    case 'financial':
      return <FinancialForecast {...props} />;
    case 'editorial':
    default:
      return <EditorialForecast {...props} />;
  }
}

const GALLERY_NUMERALS = ['I', 'II', 'III', 'IV'];

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

/* -------------------- Art Catalog (galleries) -------------------- */

function ArtCatalogForecast({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
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
          <span>The Forecast · Acquisitions by gallery</span>
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
          Galleries I–IV.
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
          Holdings catalogued under four headings: Financial, Creative, Place, Body &amp; Spirit.
          {total > 0 && (
            <>
              {' '}
              {total} entr{total === 1 ? 'y' : 'ies'} in this volume.
            </>
          )}
        </p>

        {total === 0 ? (
          <p className="font-serif italic" style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.6 }}>
            Add goals to the four clusters in the studio. Each becomes a gallery here.
          </p>
        ) : (
          <ol className="list-none" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {CLUSTERS.map((cluster, idx) => {
              const items = goals[cluster.key] ?? [];
              return (
                <li
                  key={cluster.key}
                  style={{
                    border: `1px solid ${palette.fg}`,
                    padding: 'clamp(22px, 3vw, 32px)',
                  }}
                >
                  {/* Gallery header */}
                  <div
                    className="flex items-baseline justify-between"
                    style={{
                      paddingBottom: 12,
                      marginBottom: 16,
                      borderBottom: `1px solid ${palette.rule}`,
                    }}
                  >
                    <div className="flex items-baseline gap-3">
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
                        Gallery {GALLERY_NUMERALS[idx]}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontStyle: 'italic',
                          fontSize: 22,
                          lineHeight: 1,
                          fontWeight: 400,
                        }}
                      >
                        {cluster.label}.
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        opacity: 0.55,
                      }}
                    >
                      {items.length} held
                    </span>
                  </div>

                  {/* Catalog entries */}
                  {items.length === 0 ? (
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 15,
                        fontStyle: 'italic',
                        opacity: 0.45,
                      }}
                    >
                      — gallery vacant this volume —
                    </p>
                  ) : (
                    <ol className="list-none" style={{ display: 'flex', flexDirection: 'column' }}>
                      {items.map((item, i) => (
                        <li
                          key={i}
                          className="grid"
                          style={{
                            gridTemplateColumns: '80px 1fr',
                            columnGap: 16,
                            padding: '10px 0',
                            borderBottom:
                              i === items.length - 1 ? 'none' : `1px solid ${palette.rule}`,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: '0.18em',
                              textTransform: 'uppercase',
                              opacity: 0.7,
                            }}
                          >
                            No. {(i + 1).toString().padStart(3, '0')}
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: 16,
                              lineHeight: 1.4,
                            }}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ol>
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
          <ol className="flex list-none flex-col" style={{ gap: 'clamp(36px, 5vw, 64px)' }}>
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

/* -------------------- Travel (routes) -------------------- */

function TravelForecast({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
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
          <span>The Forecast · Routes Planned</span>
          <span>Volume {zine.issue_number}</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 7vw, 96px)',
            lineHeight: 0.95,
            letterSpacing: '-0.018em',
            fontWeight: 400,
            margin: '0 0 14px',
          }}
        >
          Four <em style={{ color: palette.accent }}>routes</em> from here.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.5,
            opacity: 0.7,
            marginBottom: 'clamp(40px, 6vw, 56px)',
            maxWidth: 560,
          }}
        >
          {total} destination{total === 1 ? '' : 's'} mapped this issue. Each cluster a route, each
          entry a leg.
        </p>

        {total === 0 ? (
          <p
            className="font-serif italic"
            style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.6 }}
          >
            Add goals in the studio. Each becomes a leg on one of the routes here.
          </p>
        ) : (
          <ol className="list-none" style={{ display: 'flex', flexDirection: 'column' }}>
            {CLUSTERS.map((cluster, idx) => {
              const items = goals[cluster.key] ?? [];
              return (
                <li
                  key={cluster.key}
                  style={{
                    borderTop: `1px solid ${palette.fg}`,
                    padding: 'clamp(24px, 4vw, 36px) 0',
                  }}
                >
                  <div className="mb-4 flex items-baseline gap-4">
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: palette.accent,
                      }}
                    >
                      Route {GALLERY_NUMERALS[idx]}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontStyle: 'italic',
                        fontSize: 'clamp(24px, 3vw, 36px)',
                        lineHeight: 1,
                        fontWeight: 400,
                      }}
                    >
                      → {cluster.label}
                    </span>
                  </div>
                  {items.length === 0 ? (
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 15,
                        fontStyle: 'italic',
                        opacity: 0.45,
                      }}
                    >
                      — no legs planned this volume —
                    </p>
                  ) : (
                    <ol className="list-none">
                      {items.map((item, i) => (
                        <li
                          key={i}
                          className="grid items-baseline"
                          style={{
                            gridTemplateColumns: '60px 1fr',
                            columnGap: 14,
                            padding: '8px 0',
                            fontFamily: 'var(--font-serif)',
                            fontSize: 17,
                            lineHeight: 1.4,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: '0.16em',
                              textTransform: 'uppercase',
                              opacity: 0.55,
                            }}
                          >
                            Leg {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
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

/* -------------------- Lifestyle (quiet) -------------------- */

function LifestyleForecast({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { goals } = data;
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
          The Forecast
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(36px, 5vw, 56px)',
            lineHeight: 1.05,
            letterSpacing: '-0.012em',
            fontWeight: 400,
            margin: '0 0 16px',
          }}
        >
          What I&apos;m hoping for.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.55,
            opacity: 0.7,
            marginBottom: 'clamp(48px, 7vw, 72px)',
          }}
        >
          {total} small intentions, grouped by where they live.
        </p>

        {total === 0 ? (
          <p
            className="font-serif italic"
            style={{ fontSize: 16, lineHeight: 1.55, opacity: 0.6 }}
          >
            Add goals in the studio. They&apos;ll appear here as a quiet, centered list.
          </p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(40px, 6vw, 56px)',
              textAlign: 'center',
            }}
          >
            {CLUSTERS.map((cluster) => {
              const items = goals[cluster.key] ?? [];
              if (items.length === 0) return null;
              return (
                <div key={cluster.key}>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: palette.accent,
                      marginBottom: 14,
                    }}
                  >
                    {cluster.label}
                  </p>
                  <ul
                    className="list-none"
                    style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                  >
                    {items.map((item, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(20px, 2.4vw, 26px)',
                          lineHeight: 1.2,
                          fontWeight: 400,
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

/* -------------------- Financial (positions ledger) -------------------- */

function FinancialForecast({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { goals, zine } = data;
  const total =
    (goals.financial?.length ?? 0) +
    (goals.creative?.length ?? 0) +
    (goals.place?.length ?? 0) +
    (goals.body_spirit?.length ?? 0);

  const rows: { item: string; category: string }[] = [];
  for (const cluster of CLUSTERS) {
    for (const item of goals[cluster.key] ?? []) {
      rows.push({ item, category: cluster.label });
    }
  }

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
          <span>The Forecast · Positions Held</span>
          <span>FY {new Date(zine.created_at).getFullYear()}</span>
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
            Positions, opened.
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
            {total} open
          </span>
        </div>

        {total === 0 ? (
          <p
            className="font-serif italic"
            style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.6 }}
          >
            Add goals in the studio. They&apos;ll post here as opened positions.
          </p>
        ) : (
          <>
            <div
              className="grid items-baseline"
              style={{
                gridTemplateColumns: '52px 1fr 140px',
                columnGap: 16,
                paddingBottom: 8,
                borderBottom: `1px solid ${palette.fg}`,
                fontFamily: 'var(--font-sans)',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                opacity: 0.55,
              }}
            >
              <span>No.</span>
              <span>Position</span>
              <span style={{ textAlign: 'right' }}>Category</span>
            </div>

            <ol className="list-none">
              {rows.map((row, i) => (
                <li
                  key={i}
                  className="grid items-baseline"
                  style={{
                    gridTemplateColumns: '52px 1fr 140px',
                    columnGap: 16,
                    padding: '11px 0',
                    borderBottom: `1px solid ${palette.rule}`,
                    fontFamily: 'var(--font-serif)',
                    fontSize: 15,
                    lineHeight: 1.4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: palette.accent,
                    }}
                  >
                    {String(i + 1).padStart(3, '0')}
                  </span>
                  <span>{row.item}</span>
                  <span
                    style={{
                      textAlign: 'right',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      opacity: 0.7,
                    }}
                  >
                    {row.category}
                  </span>
                </li>
              ))}
            </ol>

            <div
              className="grid items-baseline"
              style={{
                gridTemplateColumns: '1fr auto',
                columnGap: 16,
                paddingTop: 14,
                marginTop: 4,
                borderTop: `2px solid ${palette.fg}`,
                fontFamily: 'var(--font-sans)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              <span>Total positions opened</span>
              <span style={{ color: palette.accent }}>{total}</span>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
