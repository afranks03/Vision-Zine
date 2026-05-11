import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BulletDot,
  Eyebrow,
  HairlineRule,
  HeavyRule,
  Meta,
  SectionHeader,
} from '@/components/editorial';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Three tiers. Pay once or subscribe annually.',
};

/**
 * Pricing — actual prices are deferred until prototype validates (per DECISIONS.md).
 * Numbers shown here are placeholders. Adrian to set real prices in Stripe; this page
 * will read from env-driven price metadata.
 */
const TIERS = [
  {
    name: 'Preview',
    price: 'Free',
    cadence: 'No card required',
    bg: 'bg-vz-paper',
    fg: 'text-vz-ink',
    tag: 'Try it',
    primary: false,
    features: [
      'Full input studio',
      'Live web preview of every page',
      'Watermarked PDF preview',
      'Choose one style and format',
    ],
    cta: 'Start a preview',
  },
  {
    name: 'One Issue',
    price: '$—',
    cadence: 'One-time, per zine',
    bg: 'bg-vz-yellow',
    fg: 'text-vz-ink',
    tag: 'Most chosen',
    primary: true,
    features: [
      'Everything in Preview',
      'Print-ready PDF at three sizes',
      'Public web edition with shareable URL',
      'Social crops (1080 × 1080, 1080 × 1920, 1200 × 630)',
      'One printed copy shipped to your door',
    ],
    cta: 'Make one issue',
  },
  {
    name: 'Annual',
    price: '$—',
    cadence: 'Per year, billed once',
    bg: 'bg-vz-ink',
    fg: 'text-vz-cream',
    tag: 'Issue I, II, III…',
    primary: false,
    features: [
      'Everything in One Issue',
      'Issue duplication with year-on-year diffs',
      'Annual reminder + reissue flow',
      'Co-author seat included',
      'Two printed copies per issue',
    ],
    cta: 'Subscribe yearly',
  },
] as const;

export default function PricingPage() {
  return (
    <>
      <header className="bg-vz-cream">
        <div className="vz-container vz-section">
          <SectionHeader label="Pricing" n="B" />
          <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
            <h1
              className="font-display font-normal leading-[0.9] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(40px, 7vw, 104px)' }}
            >
              Pay once. <em>Or every year.</em>
            </h1>
            <Meta className="md:text-right">
              No trial paywalls
              <br />
              <span className="text-vz-coral">— see it before you pay</span>
            </Meta>
          </div>
          <HeavyRule className="mt-6" />
          <p className="vz-prose mt-6 max-w-2xl">
            Final prices are set during invite preview — what you see below is the shape of
            the offer.
          </p>
        </div>
      </header>

      <section>
        <div className="border-vz-ink border-l grid grid-cols-1 md:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.name}
              className={`${tier.bg} ${tier.fg} border-vz-ink relative flex flex-col gap-6 border-r border-b p-10`}
            >
              <div className="flex items-start justify-between">
                <Eyebrow>{tier.tag}</Eyebrow>
                {tier.primary && (
                  <span className="vz-meta bg-vz-coral text-vz-cream px-2 py-1">
                    Recommended
                  </span>
                )}
              </div>
              <h2 className="font-display text-5xl leading-[0.9] tracking-[-0.02em]">
                {tier.name}
              </h2>
              <div>
                <p className="font-display text-6xl leading-[0.85]">{tier.price}</p>
                <Meta className="mt-2 block">{tier.cadence}</Meta>
              </div>
              <HairlineRule className="bg-current/30" />
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="font-serif flex items-start gap-3 text-[15px] leading-snug">
                    <BulletDot className="mt-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signin"
                className={`vz-eyebrow mt-auto px-4 py-3 text-center transition-colors ${
                  tier.primary
                    ? 'bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream'
                    : tier.fg === 'text-vz-cream'
                      ? 'bg-vz-yellow text-vz-ink hover:bg-vz-coral hover:text-vz-cream'
                      : 'border-current border hover:bg-vz-ink hover:text-vz-yellow hover:border-vz-ink'
                }`}
              >
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-vz-paper">
        <div className="vz-container-narrow vz-section-tight">
          <Eyebrow className="text-vz-coral">Common questions</Eyebrow>
          <div className="mt-7 space-y-7">
            <PricingQ
              q="Can I get a printed copy without subscribing?"
              a="Yes. One Issue includes a printed copy shipped to your door."
            />
            <PricingQ
              q="Do you take a percentage of the printed sale?"
              a="No. You pay one flat fee — Vision Zine handles fulfillment through Lulu xPress at cost."
            />
            <PricingQ
              q="What if I just want to try the input studio?"
              a="Preview is free, forever. You only pay when you want to export a print-ready PDF or order a copy."
            />
          </div>
          <div className="mt-10 text-center">
            <Link href="/faq" className="vz-eyebrow text-vz-coral hover:text-vz-ink transition-colors">
              See all FAQs →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PricingQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-vz-ink border-t pt-5">
      <h3 className="font-display text-2xl leading-tight">{q}</h3>
      <p className="vz-prose mt-2 text-base">{a}</p>
    </div>
  );
}
