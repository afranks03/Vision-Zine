import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, HeavyRule, Meta, SectionHeader } from '@/components/editorial';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Common questions about Vision Zine.',
};

const FAQ_SECTIONS = [
  {
    label: 'The product',
    questions: [
      {
        q: 'What exactly do I get?',
        a: 'A print-ready PDF at your chosen size (Letter, Tabloid, or Pocket), a public web edition with a shareable URL, social crops for Instagram and X, and — at the One Issue and Annual tiers — a printed copy shipped to your door from our print partner.',
      },
      {
        q: 'How long does it take to make one?',
        a: 'Most people finish their first zine in 60–120 minutes. You can save progress between sessions and answer prompts in any order. The AI editor helps sharpen each section as you go.',
      },
      {
        q: 'Can I edit it after publishing?',
        a: 'Yes. Your zine lives in your account and you can re-edit and re-export indefinitely. If you order a printed copy, that&apos;s a snapshot — re-order any time the underlying data changes.',
      },
      {
        q: 'How many styles can I try?',
        a: 'All six, instantly. Switching styles preserves all your content — only the composition changes. Pick what fits the story you&apos;re telling that year.',
      },
    ],
  },
  {
    label: 'Privacy & control',
    questions: [
      {
        q: 'Who can see my zine?',
        a: 'By default, only you. Your inputs are private. The web edition is unlisted unless you choose to publish it — and even then, sharing is link-only, not indexed.',
      },
      {
        q: 'What happens to my data if I cancel?',
        a: 'Your zines and inputs remain in your account, viewable and exportable. We never delete your work without your action. You can request full data export or deletion at any time.',
      },
      {
        q: 'Are my AI prompts used to train models?',
        a: 'No. Your content is processed through Anthropic&apos;s API and is not used for training. The same applies to anything you upload.',
      },
    ],
  },
  {
    label: 'Co-authors',
    questions: [
      {
        q: 'Can I make a zine with my partner?',
        a: 'Yes — a co-author seat is included with the Annual plan, and available as an add-on for One Issue. You invite them by email; they get a reduced set of prompts focused on their sections.',
      },
      {
        q: 'Can the co-author edit my pages?',
        a: 'No. Co-authors can only edit their own sections. Your sections remain private to you. The Joint Venture section is the one place you build something together.',
      },
    ],
  },
  {
    label: 'Print',
    questions: [
      {
        q: 'What sizes do you offer?',
        a: 'Letter (8.5 × 11 in), Tabloid (11 × 17 in), and Pocket (4.25 × 5.5 in). Each is a different reading experience — the Tabloid feels like a real magazine, the Pocket like a hand-bound journal.',
      },
      {
        q: 'Where do you print?',
        a: 'Through Lulu xPress. They ship globally, no minimums, on a 70-lb uncoated text stock that handles serif typography beautifully.',
      },
      {
        q: 'How long does shipping take?',
        a: 'Print + ship is typically 6–10 business days within the US, 10–18 days internationally. You&apos;ll get an email with tracking when your copy ships.',
      },
    ],
  },
] as const;

export default function FaqPage() {
  return (
    <>
      <header className="bg-vz-yellow text-vz-ink">
        <div className="vz-container vz-section">
          <SectionHeader label="Frequently asked" n="C" />
          <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
            <h1
              className="font-display font-normal leading-[0.9] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(40px, 7vw, 104px)' }}
            >
              The <em>questions</em> we hear most.
            </h1>
            <Meta className="md:text-right">
              Plain answers
              <br />
              <span className="text-vz-coral">— no asterisks</span>
            </Meta>
          </div>
          <HeavyRule className="mt-6" />
        </div>
      </header>

      <section className="bg-vz-paper">
        <div className="vz-container-narrow vz-section">
          <div className="space-y-16">
            {FAQ_SECTIONS.map((section, idx) => (
              <div key={section.label}>
                <SectionHeader
                  label={section.label}
                  n={(idx + 1).toString().padStart(2, '0')}
                />
                <div className="mt-7 space-y-7">
                  {section.questions.map((item) => (
                    <details
                      key={item.q}
                      className="border-vz-ink group border-t pt-5 transition-colors"
                    >
                      <summary className="font-display flex cursor-pointer items-start justify-between gap-4 text-2xl leading-tight list-none">
                        <span>{item.q}</span>
                        <span
                          aria-hidden
                          className="vz-eyebrow text-vz-coral mt-2 transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="vz-prose mt-3 text-base">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Eyebrow className="text-vz-coral">Didn&apos;t see your question?</Eyebrow>
            <p className="vz-prose mt-3 mx-auto max-w-lg text-base">
              We try to keep this list short. If something&apos;s missing, write to{' '}
              <a
                href="mailto:hello@visionzine.com"
                className="text-vz-coral hover:underline italic"
              >
                hello@visionzine.com
              </a>{' '}
              and we&apos;ll answer it here.
            </p>
            <div className="mt-7">
              <Link
                href="/signin"
                className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream inline-block px-5 py-3.5 transition-colors"
              >
                Start your zine
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
