import { romanize } from '../../atoms';
import type { SpreadPalette } from '../../styles';
import type { SpreadProps } from '../../types';
import { getDisplayName } from './_shared';

/**
 * Art Catalog cover — museum-grade restraint. Paper page, single horizontal
 * line of title at upper-third, everything else is whitespace and tiny
 * wall-label text. The number does most of the visual work.
 */
export function ArtCatalogCover({
  data,
  palette,
}: SpreadProps & { palette: SpreadPalette }) {
  const { zine } = data;
  const displayName = getDisplayName(data);
  const title = zine.title || 'A retrospective';
  const year = new Date(zine.created_at).getFullYear();

  return (
    <article
      className="relative"
      style={{ background: palette.bg, color: palette.fg }}
    >
      <div
        className="relative grid"
        style={{
          padding: 'clamp(60px, 9vw, 160px)',
          minHeight: '900px',
          gridTemplateRows: 'auto 1fr auto',
          gap: 'clamp(48px, 8vw, 120px)',
        }}
      >
        {/* Top wall label */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          <span>
            Issue {romanize(zine.issue_number)} · {year}
          </span>
          <span style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', color: palette.accent }}>The Private Collection</span>
            <span style={{ display: 'block', marginTop: 4 }}>Vision Zine</span>
          </span>
        </header>

        {/* The number — does the dramatic work */}
        <div className="flex flex-col items-center justify-center">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(120px, 22vw, 320px)',
              lineHeight: 0.85,
              fontWeight: 400,
              letterSpacing: '-0.04em',
              color: palette.accent,
            }}
          >
            {romanize(zine.issue_number)}
          </span>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(22px, 3vw, 36px)',
              lineHeight: 1.2,
              marginTop: 32,
              maxWidth: 600,
              textAlign: 'center',
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginTop: 18,
              opacity: 0.7,
            }}
          >
            Curated by {displayName}
          </p>
        </div>

        {/* Bottom wall label */}
        <footer
          style={{
            borderTop: `1px solid ${palette.fg}`,
            paddingTop: 14,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-sans)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          <span>Self-published</span>
          <span>One of one</span>
          <span>No. {zine.issue_number}</span>
        </footer>
      </div>
    </article>
  );
}
