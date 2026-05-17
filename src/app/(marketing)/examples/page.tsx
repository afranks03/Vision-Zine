import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, HeavyRule, Meta, SectionHeader } from '@/components/editorial';

export const metadata: Metadata = {
  title: 'Examples',
  description: 'Six editorial styles. Three sizes. Each one a finished thing.',
};

const STYLES = [
  {
    name: 'Editorial',
    bg: 'bg-vz-yellow',
    fg: 'text-vz-ink',
    tag: 'Issue I',
    blurb:
      'The Monocle reference. Bold serif masthead, two-column reading, hairline rules, dramatic display headlines.',
    mood: 'Bookshelf, weekend read',
  },
  {
    name: 'Lifestyle',
    bg: 'bg-vz-rose',
    fg: 'text-vz-ink',
    tag: 'Issue II',
    blurb:
      'Warm, paper-forward, generous photography. Reads like Kinfolk or Cereal — a slow, intentional life.',
    mood: 'Sunday morning, coffee',
  },
  {
    name: 'Fashion',
    bg: 'bg-vz-coral',
    fg: 'text-vz-cream',
    tag: 'Issue III',
    blurb:
      'High-contrast, condensed type, runway pacing. Bold blocks of color, italic captions, an outsized table of contents.',
    mood: 'Studio, first proof',
  },
  {
    name: 'Art Catalog',
    bg: 'bg-vz-paper',
    fg: 'text-vz-ink',
    tag: 'Issue IV',
    blurb:
      'Restrained, museum-grade. Lots of white space, single-image spreads, captions in a quiet sans.',
    mood: 'Gallery, opening night',
  },
  {
    name: 'Travel',
    bg: 'bg-vz-blue',
    fg: 'text-vz-cream',
    tag: 'Issue V',
    blurb:
      'A journey told in legs. Map-style chapter dividers, mileage tickers, postcard sidebars, ferry-schedule footers.',
    mood: 'Window seat, slow train',
  },
  {
    name: 'Financial',
    bg: 'bg-vz-green',
    fg: 'text-vz-cream',
    tag: 'Issue VI',
    blurb:
      'The annual report you actually want to read. Charts treated like covers, footnotes in a serif you can love.',
    mood: 'Year end, planning ahead',
  },
] as const;

export default function ExamplesPage() {
  return (
    <>
      <header className="bg-vz-paper">
        <div className="vz-container vz-section">
          <SectionHeader label="Examples" n="A" />
          <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
            <h1
              className="font-display leading-[0.9] font-normal tracking-[-0.02em]"
              style={{ fontSize: 'clamp(40px, 7vw, 104px)' }}
            >
              Six styles. Each one a <em>finished thing</em>.
            </h1>
            <Meta className="md:text-right">
              Not recolored skins
              <br />
              <span className="text-vz-coral">— intentional design systems</span>
            </Meta>
          </div>
          <HeavyRule className="mt-6" />
        </div>
      </header>

      <section>
        <div className="border-vz-ink grid grid-cols-1 border-l md:grid-cols-2 lg:grid-cols-3">
          {STYLES.map((style, i) => (
            <article
              key={style.name}
              className={`${style.bg} ${style.fg} border-vz-ink relative flex min-h-[440px] flex-col gap-5 border-r border-b p-9`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-6xl leading-[0.85]">
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <Eyebrow>{style.tag}</Eyebrow>
              </div>
              <h2 className="font-display text-4xl leading-[0.95] tracking-[-0.01em]">
                {style.name}
              </h2>
              <p className="font-serif text-[15px] leading-relaxed">{style.blurb}</p>
              <div className="mt-auto flex items-center justify-between border-t border-current pt-3.5">
                <Eyebrow>{style.mood}</Eyebrow>
                <Eyebrow>Letter · Pocket</Eyebrow>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-vz-cream">
        <div className="vz-container vz-section-tight text-center">
          <Eyebrow className="text-vz-coral">A note on photography</Eyebrow>
          <p className="vz-prose mx-auto mt-5 max-w-2xl">
            Each template ships with a working layout system. You bring the words and images; we
            handle the typography, hierarchy, and rhythm so every page looks intentional.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/signin"
              className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream px-5 py-3.5 transition-colors"
            >
              Start your own
            </Link>
            <Link
              href="/pricing"
              className="vz-eyebrow border-vz-ink hover:bg-vz-ink hover:text-vz-yellow border px-5 py-3.5 transition-colors"
            >
              Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
