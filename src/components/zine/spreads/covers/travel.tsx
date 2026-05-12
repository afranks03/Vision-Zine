import { romanize } from '../../atoms';
import type { SpreadPalette } from '../../styles';
import type { SpreadProps } from '../../types';
import { getDisplayName, seasonFromDate } from './_shared';

/**
 * Travel cover — blue page, postcard sensibility. Stamp-style box in the
 * top-right with origin, big italic destination headline, a faux ferry/
 * mileage ticker at the bottom.
 */
export function TravelCover({
  data,
  palette,
}: SpreadProps & { palette: SpreadPalette }) {
  const { zine } = data;
  const displayName = getDisplayName(data);
  const location = data.personal.location || 'Anywhere';
  const season = seasonFromDate(zine.created_at);
  const year = new Date(zine.created_at).getFullYear();
  const title = zine.title || 'Onward';

  return (
    <article
      className="relative overflow-hidden"
      style={{ background: palette.bg, color: palette.fg }}
    >
      <div
        className="relative flex flex-col"
        style={{
          padding: 'clamp(40px, 6vw, 88px)',
          minHeight: '900px',
        }}
      >
        {/* Top — issue meta + postcard stamp */}
        <div className="flex items-start justify-between">
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ display: 'block', color: palette.accent }}>The Waybill</span>
            <span style={{ display: 'block', marginTop: 4 }}>
              Issue {romanize(zine.issue_number)} · {season} {year}
            </span>
          </div>

          {/* Postcard stamp */}
          <div
            aria-hidden
            style={{
              border: `2px solid ${palette.accent}`,
              padding: '12px 18px',
              transform: 'rotate(6deg)',
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              color: palette.accent,
              maxWidth: 140,
            }}
          >
            <span style={{ display: 'block', fontSize: 28, lineHeight: 1 }}>
              ↗
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                marginTop: 4,
                display: 'block',
              }}
            >
              From {location}
            </span>
          </div>
        </div>

        {/* Title — italic, big */}
        <div className="flex grow flex-col justify-center">
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            A magazine of departures
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(72px, 14vw, 200px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              fontWeight: 400,
              wordBreak: 'break-word',
              color: palette.accent,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 3vw, 36px)',
              lineHeight: 1.15,
              marginTop: 24,
              maxWidth: 600,
            }}
          >
            From the desk of {displayName}, this year.
          </p>
        </div>

        {/* Mileage ticker */}
        <div
          style={{
            borderTop: `1px solid ${palette.fg}`,
            paddingTop: 14,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 18,
            fontFamily: 'var(--font-sans)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <span>Brooklyn 0 km</span>
          <span>Athens 7,860</span>
          <span>Anywhere ∞</span>
          <span>Volume {zine.issue_number}</span>
        </div>
      </div>
    </article>
  );
}
