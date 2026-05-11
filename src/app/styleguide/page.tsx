import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BulletDot,
  Eyebrow,
  HairlineRule,
  HeavyRule,
  Meta,
  MetaRow,
  NumberedBadge,
  SectionHeader,
} from '@/components/editorial';

export const metadata: Metadata = {
  title: 'Styleguide',
  description: 'Vision Zine design system — colors, type, components.',
};

/**
 * /styleguide — single-page reference of every brand value in the system.
 * Used as a visual companion when designing in Figma alongside the synced
 * Tokens Studio variables.
 */
export default function StyleguidePage() {
  return (
    <div className="bg-vz-oat text-vz-ink min-h-screen">
      <header className="bg-vz-yellow text-vz-ink border-vz-ink border-b">
        <div className="vz-container vz-section-tight">
          <MetaRow
            className="mb-6"
            items={[
              <Link key="home" href="/" className="hover:text-vz-coral transition-colors">
                Vision Zine
              </Link>,
              <span key="s">Design system</span>,
              <span key="v">Issue I</span>,
            ]}
          />
          <h1
            className="font-display leading-[0.9] font-normal tracking-[-0.02em]"
            style={{ fontSize: 'clamp(40px, 8vw, 120px)' }}
          >
            The <em>Styleguide</em>.
          </h1>
          <p className="vz-prose mt-6 max-w-2xl">
            Every color, font, type scale, and primitive in the Vision Zine system. Mirrors the
            values in <code className="font-mono text-sm">src/app/globals.css</code> and{' '}
            <code className="font-mono text-sm">design/tokens.json</code>. Use as a companion when
            designing in Figma.
          </p>
        </div>
      </header>

      <ColorsSection />
      <FontsSection />
      <TypographySection />
      <SpacingSection />
      <ComponentsSection />
      <TemplatePalettesSection />
    </div>
  );
}

/* ============================================================
   Colors
   ============================================================ */

const BRAND_COLORS = [
  { name: 'Yellow', token: 'vz-yellow', hex: '#FFD629', note: 'Primary brand. Cover, CTAs.' },
  { name: 'Yellow deep', token: 'vz-yellow-deep', hex: '#F0C420', note: 'Pressed state.' },
  { name: 'Ink', token: 'vz-ink', hex: '#0A0A0A', note: 'Text, hairlines, primary buttons.' },
  { name: 'Ink soft', token: 'vz-ink-soft', hex: '#1A1A1A', note: 'Secondary text.' },
  { name: 'Cream', token: 'vz-cream', hex: '#F5EFDD', note: "Editor's-letter surface." },
  { name: 'Paper', token: 'vz-paper', hex: '#FAF6E9', note: 'Cards, panels.' },
  { name: 'Oat', token: 'vz-oat', hex: '#EAE6D8', note: 'Body background.' },
  { name: 'Coral', token: 'vz-coral', hex: '#E8584C', note: 'Accent. Hover, eyebrows.' },
  { name: 'Rose', token: 'vz-rose', hex: '#EFAFA0', note: 'Lifestyle template.' },
  { name: 'Pink paper', token: 'vz-pink-paper', hex: '#F4D8CE', note: 'Co-author surfaces.' },
  { name: 'Green', token: 'vz-green', hex: '#2A6E3F', note: 'Financial template, success.' },
  { name: 'Blue', token: 'vz-blue', hex: '#1F4E89', note: 'Travel template.' },
];

