import type { ZineStyle } from '@/lib/supabase/types';

/**
 * Each spread reads its colors from a SpreadPalette. The Zine root computes
 * a StylePalette from the zine's `style` and passes the right slice into
 * each spread. This is how Editorial gets yellow-cream-ink-yellow-cream
 * and Lifestyle gets rose-paper-pink-paper-paper without anyone editing
 * the spread components.
 */

export interface SpreadPalette {
  /** Page background. */
  bg: string;
  /** Default text color. */
  fg: string;
  /** Accent color (yellow on Editorial, etc.). Used for emphasis spans. */
  accent: string;
  /** Subtle rule color, often `currentColor` at low opacity. */
  rule: string;
}

export interface StylePalette {
  cover: SpreadPalette;
  letter: SpreadPalette;
  forecast: SpreadPalette;
  dailyCode: SpreadPalette;
  foundation: SpreadPalette;
}

/** Brand color hexes — kept inline so spreads don't import a separate file. */
const C = {
  yellow: '#FFD629',
  ink: '#0A0A0A',
  inkSoft: '#1A1A1A',
  cream: '#F5EFDD',
  paper: '#FAF6E9',
  oat: '#EAE6D8',
  coral: '#E8584C',
  rose: '#EFAFA0',
  pinkPaper: '#F4D8CE',
  green: '#2A6E3F',
  blue: '#1F4E89',
};

const RULE_DARK = 'rgba(245, 239, 221, 0.22)';
const RULE_LIGHT = 'rgba(10, 10, 10, 0.18)';

export const STYLE_PALETTES: Record<ZineStyle, StylePalette> = {
  editorial: {
    cover: { bg: C.yellow, fg: C.ink, accent: C.coral, rule: RULE_LIGHT },
    letter: { bg: C.cream, fg: C.ink, accent: C.coral, rule: RULE_LIGHT },
    forecast: { bg: C.ink, fg: C.cream, accent: C.yellow, rule: RULE_DARK },
    dailyCode: { bg: C.yellow, fg: C.ink, accent: C.coral, rule: RULE_LIGHT },
    foundation: { bg: C.cream, fg: C.ink, accent: C.coral, rule: RULE_LIGHT },
  },
  lifestyle: {
    // Warm, paper-forward, Kinfolk-adjacent. Lots of cream / paper, gentle
    // rose accents, no high-contrast pages.
    cover: { bg: C.rose, fg: C.ink, accent: C.coral, rule: RULE_LIGHT },
    letter: { bg: C.paper, fg: C.ink, accent: C.coral, rule: RULE_LIGHT },
    forecast: { bg: C.pinkPaper, fg: C.ink, accent: C.coral, rule: RULE_LIGHT },
    dailyCode: { bg: C.cream, fg: C.ink, accent: C.coral, rule: RULE_LIGHT },
    foundation: { bg: C.paper, fg: C.ink, accent: C.rose, rule: RULE_LIGHT },
  },
  fashion: {
    // High contrast, bold blocks, italic captions. Coral and ink dominate.
    cover: { bg: C.coral, fg: C.cream, accent: C.yellow, rule: 'rgba(245, 239, 221, 0.35)' },
    letter: { bg: C.cream, fg: C.ink, accent: C.coral, rule: RULE_LIGHT },
    forecast: { bg: C.ink, fg: C.cream, accent: C.coral, rule: RULE_DARK },
    dailyCode: { bg: C.coral, fg: C.cream, accent: C.yellow, rule: 'rgba(245, 239, 221, 0.35)' },
    foundation: { bg: C.cream, fg: C.ink, accent: C.coral, rule: RULE_LIGHT },
  },
  art_catalog: {
    // Restrained, museum-grade. Paper and ink only, with restrained blue
    // accents like wall labels.
    cover: { bg: C.paper, fg: C.ink, accent: C.blue, rule: RULE_LIGHT },
    letter: { bg: C.paper, fg: C.ink, accent: C.blue, rule: RULE_LIGHT },
    forecast: { bg: C.cream, fg: C.ink, accent: C.blue, rule: RULE_LIGHT },
    dailyCode: { bg: C.paper, fg: C.ink, accent: C.blue, rule: RULE_LIGHT },
    foundation: { bg: C.paper, fg: C.ink, accent: C.blue, rule: RULE_LIGHT },
  },
  travel: {
    // Cool blues. Map-style dividers, postcard sensibility.
    cover: { bg: C.blue, fg: C.cream, accent: C.yellow, rule: 'rgba(245, 239, 221, 0.3)' },
    letter: { bg: C.cream, fg: C.ink, accent: C.blue, rule: RULE_LIGHT },
    forecast: { bg: C.blue, fg: C.cream, accent: C.yellow, rule: 'rgba(245, 239, 221, 0.25)' },
    dailyCode: { bg: C.cream, fg: C.ink, accent: C.blue, rule: RULE_LIGHT },
    foundation: { bg: C.paper, fg: C.ink, accent: C.blue, rule: RULE_LIGHT },
  },
  financial: {
    // Annual report. Deep green and cream. Subdued, formal, confident.
    cover: { bg: C.green, fg: C.cream, accent: C.yellow, rule: 'rgba(245, 239, 221, 0.3)' },
    letter: { bg: C.paper, fg: C.ink, accent: C.green, rule: RULE_LIGHT },
    forecast: { bg: C.green, fg: C.cream, accent: C.yellow, rule: 'rgba(245, 239, 221, 0.25)' },
    dailyCode: { bg: C.paper, fg: C.ink, accent: C.green, rule: RULE_LIGHT },
    foundation: { bg: C.paper, fg: C.ink, accent: C.green, rule: RULE_LIGHT },
  },
};

export const STYLE_LABELS: Record<ZineStyle, string> = {
  editorial: 'Editorial',
  lifestyle: 'Lifestyle',
  fashion: 'Fashion',
  art_catalog: 'Art Catalog',
  travel: 'Travel',
  financial: 'Financial',
};

export const STYLE_NOTES: Record<ZineStyle, string> = {
  editorial: 'The Monocle reference. Yellow cover, hairline rules, dramatic display.',
  lifestyle: 'Warm and paper-forward. Kinfolk-adjacent calm.',
  fashion: 'High contrast. Coral and ink. Italic captions, oversized titles.',
  art_catalog: 'Museum-grade. White space, single-image energy, quiet captions.',
  travel: 'Cool blues. Postcard sensibility, map-style dividers.',
  financial: 'Annual report. Deep green. Subdued, formal, confident.',
};
