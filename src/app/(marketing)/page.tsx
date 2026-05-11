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

/**
 * Marketing home — the hero. The argument we're making is simple:
 * "your life, printed like Monocle would print it."
 *
 * Copy is a first draft in the calm editorial voice the brief asks for.
 * Adrian to edit (flagged in OPEN_QUESTIONS).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <SamplePages />
      <Quotes />
      <CtaBlock />
    </>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section className="bg-vz-yellow text-vz-ink relative overflow-hidden">
      <div className="vz-container vz-section">
        {/* Top metadata bar — magazine-style */}
        <div className="vz-eyebrow mb-12 flex items-center justify-between">
          <span className="flex items-center gap-2.5">
            <BulletDot /> Issue I <BulletDot /> Spring {new Date().getFullYear()}
          </span>
          <span className="border-vz-ink font-display inline-flex size-10 items-center justify-center rounded-full border italic">
            VZ
          </span>
        </div>

        {/* Overline */}
        <Meta className="block text-center">
          From the desk of <em className="font-display text-base not-italic">you</em> ·
          Anywhere, Earth
        </Meta>

        {/* Masthead — the dramatic display headline */}
        <h1
          className="font-display relative mx-[-0.05em] my-2 text-center font-normal leading-[0.85] tracking-[-0.02em]"
          style={{
            fontSize: 'clamp(72px, 17vw, 240px)',
            color: 'var(--color-vz-yellow)',
            WebkitTextStroke: '2px var(--color-vz-ink)',
            textShadow:
              '4px 4px 0 var(--color-vz-ink), -1px 0 0 var(--color-vz-ink), 1px 0 0 var(--color-vz-ink)',
          }}
        >
          VISION
        </h1>

        {/* Subline */}
        <MetaRow
          className="mt-4 justify-center"
          items={[
            <span key="a">The Magazine That Explains the Years Ahead</span>,
            <span key="b">A Private Edition for You</span>,
          ]}
        />

        {/* Hero feature block — what is this? */}
        <div className="border-vz-ink mt-16 grid items-end gap-12 border-t pt-8 md:grid-cols-[1.4fr_1fr]">
          <h2
            className="font-display font-normal leading-[0.9] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(36px, 6vw, 84px)' }}
          >
            Your year, <em>printed</em> like Monocle would print it.
          </h2>
          <div className="font-serif text-[15px] leading-relaxed">
            <p>
              Vision Zine turns the messy archive of your life — vision statements, bios,
              goals, achievements — into an editorial-quality magazine.
            </p>
            <span className="font-display mt-2.5 mb-1 block text-lg italic">
              + a real, printable artifact at your door.
            </span>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/signin"
                className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream px-4 py-3 transition-colors"
              >
                Start your zine
              </Link>
              <Link
                href="/examples"
                className="vz-eyebrow border-vz-ink hover:bg-vz-ink hover:text-vz-yellow border px-4 py-3 transition-colors"
              >
                See examples
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom magazine-style meta row */}
        <div className="border-vz-ink mt-12 flex flex-wrap items-end justify-between gap-4 border-t pt-5">
          <Meta>Three sizes · Six styles · Real paper</Meta>
          <Meta>Vol. I · No. 1</Meta>
        </div>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */

function HowItWorks() {
  return (
    <section className="bg-vz-paper text-vz-ink">
      <div className="vz-container vz-section">
        <SectionHeader label="How it works" n="1" />
        <div className="grid items-end gap-8 md:grid-cols-[1fr_auto_auto]">
          <h2
            className="font-display font-normal leading-[0.9] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}
          >
            Three steps. A few hours. <em>One issue you&apos;ll keep.</em>
          </h2>
          <Meta className="text-right md:block">
            Avg. time
            <br />
            <span className="font-display text-vz-coral text-3xl not-italic">90 min</span>
          </Meta>
        </div>
        <HeavyRule className="mt-6 mb-12" />

        <div className="border-vz-ink border-l border-t grid sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <StepCard key={step.title} step={step} n={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: 'Answer prompts',
    body: "We don't give you a blank canvas. You answer thoughtful prompts about your life, work, and goals. Our editor helps you sharpen each one.",
    tag: 'Input',
  },
  {
    title: 'Pick a style',
    body: 'Six editorial templates: Editorial, Lifestyle, Fashion, Art Catalog, Travel, Financial. Each is a finished thing, not a recolored skin.',
    tag: 'Compose',
  },
  {
    title: 'Receive your zine',
    body: 'Download a print-ready PDF, share a web edition, get social crops, or have a printed copy shipped to your door.',
    tag: 'Output',
  },
] as const;

