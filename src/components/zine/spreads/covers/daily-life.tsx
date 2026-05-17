import { romanize } from '../../atoms';
import type { SpreadPalette } from '../../styles';
import type { SpreadProps } from '../../types';
import { buildToc, focalObjectPosition, getDisplayName, seasonFromDate } from './_shared';

/**
 * Daily Life cover layout — Apartamento reference.
 *
 * Move: small-to-mid sized photograph, centered on a wide paper margin.
 * Calm lowercase sans-serif masthead at the top. Contributor strip
 * running vertical along the right spine in tiny serif (we use the
 * TOC item titles as the "contributors"). Photo doesn't bleed.
 *
 * Quiet, intimate, journal-feeling. The opposite of Fashion.
 */
export function DailyLifeCover({
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
  const tocItems = buildToc(data).filter((t) => t.filled);

  return (
    <article
      className="relative overflow-hidden"
      style={{
        background: palette.bg,
        color: palette.fg,
        minHeight: 900,
        padding: 'clamp(28px, 4vw, 56px)',
      }}
    >
      {/* Top — masthead horizontal, calm lowercase */}
      <div
        className="flex items-baseline justify-between"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        <span>An everyday vision magazine</span>
        <span>
          Issue {romanize(zine.issue_number)} · {season} {year}
        </span>
      </div>

      <h1
        aria-label={mastheadText}
        className="mt-2"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(68px, 9vw, 132px)',
          letterSpacing: '0.02em',
          lineHeight: 1,
          fontWeight: 400,
          color: palette.fg,
          margin: 0,
        }}
      >
        {mastheadText}
      </h1>

      {/* Body: photo on left, contributor strip on right */}
      <div className="mt-12 grid grow gap-10" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        {/* Photo block — centered, not full-bleed */}
        <div
          aria-hidden
          style={{
            position: 'relative',
            aspectRatio: '4 / 5',
            background: coverImageUrl
              ? `url("${coverImageUrl}") center/cover no-repeat`
              : palette.rule,
            backgroundPosition: objectPosition,
            border: `1px solid ${palette.fg}`,
          }}
        >
          {!coverImageUrl && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                color: palette.fg,
                fontFamily: 'var(--font-sans)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                opacity: 0.5,
              }}
            >
              Upload a cover photograph
            </div>
          )}
        </div>

        {/* Contributor strip — vertical, tiny serif list */}
        <div className="flex flex-col justify-between" style={{ paddingTop: 6 }}>
          <div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              In this issue —
            </p>
            <ul
              className="space-y-2.5"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 14,
                lineHeight: 1.3,
                fontStyle: 'italic',
              }}
            >
              {tocItems.length > 0 ? (
                tocItems.map((t) => (
                  <li
                    key={t.title}
                    style={{ borderTop: `1px solid ${palette.rule}`, paddingTop: 8 }}
                  >
                    {t.title}
                  </li>
                ))
              ) : (
                <li style={{ opacity: 0.6 }}>(no sections completed yet)</li>
              )}
            </ul>
          </div>

          {/* Bottom — subtitle + meta */}
          <div className="mt-8">
            {subtitle && (
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 18,
                  lineHeight: 1.25,
                  marginBottom: 12,
                }}
              >
                {subtitle}
              </p>
            )}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              A private edition for {displayName}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
