import { romanize } from '../atoms';
import type { SpreadProps } from '../types';

/**
 * The Forecast — goals by domain on the dark ink page with yellow accents.
 * Four clusters: financial, creative, place, body & spirit.
 */
const CLUSTERS: {
  key: 'financial' | 'creative' | 'place' | 'body_spirit';
  label: string;
}[] = [
  { key: 'financial', label: 'Financial' },
  { key: 'creative', label: 'Creative' },
  { key: 'place', label: 'Place' },
  { key: 'body_spirit', label: 'Body & Spirit' },
];

export function Forecast({ data }: SpreadProps) {
  const { goals, zine } = data;
  const total =
    (goals.financial?.length ?? 0) +
    (goals.creative?.length ?? 0) +
    (goals.place?.length ?? 0) +
    (goals.body_spirit?.length ?? 0);

  return (
    <article className="text-vz-cream relative" style={{ background: 'var(--color-vz-ink)' }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
        }}
      >
        {/* Feature head */}
        <header
          className="grid items-end gap-6"
          style={{
            gridTemplateColumns: 'auto 1fr auto',
            borderBottom: '2px solid var(--color-vz-cream)',
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
            style={{ color: 'var(--color-vz-cream)', opacity: 0.7, textAlign: 'center' }}
          >
            Fill in the Goals section in the studio — financial, creative, place, body &amp; spirit
            — and they&apos;ll appear here, sorted and ruled like the prototype.
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
                      borderBottom: '1px solid var(--color-vz-cream)',
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 36,
                        lineHeight: 1,
                        fontWeight: 400,
                        color: 'var(--color-vz-yellow)',
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
                            borderBottom: '1px solid rgba(245, 239, 221, 0.18)',
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
                              color: 'var(--color-vz-yellow)',
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
