import type { CoverAccent } from '@/lib/supabase/types';
import type { RenderableZine } from '../../types';

/**
 * Brand-locked accent swatches for cover composition. Six hot colors,
 * each used by exactly one cover element (masthead emphasis, vertical
 * name, block fill, etc.) so the rest of the page stays disciplined.
 *
 * Keep this in sync with the check constraint in
 * supabase/migrations/20260517160000_add_cover_system.sql.
 */
export const ACCENT_HEX: Record<CoverAccent, string> = {
  coral: '#E8584C',
  yellow: '#FFD629',
  magenta: '#D62B7E',
  blue: '#1F4E89',
  green: '#2A6E3F',
  ink: '#0A0A0A',
};

/** Human label for a cover accent — used by the studio composer. */
export const ACCENT_LABEL: Record<CoverAccent, string> = {
  coral: 'Coral',
  yellow: 'Yellow',
  magenta: 'Magenta',
  blue: 'Deep Blue',
  green: 'Forest',
  ink: 'Ink',
};

/**
 * CSS `object-position` string from the focal point stored on the zine.
 * Used by photo-based cover layouts to keep the subject in frame
 * regardless of the photo's aspect ratio.
 */
export function focalObjectPosition(focalX: number, focalY: number): string {
  const x = clamp01(focalX) * 100;
  const y = clamp01(focalY) * 100;
  return `${x.toFixed(1)}% ${y.toFixed(1)}%`;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0.5;
  return Math.max(0, Math.min(1, n));
}

/** Lowercase season name from a created_at ISO timestamp. */
export function seasonFromDate(iso: string): string {
  const m = new Date(iso).getMonth();
  if (m <= 1 || m === 11) return 'Winter';
  if (m <= 4) return 'Spring';
  if (m <= 7) return 'Summer';
  return 'Autumn';
}

export interface TocItem {
  title: string;
  desc: string;
  filled: boolean;
}

/** Build the cover's table of contents from filled sections. */
export function buildToc(data: RenderableZine): TocItem[] {
  const items: TocItem[] = [];
  if (data.vision.statement?.trim()) {
    items.push({
      title: 'The Vision',
      desc: 'A first-person manifesto for the year ahead.',
      filled: true,
    });
  }
  if (data.bio.summary?.trim()) {
    items.push({ title: 'Bio', desc: 'A short editorial introduction.', filled: true });
  }
  if ((data.resume.highlights?.length ?? 0) > 0) {
    items.push({
      title: 'Career',
      desc: 'Highlights of the work behind the next chapter.',
      filled: true,
    });
  }
  const goalCount =
    (data.goals.financial?.length ?? 0) +
    (data.goals.creative?.length ?? 0) +
    (data.goals.place?.length ?? 0) +
    (data.goals.body_spirit?.length ?? 0);
  if (goalCount > 0) {
    items.push({
      title: 'The Forecast',
      desc: 'Goals by domain — money, art, place, body.',
      filled: true,
    });
  }
  if ((data.achievements.items?.length ?? 0) > 0) {
    items.push({
      title: 'The Foundation',
      desc: 'The case for the next chapter, in evidence.',
      filled: true,
    });
  }
  if ((data.tenets.tenets?.length ?? 0) > 0) {
    items.push({
      title: 'The Daily Code',
      desc: 'Ten tenets. Read first thing. Read last thing.',
      filled: true,
    });
  }
  while (items.length < 6) {
    items.push({
      title: ['Online', 'Documents', 'Co-author', 'Closing'][items.length - 2] ?? 'Section',
      desc: 'Reserved for the next issue.',
      filled: false,
    });
  }
  return items;
}

/**
 * Adaptive masthead font-size for stroked display titles. Tuned against
 * DM Serif Display + the editorial cover's frame width.
 */
export function mastheadSizeForLength(text: string): string {
  const len = text.length;
  if (len <= 7) return 'clamp(80px, 17vw, 240px)';
  if (len <= 11) return 'clamp(64px, 13vw, 180px)';
  if (len <= 18) return 'clamp(48px, 9vw, 120px)';
  if (len <= 26) return 'clamp(40px, 6vw, 88px)';
  return 'clamp(32px, 5vw, 64px)';
}

/** Computes display name with a sensible fallback. */
export function getDisplayName(data: RenderableZine): string {
  return data.personal.display_name || data.personal.full_name || 'you';
}
