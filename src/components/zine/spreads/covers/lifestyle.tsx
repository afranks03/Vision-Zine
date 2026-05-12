import { romanize } from '../../atoms';
import type { SpreadPalette } from '../../styles';
import type { SpreadProps } from '../../types';
import { buildToc, getDisplayName, seasonFromDate } from './_shared';

/**
 * Lifestyle cover — Kinfolk/Cereal. No frame, generous whitespace, single
 * italic title centered on the page, soft meta below, a quiet TOC pulled
 * tight to the bottom. Rose page.
 */
export function LifestyleCover({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { zine } = data;
  const displayName = getDisplayName(data);
  const location = data.personal.location || 'On Earth';
  const season = seasonFromDate(zine.created_at);
  const year = new Date(zine.created_at).getFullYear();
  const tocItems = buildToc(data).slice(0, 5);

  return (
    <article
      className="relative overflow-hidden"
      style={{ background: palette.bg, color: palette.fg }}
    >
      <div
        className="flex flex-col"
        style={{
          padding: 'clamp(56px, 8vw, 120px) clamp(40px, 6vw, 96px)',
          minHeight: '900px',
        }}
      >
        {/* Top — just meta, no frame */}
        <div
          className="flex items-center justify-between"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <span>
            {season} {year}
          </span>
          <span>Issue {romanize(zine.issue_number)}</span>
        </div>

        {/* Hero block — bottom-anchored title */}
        <div className="flex grow flex-col items-center justify-center text-center">
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 28,
              opacity: 0.7,
            }}
          >
            A quiet magazine
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(48px, 9vw, 144px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              fontWeight: 400,
              maxWidth: 900,
              wordBreak: 'break-word',
            }}
          >
            {zine.title || 'Slowly, this year.'}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 18,
              lineHeight: 1.4,
              marginTop: 28,
              maxWidth: 480,
              opacity: 0.85,
            }}
          >
            From the desk of {displayName} — {location}.
          </p>
        </div>

        {/* TOC — quiet, single column at the bottom */}
        <div
          style={{
            borderTop: `1px solid ${palette.fg}`,
            paddingTop: 18,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 16,
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          {tocItems.map((item, i) => (
            <span key={item.title} style={{ display: 'inline-flex', gap: 8 }}>
              <span style={{ opacity: 0.5 }}>{(i + 1).toString().padStart(2, '0')}</span>
              <span>{item.title}</span>
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
