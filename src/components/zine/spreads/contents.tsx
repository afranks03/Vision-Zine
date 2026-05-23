import { romanize } from '../atoms';
import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';
import { buildToc, getDisplayName, seasonFromDate } from './covers/_shared';

/**
 * Contents page (Phase 3d-iii). The proper editorial TOC that sits at
 * page 2 of every Letter zine. Pocket zines skip this spread — the
 * 4.25×6.875 trim is too small to carry a TOC tastefully.
 *
 * Layout: big numeral, "Contents" word-mark, two-column TOC with
 * section name / description / page number. Right side carries a
 * pull from the editor's letter or a quiet decorative element.
 */
export function Contents({
  data,
  palette,
  /**
   * Starting page number for the FIRST listed section (typically 4 —
   * cover=1, contents=2, letter=3, then the listed sections begin).
   * Computed by the Zine root so the TOC's numbers match the actual
   * page positions.
   */
  startPage,
}: SpreadProps & { palette: SpreadPalette; startPage: number }) {
  const { zine } = data;
  const items = buildToc(data);
  const filled = items.filter((t) => t.filled);
  const displayName = getDisplayName(data);
  const season = seasonFromDate(zine.created_at);
  const year = new Date(zine.created_at).getFullYear();
  const visionPull =
    data.vision.statement
      ?.split(/[.\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 16)[0] ?? '';

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
        }}
      >
        {/* Top eyebrow */}
        <div
          className="flex items-baseline justify-between"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            borderBottom: `2px solid ${palette.fg}`,
            paddingBottom: 12,
          }}
        >
          <span>Issue {romanize(zine.issue_number)} · Contents</span>
          <span>
            {season} {year}
          </span>
        </div>

        {/* Body: TOC + pull */}
        <div className="mt-10 grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-20">
          {/* TOC list */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(56px, 8vw, 112px)',
                lineHeight: 0.9,
                letterSpacing: '-0.02em',
                fontWeight: 400,
                margin: '0 0 36px',
              }}
            >
              <em>Contents</em>
            </h2>
            <ol className="grid grid-cols-1">
              {items.map((item, i) => {
                const page = startPage + i;
                const dim = !item.filled;
                return (
                  <li
                    key={item.title}
                    className="grid items-baseline gap-4"
                    style={{
                      gridTemplateColumns: '36px 1fr auto',
                      paddingTop: 14,
                      paddingBottom: 14,
                      borderTop: `1px solid ${palette.fg}`,
                      borderBottom:
                        i === items.length - 1 ? `1px solid ${palette.fg}` : undefined,
                      opacity: dim ? 0.45 : 1,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 22,
                        lineHeight: 1,
                        fontWeight: 400,
                        color: palette.accent,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 22,
                          lineHeight: 1.05,
                          letterSpacing: '-0.005em',
                          fontWeight: 400,
                          marginBottom: 4,
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 13,
                          lineHeight: 1.35,
                          fontStyle: 'italic',
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                      }}
                    >
                      p. {page}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p
              className="mt-4"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                opacity: 0.55,
              }}
            >
              {filled.length} of {items.length} sections in this issue
            </p>
          </div>

          {/* Right column — vision pull, decorative */}
          <aside className="flex flex-col justify-between">
            {visionPull ? (
              <blockquote
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(22px, 2.4vw, 32px)',
                  lineHeight: 1.15,
                  fontWeight: 400,
                  borderLeft: `2px solid ${palette.accent}`,
                  paddingLeft: 18,
                  margin: 0,
                }}
              >
                {visionPull.length > 180 ? visionPull.slice(0, 180) + '…' : visionPull}
              </blockquote>
            ) : (
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 15,
                  lineHeight: 1.55,
                  fontStyle: 'italic',
                  opacity: 0.6,
                }}
              >
                A pull from the Vision section will appear here once you write one.
              </p>
            )}

            <div
              className="mt-12"
              style={{
                borderTop: `1px solid ${palette.fg}`,
                paddingTop: 16,
                fontFamily: 'var(--font-sans)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              <p>Edited by {displayName}</p>
              <p style={{ opacity: 0.6 }}>For private circulation only</p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
