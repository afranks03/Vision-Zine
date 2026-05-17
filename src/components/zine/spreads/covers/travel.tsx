import { romanize } from '../../atoms';
import type { SpreadPalette } from '../../styles';
import type { SpreadProps } from '../../types';
import { focalObjectPosition, getDisplayName, seasonFromDate } from './_shared';

/**
 * Travel cover layout — Frieze / Heroine reference.
 *
 * Move: full-bleed photograph; lowercase wide-letterspaced masthead set
 * vertical along the left edge in display serif (Frieze move). Issue
 * tag right side, small. Optional cover subtitle along the bottom.
 * Very quiet — minimal text, lets the photo carry the cover.
 */
export function TravelCover({
  data,
  palette,
  coverImageUrl,
}: SpreadProps & { palette: SpreadPalette }) {
  const { zine } = data;
  const displayName = getDisplayName(data);
  const mastheadText = (zine.title ? zine.title : 'vision').toLowerCase();
  const season = seasonFromDate(zine.created_at);
  const year = new Date(zine.created_at).getFullYear();
  const subtitle = zine.cover_subtitle?.trim();
  const objectPosition = focalObjectPosition(zine.cover_image_focal_x, zine.cover_image_focal_y);

  return (
    <article
      className="relative overflow-hidden"
      style={{ background: palette.bg, color: palette.fg, minHeight: 900 }}
    >
      {/* Background photo (or placeholder) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: coverImageUrl
            ? `url("${coverImageUrl}") center/cover no-repeat`
            : palette.fg,
          backgroundPosition: objectPosition,
        }}
      />
      {!coverImageUrl && (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center"
          style={{
            color: palette.bg,
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}
        >
          Upload a cover photograph
        </div>
      )}

      {/* Vertical masthead — lowercase display serif, wide letterspacing */}
      <h1
        aria-label={mastheadText}
        style={{
          position: 'absolute',
          left: 26,
          top: '7%',
          bottom: '7%',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(54px, 7vw, 110px)',
          letterSpacing: '0.04em',
          lineHeight: 1,
          fontWeight: 400,
          color: palette.bg,
          textShadow: '0 1px 12px rgba(0,0,0,0.35)',
          margin: 0,
        }}
      >
        {mastheadText}
      </h1>

      {/* Right-side issue tag — small, vertical */}
      <div
        style={{
          position: 'absolute',
          right: 22,
          top: '6%',
          writingMode: 'vertical-rl',
          fontFamily: 'var(--font-sans)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: palette.bg,
          textShadow: '0 1px 6px rgba(0,0,0,0.4)',
        }}
      >
        Issue {romanize(zine.issue_number)} · {season} {year}
      </div>

      {/* Optional cover subtitle — italic display, bottom band */}
      {subtitle && (
        <div
          className="absolute right-0 bottom-12 left-24 px-8"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(22px, 2.4vw, 32px)',
            lineHeight: 1.15,
            color: palette.bg,
            textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            maxWidth: '70%',
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Bottom-right tiny credit */}
      <div
        className="absolute right-6 bottom-5"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: palette.bg,
          mixBlendMode: 'difference',
        }}
      >
        {displayName} · Vol. I
      </div>
    </article>
  );
}