function ColorsSection() {
  return (
    <section className="bg-vz-paper text-vz-ink">
      <div className="vz-container vz-section-tight">
        <SectionHeader label="Colors" n="A" />
        <h2
          className="font-display mt-3 leading-[0.9] font-normal tracking-[-0.02em]"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
        >
          Twelve colors. <em>No more.</em>
        </h2>
        <HeavyRule className="mt-6 mb-10" />

        <div className="border-vz-ink grid grid-cols-2 border-l sm:grid-cols-3 lg:grid-cols-4">
          {BRAND_COLORS.map((c) => (
            <div
              key={c.token}
              className="border-vz-ink flex min-h-[180px] flex-col border-r border-b"
            >
              <div className="flex-1" style={{ background: c.hex }} aria-hidden />
              <div className="bg-vz-paper p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl leading-none">{c.name}</h3>
                  <Meta className="text-vz-ink/60 font-mono">{c.hex}</Meta>
                </div>
                <Meta className="text-vz-coral mt-1.5 block">--color-{c.token}</Meta>
                <p className="text-vz-ink/70 mt-2 font-serif text-sm leading-snug">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Fonts
   ============================================================ */

function FontsSection() {
  return (
    <section className="bg-vz-cream text-vz-ink">
      <div className="vz-container vz-section-tight">
        <SectionHeader label="Fonts" n="B" />
        <h2
          className="font-display mt-3 leading-[0.9] font-normal tracking-[-0.02em]"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
        >
          Three families. <em>Three roles.</em>
        </h2>
        <HeavyRule className="mt-6 mb-10" />

        <div className="grid gap-10 md:grid-cols-3">
          <FontCard
            name="DM Serif Display"
            role="Display"
            cssVar="--font-display"
            sample={
              <p className="font-display text-6xl leading-[0.9]">
                A magazine is a <em>document</em>.
              </p>
            }
            usage="Headlines, mastheads, italic emphasis. Use 400 weight only."
          />
          <FontCard
            name="Source Serif 4"
            role="Body"
            cssVar="--font-serif"
            sample={
              <p className="font-serif text-lg leading-relaxed">
                Strong typography, restrained color, intentional white space — the look of someone
                who got dressed for the day.
              </p>
            }
            usage="Long-form reading copy. Variable weight 300–900, italic available."
          />
          <FontCard
            name="Archivo"
            role="UI / Labels"
            cssVar="--font-sans"
            sample={
              <p className="font-sans text-sm font-bold tracking-widest uppercase">
                From the desk · Issue I · Spring 2026
              </p>
            }
            usage="Eyebrows, meta labels, nav, buttons. Variable weight; uppercase + letter-spaced."
          />
        </div>
      </div>
    </section>
  );
}

function FontCard({
  name,
  role,
  cssVar,
  sample,
  usage,
}: {
  name: string;
  role: string;
  cssVar: string;
  sample: React.ReactNode;
  usage: string;
}) {
  return (
    <div className="border-vz-ink bg-vz-paper flex flex-col gap-4 border p-6">
      <div className="flex items-baseline justify-between">
        <Eyebrow className="text-vz-coral">{role}</Eyebrow>
        <Meta className="text-vz-ink/60 font-mono">{cssVar}</Meta>
      </div>
      <h3 className="font-display text-2xl leading-tight">{name}</h3>
      <HairlineRule />
      <div className="min-h-[120px]">{sample}</div>
      <HairlineRule />
      <p className="text-vz-ink/70 font-serif text-sm leading-snug">{usage}</p>
    </div>
  );
}

/* ============================================================
   Typography
   ============================================================ */

const TYPE_STYLES = [
  {
    name: 'Masthead',
    token: 'typography.masthead',
    cls: 'font-display tracking-[-0.02em]',
    size: 'clamp(72px, 17vw, 240px)',
    lh: '0.85',
    sample: 'VISION',
  },
  {
    name: 'H1',
    token: 'typography.h1',
    cls: 'font-display tracking-[-0.02em]',
    size: 'clamp(40px, 7vw, 104px)',
    lh: '0.9',
    sample: 'Your year, printed.',
  },
  {
    name: 'H2',
    token: 'typography.h2',
    cls: 'font-display tracking-[-0.02em]',
    size: 'clamp(36px, 5.5vw, 72px)',
    lh: '0.9',
    sample: 'Three steps. A few hours.',
  },
  {
    name: 'H3',
    token: 'typography.h3',
    cls: 'font-display tracking-[-0.01em]',
    size: 'clamp(28px, 4vw, 48px)',
    lh: '0.95',
    sample: 'Issue I',
  },
  {
    name: 'H4',
    token: 'typography.h4',
    cls: 'font-display tracking-[-0.01em]',
    size: '30px',
    lh: '0.95',
    sample: 'Editorial',
  },
  {
    name: 'Prose',
    token: 'typography.prose',
    cls: 'font-serif',
    size: 'clamp(17px, 1.6vw, 21px)',
    lh: '1.55',
    sample: 'A vision board on a fridge is a wish. A magazine on a coffee table is a document.',
  },
  {
    name: 'Body',
    token: 'typography.body',
    cls: 'font-serif',
    size: '15px',
    lh: '1.45',
    sample: 'Six editorial templates. Three formats.',
  },
  {
    name: 'Eyebrow',
    token: 'typography.eyebrow',
    cls: 'font-sans font-bold uppercase tracking-widest',
    size: '11px',
    lh: '1.5',
    sample: 'From the desk',
  },
  {
    name: 'Meta',
    token: 'typography.meta',
    cls: 'font-sans font-bold uppercase',
    size: '10px',
    lh: '1.6',
    sample: '© 2026 · Brooklyn × Athens',
  },
];

function TypographySection() {
  return (
    <section className="bg-vz-paper text-vz-ink">
      <div className="vz-container vz-section-tight">
        <SectionHeader label="Type scale" n="C" />
        <h2
          className="font-display mt-3 leading-[0.9] font-normal tracking-[-0.02em]"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
        >
          The <em>ramp</em>.
        </h2>
        <HeavyRule className="mt-6 mb-10" />

        <div className="space-y-0">
          {TYPE_STYLES.map((t, i) => (
            <div
              key={t.name}
              className={`border-vz-ink ${i === 0 ? 'border-t' : ''} grid gap-4 border-b py-6 md:grid-cols-[200px_1fr_220px] md:items-baseline`}
            >
              <div>
                <h3 className="font-display text-xl leading-none">{t.name}</h3>
                <Meta className="text-vz-coral mt-1.5 block">{t.token}</Meta>
              </div>
              <div
                className={t.cls}
                style={{
                  fontSize: t.size,
                  lineHeight: t.lh,
                  letterSpacing: t.cls.includes('uppercase') ? '0.1em' : undefined,
                }}
              >
                {t.sample}
              </div>
              <Meta className="text-vz-ink/60 font-mono">
                {t.size}
                <br />
                line-height {t.lh}
              </Meta>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Spacing
   ============================================================ */

const SPACING_VALUES = [
  { name: 'spacing.1', px: 4 },
  { name: 'spacing.2', px: 8 },
  { name: 'spacing.3', px: 12 },
  { name: 'spacing.4', px: 16 },
  { name: 'spacing.5', px: 20 },
  { name: 'spacing.6', px: 24 },
  { name: 'spacing.7', px: 28 },
  { name: 'spacing.8', px: 32 },
  { name: 'spacing.10', px: 40 },
  { name: 'spacing.12', px: 48 },
  { name: 'spacing.14', px: 56 },
  { name: 'spacing.16', px: 64 },
  { name: 'spacing.20', px: 80 },
  { name: 'spacing.24', px: 96 },
  { name: 'spacing.32', px: 128 },
];

function SpacingSection() {
  return (
    <section className="bg-vz-cream text-vz-ink">
      <div className="vz-container vz-section-tight">
        <SectionHeader label="Spacing" n="D" />
        <h2
          className="font-display mt-3 leading-[0.9] font-normal tracking-[-0.02em]"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
        >
          The <em>rhythm</em>.
        </h2>
        <HeavyRule className="mt-6 mb-10" />

        <ul className="border-vz-ink space-y-3 border-t pt-4">
          {SPACING_VALUES.map((s) => (
            <li key={s.name} className="flex items-center gap-6">
              <Meta className="text-vz-coral w-28 shrink-0 font-mono">{s.name}</Meta>
              <Meta className="text-vz-ink/60 w-14 shrink-0 font-mono">{s.px}px</Meta>
              <div className="bg-vz-ink h-3" style={{ width: `${s.px}px` }} aria-hidden />
            </li>
          ))}
        </ul>
        <p className="text-vz-ink/70 mt-6 font-serif text-sm">
          Container max-width: 1280px · Section vertical padding: 60–140px clamp · Editorial radius:
          0 everywhere (badges are <code className="font-mono">rounded-full</code>).
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   Components
   ============================================================ */

function ComponentsSection() {
  return (
    <section className="bg-vz-paper text-vz-ink">
      <div className="vz-container vz-section-tight">
        <SectionHeader label="Components" n="E" />
        <h2
          className="font-display mt-3 leading-[0.9] font-normal tracking-[-0.02em]"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
        >
          The <em>primitives</em>.
        </h2>
        <HeavyRule className="mt-6 mb-10" />

        <div className="grid gap-12 md:grid-cols-2">
          <ComponentDemo
            label="Eyebrow"
            cssVar=".vz-eyebrow"
            description="Small-caps Monocle label. 11px Archivo bold uppercase, letter-spacing 0.1em."
          >
            <Eyebrow>From the desk</Eyebrow>
          </ComponentDemo>

          <ComponentDemo
            label="Meta"
            cssVar=".vz-meta"
            description="Tinier label, 10px, letter-spacing 0.12em."
          >
            <Meta>© Vision Zine · Brooklyn × Athens</Meta>
          </ComponentDemo>

          <ComponentDemo
            label="Numbered badge"
            cssVar=".vz-num-badge"
            description="24px circle. Default ink/yellow. Variants: invert, coral."
          >
            <div className="flex gap-3">
              <NumberedBadge n="1" />
              <NumberedBadge n="2" variant="invert" />
              <NumberedBadge n="3" variant="coral" />
              <NumberedBadge n="✦" />
            </div>
          </ComponentDemo>

          <ComponentDemo
            label="Bullet row"
            cssVar="MetaRow component"
            description="Meta items separated by filled bullet dots."
          >
            <MetaRow
              items={[
                <span key="a">Issue I</span>,
                <span key="b">Spring 2026</span>,
                <span key="c">Brooklyn</span>,
              ]}
            />
          </ComponentDemo>

          <ComponentDemo
            label="Hairline rule"
            cssVar="<HairlineRule />"
            description="1px ink divider."
          >
            <HairlineRule />
          </ComponentDemo>

          <ComponentDemo
            label="Heavy rule"
            cssVar="<HeavyRule />"
            description="2px ink rule under feature headers."
          >
            <HeavyRule />
          </ComponentDemo>

          <ComponentDemo
            label="Primary CTA"
            cssVar="bg-vz-ink text-vz-yellow"
            description="Ink background, yellow text, no radius. Hover → coral/cream."
          >
            <button
              type="button"
              className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream cursor-pointer px-5 py-3.5 transition-colors"
            >
              Start your zine
            </button>
          </ComponentDemo>

          <ComponentDemo
            label="Outline button"
            cssVar="border-vz-ink"
            description="1px ink border, transparent fill. Hover → ink/yellow."
          >
            <button
              type="button"
              className="vz-eyebrow border-vz-ink hover:bg-vz-ink hover:text-vz-yellow cursor-pointer border px-5 py-3.5 transition-colors"
            >
              See pricing
            </button>
          </ComponentDemo>

          <ComponentDemo
            label="Section header"
            cssVar="<SectionHeader />"
            description="Numbered badge + small-caps label + hairline rule."
            wide
          >
            <SectionHeader label="How it works" n="1" />
          </ComponentDemo>

          <ComponentDemo
            label="Bullet dot"
            cssVar="<BulletDot />"
            description="6px filled circle separator. Inherits currentColor."
            wide
          >
            <p className="vz-eyebrow flex items-center gap-2.5">
              Issue I <BulletDot /> Vol. 1 <BulletDot /> Spring 2026
            </p>
          </ComponentDemo>
        </div>
      </div>
    </section>
  );
}

function ComponentDemo({
  label,
  cssVar,
  description,
  children,
  wide,
}: {
  label: string;
  cssVar: string;
  description: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`border-vz-ink flex flex-col gap-4 border-t pt-5 ${wide ? 'md:col-span-2' : ''}`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl leading-none">{label}</h3>
        <Meta className="text-vz-coral font-mono">{cssVar}</Meta>
      </div>
      <p className="text-vz-ink/70 font-serif text-sm leading-snug">{description}</p>
      <div className="bg-vz-cream border-vz-ink/20 flex items-start gap-4 border p-6">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   Template palettes
   ============================================================ */

const TEMPLATE_PALETTES = [
  { name: 'Editorial', bg: '#FFD629', fg: '#0A0A0A', accent: '#E8584C', issue: 'I' },
  { name: 'Lifestyle', bg: '#EFAFA0', fg: '#0A0A0A', accent: '#FFD629', issue: 'II' },
  { name: 'Fashion', bg: '#E8584C', fg: '#F5EFDD', accent: '#0A0A0A', issue: 'III' },
  { name: 'Art Catalog', bg: '#FAF6E9', fg: '#0A0A0A', accent: '#1F4E89', issue: 'IV' },
  { name: 'Travel', bg: '#1F4E89', fg: '#F5EFDD', accent: '#FFD629', issue: 'V' },
  { name: 'Financial', bg: '#2A6E3F', fg: '#F5EFDD', accent: '#FFD629', issue: 'VI' },
];

function TemplatePalettesSection() {
  return (
    <section className="bg-vz-ink text-vz-cream">
      <div className="vz-container vz-section-tight">
        <SectionHeader
          label="Template palettes"
          n="F"
          className="text-vz-cream [&_p]:text-vz-cream"
        />
        <h2
          className="font-display mt-3 leading-[0.9] font-normal tracking-[-0.02em]"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
        >
          Six zines. <em>Six worlds.</em>
        </h2>
        <HairlineRule className="bg-vz-cream/40 mt-6 mb-10" />

        <div className="border-vz-cream/40 grid gap-0 border-l sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_PALETTES.map((p) => (
            <div
              key={p.name}
              className="border-vz-cream/40 flex min-h-[200px] flex-col border-r border-b"
              style={{ background: p.bg, color: p.fg }}
            >
              <div className="flex flex-1 items-start justify-between p-6">
                <span className="font-display text-6xl leading-[0.85]">{p.issue}</span>
                <span
                  className="font-display text-2xl leading-none italic"
                  style={{ color: p.accent }}
                >
                  •
                </span>
              </div>
              <div className="bg-vz-ink/10 p-4" style={{ background: 'rgba(0,0,0,0.15)' }}>
                <Meta className="block" style={{ color: p.fg }}>
                  {p.name}
                </Meta>
                <p className="mt-1.5 font-mono text-xs" style={{ color: p.fg, opacity: 0.8 }}>
                  bg {p.bg} · fg {p.fg} · accent {p.accent}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-vz-cream/40 mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
          <Meta className="text-vz-cream/70">
            <Link href="/" className="hover:text-vz-yellow transition-colors">
              Vision Zine
            </Link>{' '}
            · Styleguide · Issue I
          </Meta>
          <Meta className="text-vz-yellow">tokens.json synced via Tokens Studio</Meta>
        </div>
      </div>
    </section>
  );
}
