import { romanize } from '../../atoms';
import type { SpreadPalette } from '../../styles';
import type { SpreadProps } from '../../types';
import { focalObjectPosition, getDisplayName, seasonFromDate } from './_shared';

/**
 * Fashion cover layout — Vogue / Cultured reference.
 *
 * Move: full-bleed photograph; large condensed masthead behind the
 * subject (subject's head/shoulders partially occlude the title's
 * lower half), creating that iconic American-fashion z-stacking
 * effect. Cover subject's name set vertical along the right edge in
 * a tight all-caps sans. One coverline at lower-left.
 *
 * Photo is positioned via the focal_x/focal_y stored on the zine so
 * the subject's face stays in the cover's vertical sweet spot even
 * across different aspect ratios.
 */
export function FashionCover({
  data,
  palette,
  coverImageUrl,
}: SpreadProps & { palette: SpreadPalette }) {
  const { zine } = data;
  const displayName = getDisplayName(data);
  const mastheadText = (zine.title ? zine.title : 'VISION').toUpperCase();
  const season = seasonFromDate(zine.created_at);
  const year = new Date(zine.created_at).getFullYear();
  const coverline = zine.cover_subtitle?.trim() || 'A Private Edition';

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
          opacity: coverImageUrl ? 1 : 0.85,
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

      {/* Top strip — issue / season */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-between px-8 pt-6"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: palette.bg,
          mixBlendMode: 'difference',
        }}
      >
        <span>
          Issue {romanize(zine.issue_number)} · {season} {year}
        </span>
        <span>A Vision Zine</span>
      </div>

      {/* Masthead — large display serif in the cover accent. In
          well-cropped photos the subject's head/shoulders occlude the
          lower portion creating the z-stacking effect. */}
      <h1
        aria-label={mastheadText}
        style={{
          position: 'absolute',
          top: '6%',
          left: '4%',
          right: '4%',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(72px, 14vw, 220px)',
          lineHeight: 0.85,
          letterSpacing: '-0.03em',
          fontWeight: 400,
          color: palette.accent,
          margin: 0,
          textShadow: '0 2px 22px rgba(0,0,0,0.18)',
          pointerEvents: 'none',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
        }}
      >
        {mastheadText}
      </h1>

      {/* Subject name — vertical along right edge */}
      <div
        aria-label={displayName}
        style={{
          position: 'absolute',
          right: 18,
          top: '18%',
          bottom: '12%',
          writingMode: 'vertical-rl',
          fontFamily: 'var(--font-sans)',
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: palette.bg,
          textShadow: '0 1px 6px rgba(0,0,0,0.45)',
        }}
      >
        {displayName}
      </div>

      {/* Coverline — lower left */}
      <div
        className="absolute bottom-8 left-8 max-w-[44%]"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 2.4vw, 32px)',
          lineHeight: 1.05,
          fontStyle: 'italic',
          color: palette.bg,
          textShadow: '0 1px 6px rgba(0,0,0,0.5)',
        }}
      >
        {coverline}
      </div>

      {/* Bottom-right small-caps tagline */}
      <div
        className="absolute right-8 bottom-8"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: palette.bg,
          mixBlendMode: 'difference',
        }}
      >
        Vol. I · No. {zine.issue_number}
      </div>
    </article>
  );
}