function StepCard({
  step,
  n,
}: {
  step: (typeof STEPS)[number];
  n: number;
}) {
  return (
    <div className="border-vz-ink flex flex-col gap-3.5 border-b border-r p-7 min-h-[280px]">
      <div className="flex items-start justify-between gap-3">
        <span className="font-display text-5xl leading-[0.9]">{n.toString().padStart(2, '0')}</span>
        <Eyebrow className="text-vz-coral">{step.tag}</Eyebrow>
      </div>
      <h3 className="font-display text-3xl leading-none">{step.title}</h3>
      <p className="font-serif text-[15px] leading-relaxed mt-auto">{step.body}</p>
    </div>
  );
}

/* ---------- Sample pages ---------- */

function SamplePages() {
  return (
    <section className="bg-vz-cream text-vz-ink">
      <div className="vz-container vz-section">
        <SectionHeader label="Inside an issue" n="2" />
        <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
          <h2
            className="font-display font-normal leading-[0.9] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}
          >
            Ten sections, one <em>masthead</em>.
          </h2>
          <Eyebrow className="text-vz-coral">A representative table of contents</Eyebrow>
        </div>
        <HeavyRule className="mt-6 mb-10" />

        <div className="grid gap-x-7 gap-y-0 sm:grid-cols-2">
          {TOC_ITEMS.map((item, i) => (
            <div key={item.title} className="border-vz-ink border-t py-3 grid grid-cols-[28px_1fr] gap-2">
              <span className="font-display text-xl leading-none">{i + 1}</span>
              <div>
                <p className="font-display text-[15px] uppercase tracking-wide leading-tight">
                  {item.title}
                </p>
                <p className="font-serif text-[13px] leading-snug mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <HairlineRule />
      </div>
    </section>
  );
}

const TOC_ITEMS = [
  { title: 'The Vision', desc: 'A first-person manifesto for the year ahead.' },
  { title: 'For a Co-Author', desc: 'Pages reserved for the person you build with.' },
  { title: 'Six Pillars', desc: 'Artist, Builder, Investor, Family, Vessel, Legacy.' },
  { title: 'The Forecast II', desc: 'Their goals, sorted by domain.' },
  { title: 'The Forecast', desc: 'Your goals by domain — money, art, place, body.' },
  { title: 'Foundation II', desc: 'Their receipts, their record, their wins.' },
  { title: 'The Foundation', desc: 'The case for the next chapter, in evidence.' },
  { title: 'Joint Venture', desc: 'What you build together.' },
  { title: 'The Daily Code', desc: 'Ten tenets. Read first thing. Read last thing.' },
  { title: 'Closing Note', desc: 'A letter to yourself. Signed.' },
] as const;

/* ---------- Quotes ---------- */

function Quotes() {
  return (
    <section className="bg-vz-ink text-vz-cream">
      <div className="vz-container-narrow vz-section text-center">
        <Eyebrow className="text-vz-yellow">Why a magazine</Eyebrow>
        <blockquote
          className="font-display italic font-normal mt-7 leading-[1.2]"
          style={{ fontSize: 'clamp(28px, 3.8vw, 46px)' }}
        >
          A vision board on a fridge is a wish. A magazine on a coffee table is a
          <em className="text-vz-yellow not-italic"> document</em>.
        </blockquote>
        <Meta className="text-vz-cream/70 mt-7 block">
          The premise. From the editor&apos;s letter.
        </Meta>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */

function CtaBlock() {
  return (
    <section className="bg-vz-yellow text-vz-ink">
      <div className="vz-container vz-section text-center">
        <NumberedBadge n="✦" className="mx-auto mb-6" />
        <h2
          className="font-display font-normal leading-[0.9] tracking-[-0.02em] max-w-3xl mx-auto"
          style={{ fontSize: 'clamp(36px, 6vw, 88px)' }}
        >
          Your <em>Issue I</em> is waiting.
        </h2>
        <p className="vz-prose mt-6 max-w-xl mx-auto">
          Start with a single section. Save your progress. Come back when you&apos;re ready.
          No template store, no stickers, no exclamation points.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/signin"
            className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream px-5 py-3.5 transition-colors"
          >
            Start your zine
          </Link>
          <Link
            href="/pricing"
            className="vz-eyebrow border-vz-ink hover:bg-vz-ink hover:text-vz-yellow border px-5 py-3.5 transition-colors"
          >
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
