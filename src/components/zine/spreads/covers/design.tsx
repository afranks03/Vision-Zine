import { romanize } from '../../atoms';
import type { SpreadPalette } from '../../styles';
import type { SpreadProps } from '../../types';
import { focalObjectPosition, getDisplayName, seasonFromDate } from './_shared';

/**
 * Design cover layout — The Face reference.
 *
 * Move: bold geometric sans masthead in a colored block in the
 * top-left corner. Subject's name or title's words set as
 * individual scattered/rotated letters laid over the photograph.
 * Punchy, playful, younger voice. Single tagline along the bottom
 * in a small caps sans for grounding.
 *
 * The scatter is deterministic per zine (seeded by zine.id) so
 * re-renders are stable — no flicker between PDF gen and preview.
 */
export function DesignCover({
  data,
  palette,
  coverImageUrl,
}: SpreadProps & { palette: SpreadPalette }) {
  const { zine } = data;
  const displayName = getDisplayName(data);
  const mastheadText = 'VZ';
  const titleText = (zine.title || 'VISION').toUpperCase();
  const season = seasonFromDate(zine.created_at);
  const year = new Date(zine.created_at).getFullYear();
  const objectPosition = focalObjectPosition(zine.cover_image_focal_x, zine.cover_image_focal_y);

  // Deterministic scatter: hash zine.id to seed a tiny PRNG.
  const seed = hashSeed(zine.id);
  const letters = scatterLetters(titleText, seed);

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

      {/* Block masthead — top-left corner, colored fill */}
      <div
        className="absolute top-0 left-0 flex items-center justify-center"
        style={{
          width: 138,
          height: 168,
          background: palette.accent,
          color: palette.bg,
          fontFamily: 'var(--font-sans)',
          fontSize: 96,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        {mastheadText}
      </div>

      {/* Issue & season tag — top-right */}
      <div
        className="absolute top-6 right-6"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: palette.bg,
          textShadow: '0 1px 6px rgba(0,0,0,0.4)',
        }}
      >
        N°{zine.issue_number} · {season} {year}
      </div>

      {/* Scattered title letters layered over photo. Each letter is
          absolutely positioned via a deterministic offset/rotation. */}
      <div aria-label={titleText} className="absolute inset-0 pointer-events-none">
        {letters.map((l, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: `${l.x}%`,
              top: `${l.y}%`,
              transform: `rotate(${l.rot}deg)`,
              fontFamily: 'var(--font-display)',
              fontSize: `clamp(54px, ${l.size}vw, 180px)`,
              lineHeight: 1,
              fontWeight: 400,
              color: l.useAccent ? palette.accent : palette.bg,
              textShadow: '0 2px 14px rgba(0,0,0,0.35)',
            }}
          >
            {l.ch}
          </span>
        ))}
      </div>

      {/* Bottom small-caps tagline */}
      <div
        className="absolute right-6 bottom-6 left-6 flex items-center justify-between"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: palette.bg,
          textShadow: '0 1px 6px rgba(0,0,0,0.45)',
        }}
      >
        <span>
          {zine.cover_subtitle?.trim() || `An entire universe of ${displayName}.`}
        </span>
        <span>Vol. I · {romanize(zine.issue_number)}</span>
      </div>
    </article>
  );
}

/** Tiny deterministic PRNG seeded from the zine id. */
function hashSeed(id: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface ScatteredLetter {
  ch: string;
  x: number; // 0..100
  y: number; // 0..100
  rot: number; // degrees
  size: number; // vw multiplier
  useAccent: boolean;
}

/**
 * Lay out the title's letters across the cover. We chunk by word and
 * stack words vertically so the title remains *readable* — this isn't
 * pure scatter, it's "Face-style displaced caps".
 */
function scatterLetters(title: string, seed: number): ScatteredLetter[] {
  const rand = mulberry32(seed);
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const out: ScatteredLetter[] = [];
  // Distribute words into bands; each band gets a y-range.
  const bandStart = 18; // % from top — leaves room for the corner block
  const bandEnd = 78;
  const bandHeight = (bandEnd - bandStart) / words.length;

  words.forEach((word, wi) => {
    const bandTop = bandStart + wi * bandHeight;
    const letters = word.split('');
    const stepX = Math.min(70 / Math.max(letters.length, 1), 14);
    const startX = 14 + rand() * 8;
    letters.forEach((ch, li) => {
      out.push({
        ch,
        x: startX + li * stepX + (rand() - 0.5) * 4,
        y: bandTop + (rand() - 0.5) * bandHeight * 0.4,
        rot: (rand() - 0.5) * 18,
        size: 8 + rand() * 4,
        useAccent: rand() < 0.18,
      });
    });
  });

  return out;
}
