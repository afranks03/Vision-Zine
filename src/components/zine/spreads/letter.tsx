import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';

/**
 * Editor's Letter — the Vision statement rendered with a drop cap, a
 * left-rail meta column, and a signature. Palette-driven so each style
 * picks its own background/foreground/accent.
 */
export function EditorsLetter({
  data,
  palette,
}: SpreadProps & { palette: SpreadPalette }) {
  const { personal, vision } = data;
  const displayName = personal.display_name || personal.full_name || 'You';
  const statement = vision.statement?.trim();

  const paragraphs = statement
    ? statement.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    : [];

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
        <div className="grid items-start gap-8 md:grid-cols-[1fr_2.4fr] md:gap-20">
          {/* Side meta */}
          <aside className="md:sticky md:top-10">
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                lineHeight: 1.7,
                borderTop: `1px solid ${palette.fg}`,
                borderBottom: `1px solid ${palette.fg}`,
                padding: '14px 0',
              }}
            >
              <span className="block">The Vision</span>
              <span className="block">Issue {data.zine.issue_number}</span>
              <span className="block">{displayName}</span>
            </div>
          </aside>

          {/* Letter */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 6.5vw, 84px)',
                lineHeight: 0.9,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                margin: '18px 0 36px',
              }}
            >
              {statement ? (
                <>
                  A letter from <em>{displayName}</em>.
                </>
              ) : (
                <>
                  Your <em>letter</em> goes here.
                </>
              )}
            </h2>
            <div
              className="vz-dropcap"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(17px, 1.6vw, 21px)',
                lineHeight: 1.55,
                fontWeight: 400,
              }}
            >
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => (
                  <p key={i} style={{ marginBottom: '1em' }}>
                    {p}
                  </p>
                ))
              ) : (
                <p style={{ marginBottom: '1em', opacity: 0.6 }}>
                  Write your Vision statement in the studio — once you save it, this spread
                  will compose around your words with a drop cap, a signature, and the side
                  rail. Until then, this page holds the form for what&apos;s coming.
                </p>
              )}
            </div>
            {paragraphs.length > 0 && (
              <div className="mt-9 flex flex-wrap items-end gap-5">
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 46,
                    lineHeight: 1,
                    fontWeight: 400,
                    color: palette.accent,
                  }}
                >
                  — {displayName}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    lineHeight: 1.5,
                  }}
                >
                  {personal.location ? <span className="block">{personal.location}</span> : null}
                  <span className="block">Editor, this issue</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
