/**
 * Typography presets (Phase 3d-ii).
 *
 * Each preset is a curated pairing of display / body / sans (and
 * sometimes mono) fonts that hangs together as one editorial voice.
 * Users pick a preset per-zine; the rest of the app keeps the
 * Editorial default.
 *
 * Architecture:
 *   - All preset fonts are declared here via next/font/google. Each
 *     gets a unique CSS variable (--font-dm-serif-display, etc.).
 *   - layout.tsx applies every variable to <html> so they're available
 *     globally.
 *   - globals.css :root binds the "active" var (--font-display etc.)
 *     to the Editorial preset by default.
 *   - The zine root component reads zine.typography_preset and emits
 *     inline style overrides for the active vars, so the inner spreads
 *     pick up the right pairing without any code changes.
 *
 * Trade-off: declaring all preset fonts globally means every page
 * carries the CSS for ~10 font families. Each font is small (subset
 * latin only, limited weights) but it adds up to ~150-300 KB of CSS +
 * font files in the page weight. Acceptable for Phase 3d-ii;
 * dynamic per-route font loading is a Phase 6 optimization.
 */
import {
  Archivo,
  Archivo_Black,
  Cormorant_Garamond,
  DM_Serif_Display,
  Inter,
  JetBrains_Mono,
  Newsreader,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Source_Serif_4,
  Space_Grotesk,
  Space_Mono,
} from 'next/font/google';

/* ----- font declarations ----- */
// Each call here makes next/font fetch the font at build time and
// self-host it. Keep weights minimal so the bundle doesn't bloat.

const dmSerifDisplay = DM_Serif_Display({
  variable: '--font-dm-serif-display',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
});

const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
});

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const archivoBlack = Archivo_Black({
  variable: '--font-archivo-black',
  subsets: ['latin'],
  weight: ['400'],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
});

/**
 * One className that, when applied to <html>, makes every preset's
 * CSS variable available. Used in layout.tsx.
 */
export const allFontVariables = [
  dmSerifDisplay.variable,
  sourceSerif.variable,
  archivo.variable,
  playfair.variable,
  cormorant.variable,
  newsreader.variable,
  inter.variable,
  spaceGrotesk.variable,
  jetbrainsMono.variable,
  archivoBlack.variable,
  plusJakarta.variable,
  spaceMono.variable,
].join(' ');

/* ----- preset definitions ----- */

export type TypographyPreset = 'editorial' | 'modern' | 'romantic' | 'news' | 'brutalist';

export interface TypographyPresetConfig {
  id: TypographyPreset;
  name: string;
  description: string;
  /** CSS variable names (without var()) that the spread CSS resolves to. */
  vars: {
    display: string;
    serif: string;
    sans: string;
    mono?: string;
  };
  /** Sample type to show in the studio picker preview cell. */
  sample: { display: string; body: string };
}

export const TYPOGRAPHY_PRESETS: Record<TypographyPreset, TypographyPresetConfig> = {
  editorial: {
    id: 'editorial',
    name: 'Editorial',
    description: 'Dramatic literary serif. Vision Zine default.',
    vars: {
      display: '--font-dm-serif-display',
      serif: '--font-source-serif',
      sans: '--font-archivo',
    },
    sample: { display: 'The Year', body: 'A magazine of departures.' },
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Geometric sans. Tech-magazine clarity.',
    vars: {
      display: '--font-space-grotesk',
      serif: '--font-inter',
      sans: '--font-inter',
      mono: '--font-jetbrains-mono',
    },
    sample: { display: 'The Year', body: 'A magazine of departures.' },
  },
  romantic: {
    id: 'romantic',
    name: 'Romantic',
    description: 'Decorative display serif over book Garamond.',
    vars: {
      display: '--font-playfair',
      serif: '--font-cormorant',
      sans: '--font-archivo',
    },
    sample: { display: 'The Year', body: 'A magazine of departures.' },
  },
  news: {
    id: 'news',
    name: 'News',
    description: 'The New Yorker. Newsreader, top to bottom.',
    vars: {
      display: '--font-newsreader',
      serif: '--font-newsreader',
      sans: '--font-inter',
    },
    sample: { display: 'The Year', body: 'A magazine of departures.' },
  },
  brutalist: {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Heavy block display. The Face / Wired.',
    vars: {
      display: '--font-archivo-black',
      serif: '--font-plus-jakarta',
      sans: '--font-plus-jakarta',
      mono: '--font-space-mono',
    },
    sample: { display: 'The Year', body: 'A magazine of departures.' },
  },
};

/**
 * Inline style props that override --font-display / --font-serif /
 * --font-sans (and optionally --font-mono) to the preset's fonts.
 * Apply to the zine root <div>; CSS inheritance propagates to all
 * descendant spreads.
 */
export function presetCssVars(preset: TypographyPreset): React.CSSProperties {
  const cfg = TYPOGRAPHY_PRESETS[preset];
  const out: Record<string, string> = {
    '--font-display': `var(${cfg.vars.display})`,
    '--font-serif': `var(${cfg.vars.serif})`,
    '--font-sans': `var(${cfg.vars.sans})`,
  };
  if (cfg.vars.mono) {
    out['--font-mono'] = `var(${cfg.vars.mono})`;
  }
  return out as React.CSSProperties;
}
