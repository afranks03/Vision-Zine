import type { SpreadProps } from '../types';

/**
 * The Daily Code — ten tenets in a 2-column bordered grid, on yellow.
 * Renders only the filled tenets (1–10).
 */
export function DailyCode({ data }: SpreadProps) {
  const tenets = data.tenets.tenets?.filter((t) => t.trim().length > 0) ?? [];

  return (
    <article className="text-vz-ink relative" style={{ background: 'var(--color-vz-yellow)' }}>
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
              border: '1px solid var(--color-vz-ink)',
            }}
          >
            {tenets.map((tenet, i) => {
              const isLastRowFirst = i >= tenets.length - 2 && i % 2 === 0;
              const isLastRowSecond = i === tenets.length - 1 && i % 2 === 1;
              const isLastTwo = isLastRowFirst || isLastRowSecond || i === tenets.length - 1;
              return (
                <li
                  key={i}
                  className="grid items-start gap-4.5"
                  style={{
                    gridTemplateColumns: 'auto 1fr',
                    padding: 'clamp(20px, 3vw, 32px)',
                    borderRight: i % 2 === 0 ? '1px solid var(--color-vz-ink)' : 'none',
                    borderBottom: isLastTwo ? 'none' : '1px solid var(--color-vz-ink)',
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
