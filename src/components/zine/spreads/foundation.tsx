import type { SpreadProps } from '../types';

/**
 * The Foundation — achievements as a two-column receipt list on cream,
 * with an italic editorial quote at the top.
 */
export function Foundation({ data }: SpreadProps) {
  const items = data.achievements.items ?? [];

  return (
    <article
      className="text-vz-ink relative"
      style={{ background: 'var(--color-vz-cream)' }}
    >
      <div
        className="vz-container"
        style={{ paddingTop: 'clamp(60px, 10vw, 140px)', paddingBottom: 'clamp(60px, 10vw, 140px)' }}
      >
        <FoundationQuote />

        {items.length === 0 ? (
          <p className="vz-prose mx-auto max-w-xl text-center opacity-70">
            Add achievements in the studio — Title, Year, Tag — and they&apos;ll appear here
            as numbered receipts across two columns.
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
                  borderBottom: '1px solid var(--color-vz-ink)',
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
                      background: 'var(--color-vz-ink)',
                      color: 'var(--color-vz-yellow)',
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

function FoundationQuote() {
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
          background: 'var(--color-vz-ink)',
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
          background: 'var(--color-vz-ink)',
          margin: '18px auto',
        }}
      />
    </blockquote>
  );
}
