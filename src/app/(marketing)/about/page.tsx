import type { Metadata } from 'next';
import Link from 'next/link';
import { BulletDot, Eyebrow, Meta, MetaRow, SectionHeader } from '@/components/editorial';

export const metadata: Metadata = {
  title: 'About',
  description: 'A vision board on a fridge is a wish. A magazine on a coffee table is a document.',
};

export default function AboutPage() {
  return (
    <>
      <header className="bg-vz-coral text-vz-cream">
        <div className="vz-container vz-section">
          <MetaRow
            className="mb-10"
            items={[
              <span key="a">From the desk of A.d.</span>,
              <span key="b">Brooklyn × Athens</span>,
            ]}
          />
          <h1
            className="font-display leading-[0.85] font-normal tracking-[-0.03em] italic"
            style={{ fontSize: 'clamp(48px, 9vw, 144px)' }}
          >
            About
          </h1>
          <p
            className="font-display mt-6 max-w-2xl leading-[1.15] italic"
            style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}
          >
            A vision board on a fridge is a wish. A magazine on a coffee table is a document.
          </p>
        </div>
      </header>

      <section className="bg-vz-paper text-vz-ink">
        <div className="vz-container-narrow vz-section">
          <SectionHeader label="The premise" n="1" />
          <div className="vz-prose vz-dropcap">
            <p>
              I made one of these by hand, for myself, at the start of a new year. Not on a cork
              board. Not in an app. A printed magazine — the kind you&apos;d find on a friend&apos;s
              coffee table — about the years ahead of me and the years behind.
            </p>
            <p>
              It changed how I read my own life. Not because the goals were new, but because the
              form treated them seriously. A serif headline, a hairline rule, a numbered section.
              Suddenly the work of becoming a better artist or a better partner looked like a
              working document instead of a wish on a sticky note.
            </p>
            <p>
              Vision Zine is the tool I wish I&apos;d had. You answer thoughtful prompts. We compose
              the pages. You receive a real, printable artifact — and the option to hold it in your
              hands.
            </p>
          </div>

          <div className="mt-12 grid gap-7 sm:grid-cols-2">
            <Principle
              n="1"
              title="The output is the hero."
              body="Everything in the product serves the quality of the final zine. No stickers, no fonts you'd find on a default Tumblr theme, no UI chrome that looks like a thousand other SaaS apps."
            />
            <Principle
              n="2"
              title="Editorial over decorative."
              body="Strong typography, restrained color, intentional white space. The look of someone who got dressed for the day."
            />
            <Principle
              n="3"
              title="Effortless input, high-craft output."
              body="You answer prompts. The platform composes. The asymmetry is deliberate — give us five minutes; we'll give you a magazine."
            />
            <Principle
              n="4"
              title="Print is a first-class citizen."
              body="Real, printable artifacts at three sizes: Letter, Tabloid, Pocket. The web edition is a courtesy. The PDF and the printed copy are the point."
            />
          </div>
        </div>
      </section>

      <section className="bg-vz-ink text-vz-cream" id="contact">
        <div className="vz-container-narrow vz-section text-center">
          <Eyebrow className="text-vz-yellow">The desk</Eyebrow>
          <p
            className="font-display mx-auto mt-6 max-w-3xl leading-[1.1] italic"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            Vision Zine is made by Adrian &ldquo;A.d.&rdquo; Franks — a designer and writer working
            between Brooklyn and Athens.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="mailto:hello@visionzine.com"
              className="vz-eyebrow bg-vz-yellow text-vz-ink hover:bg-vz-coral hover:text-vz-cream px-5 py-3.5 transition-colors"
            >
              Say hello
            </Link>
            <Link
              href="/signin"
              className="vz-eyebrow border-vz-cream text-vz-cream hover:bg-vz-cream hover:text-vz-ink border px-5 py-3.5 transition-colors"
            >
              Start your zine
            </Link>
          </div>
          <Meta className="text-vz-cream/60 mt-10 inline-flex items-center gap-2">
            <BulletDot /> Issue I <BulletDot /> Spring {new Date().getFullYear()}
          </Meta>
        </div>
      </section>
    </>
  );
}

function Principle({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="border-vz-ink border-t pt-5">
      <div className="flex items-start justify-between gap-4">
        <span className="font-display text-4xl leading-[0.9]">{n}</span>
        <Eyebrow className="text-vz-coral">Principle</Eyebrow>
      </div>
      <h3 className="font-display mt-2.5 text-2xl leading-tight">{title}</h3>
      <p className="vz-prose mt-2 text-base">{body}</p>
    </div>
  );
}
