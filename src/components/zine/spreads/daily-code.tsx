import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';

/**
 * The Daily Code — palette-driven 2-column bordered grid.
 */
export function DailyCode({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const tenets = data.tenets.tenets?.filter((t) => t.trim().length > 0) ?? [];

  return (
    <article
      className="relative"
      style={{ background: palette.bg, color: palette.fg }}
    >
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
            Add tenets in the studio — short, declarative, first-person ideally. Each one
            appears in its own framed cell here.
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
