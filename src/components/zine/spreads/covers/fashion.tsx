import { romanize } from '../../atoms';
import type { SpreadPalette } from '../../styles';
import type { SpreadProps } from '../../types';
import { getDisplayName } from './_shared';

/**
 * Fashion cover — coral page, oversized italic stacked title bleeding off
 * the corner, runway pacing, big sans tags, an asymmetric image-block
 * placeholder. High contrast.
 */
export function FashionCover({
  data,
  palette,
}: SpreadProps & { palette: SpreadPalette }) {
  const { zine } = data;
  const displayName = getDisplayName(data);
  const title = (zine.title || 'Issue ' + romanize(zine.issue_number)).toUpperCase();
  const words = title.split(/\s+/).filter(Boolean);

  return (
    <article
      className="relative overflow-hidden"
      style={{ background: palette.bg, color: palette.fg }}
    >
      <div
        className="relative grid gap-0"
        style={{
          padding: 'clamp(24px, 4vw, 56px)',
          minHeight: '900px',
          gridTemplateColumns: '1.4fr 1fr',
        }}
      >
        {/* Left: stacked italic title */}
        <div className="flex flex-col justify-between">
          <div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Vol. {romanize(zine.issue_number)} · The Runway Edition
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(72px, 13vw, 200px)',
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                fontWeight: 400,
                wordBreak: 'break-word',
              }}
            >
              {words.map((w, i) => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    marginLeft: `${i * 32}px`,
                  }}
                >
                  {w}
                </span>
              ))}
            </h1>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ display: 'block', opacity: 0.85 }}>{displayName}</span>
            <span style={{ display: 'block', color: palette.accent, marginTop: 4 }}>
              The Spring/Summer Outlook
            </span>
          </div>
        </div>

        {/* Right: image-block placeholder + ticker */}
        <div className="flex flex-col gap-4">
          <div
            aria-hidden
            style={{
              background: palette.fg,
              color: palette.bg,
              flex: 1,
              minHeight: 380,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 18,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              · Cover image ·
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 48,
                lineHeight: 0.9,
                color: palette.accent,
                alignSelf: 'flex-end',
              }}
            >
              {(displayName?.[0] ?? 'V').toUpperCase()}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              No. {zine.issue_number}
            </span>
          </div>

          {/* Tag ticker */}
          <div
            style={{
              borderTop: `1px solid ${palette.fg}`,
              paddingTop: 12,
              fontFamily: 'var(--font-sans)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              lineHeight: 1.8,
            }}
          >
            Vision · Bio · Career · Forecast · Foundation · Code · Closing
          </div>
        </div>
      </div>
    </article>
  );
}
