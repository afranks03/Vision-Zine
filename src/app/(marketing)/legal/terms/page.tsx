import type { Metadata } from 'next';
import { Eyebrow, HeavyRule, Meta } from '@/components/editorial';

export const metadata: Metadata = {
  title: 'Terms of service',
  description: 'Terms for using Vision Zine.',
};

/**
 * Terms of service (Phase 5e). Placeholder content in brand voice.
 * Should be reviewed by counsel before launch. The intent is to have
 * a real page at the URL the footer is already pointing at, not a
 * 404.
 */
export default function TermsPage() {
  const updated = '2026-05-19';
  return (
    <article className="vz-container vz-section max-w-3xl">
      <Eyebrow className="text-vz-coral">Terms</Eyebrow>
      <h1
        className="font-display mt-3 leading-[0.95] tracking-[-0.02em]"
        style={{ fontSize: 'clamp(40px, 7vw, 88px)' }}
      >
        How this works.
      </h1>
      <Meta className="text-vz-ink/60 mt-4 block">Last updated: {updated}</Meta>
      <HeavyRule className="mt-8" />

      <div className="vz-prose mt-10 space-y-7 text-base leading-relaxed">
        <Section title="What Vision Zine is">
          <p>
            Vision Zine is a tool for turning the story of your year into a printable,
            editorial-quality magazine. You sign up, answer prompts, pick a style and a format,
            and receive a PDF, a shareable web edition, and (optionally) a printed copy.
          </p>
        </Section>

        <Section title="Your account">
          <p>
            You need an account to use Vision Zine. You&rsquo;re responsible for what happens on
            it — keep your email&rsquo;s sign-in link private. Don&rsquo;t share your account or
            impersonate someone else.
          </p>
        </Section>

        <Section title="What you make is yours">
          <p>
            You own everything you put into Vision Zine and everything Vision Zine produces from
            your content — the PDF, the web edition, the printed copy. Vision Zine has no claim on
            your text, your photographs, or your finished issue.
          </p>
          <p>
            By using the service, you grant us a narrow license to store, process, render, and
            print your content so we can deliver the product to you. We don&rsquo;t use your
            content for marketing or to train models.
          </p>
        </Section>

        <Section title="What you can't do">
          <p>You agree not to use Vision Zine to:</p>
          <ul className="vz-prose mt-2 list-disc space-y-1.5 pl-6">
            <li>Upload content you don&rsquo;t have the rights to.</li>
            <li>Harass anyone, including in a co-author invitation.</li>
            <li>
              Use the AI prompts to generate hateful, deceptive, or unlawful content. The model
              providers we use have their own usage policies and we&rsquo;ll honor them.
            </li>
            <li>Reverse engineer, abuse the rate limits, or attempt to extract other users&rsquo; data.</li>
          </ul>
        </Section>

        <Section title="Payment & print orders">
          <p>
            Payments are processed by Stripe. Print orders are fulfilled by Lulu xPress. We charge
            the price shown at checkout. Once a print order is submitted to Lulu, it can&rsquo;t
            be canceled — they print on demand, so the moment they accept the job, the cost is
            committed.
          </p>
          <p>
            Refunds for digital products are case-by-case in the first seven days. Email{' '}
            <a className="text-vz-coral underline-offset-2 hover:underline" href="mailto:hello@visionzine.com">
              hello@visionzine.com
            </a>{' '}
            if something didn&rsquo;t work the way it should.
          </p>
        </Section>

        <Section title="Co-authors">
          <p>
            When you invite a co-author, they get a magic link to write the joint section of your
            issue. They can&rsquo;t see your other sections until you publish. By inviting them,
            you confirm you have their permission to use their email address.
          </p>
        </Section>

        <Section title="Subscriptions & cancellations">
          <p>
            One-time purchases cover one issue. Annual subscriptions renew automatically until
            you cancel, which you can do anytime from your dashboard. Cancellation takes effect
            at the end of the current period.
          </p>
        </Section>

        <Section title="Termination">
          <p>
            You can close your account anytime. We can suspend or terminate accounts that violate
            these terms or harm other users, with notice when feasible.
          </p>
        </Section>

        <Section title="Service & warranties">
          <p>
            We do our best to keep the service up and accurate, but Vision Zine is provided
            &ldquo;as is.&rdquo; We don&rsquo;t guarantee that every feature is available all the
            time, or that every printed issue arrives on schedule (printing and shipping involve
            third parties we depend on).
          </p>
        </Section>

        <Section title="Liability">
          <p>
            To the extent allowed by law, Vision Zine&rsquo;s total liability for any claim is
            capped at the amount you paid us in the twelve months before the claim arose, or $50,
            whichever is greater.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These terms are governed by the laws of the State of New York, USA. Disputes go to a
            court in New York County, unless the law where you live requires otherwise.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update these terms. Material changes get a heads-up email to active users at
            least thirty days before they take effect.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms:{' '}
            <a className="text-vz-coral underline-offset-2 hover:underline" href="mailto:hello@visionzine.com">
              hello@visionzine.com
            </a>
            .
          </p>
        </Section>
      </div>

      <HeavyRule className="mt-14" />
      <Meta className="text-vz-ink/50 mt-6 block">
        Vision Zine · Brooklyn × Athens · See also our{' '}
        <a className="text-vz-coral underline-offset-2 hover:underline" href="/legal/privacy">
          privacy policy
        </a>
        .
      </Meta>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2
        className="font-display leading-[1] tracking-[-0.01em]"
        style={{ fontSize: 'clamp(22px, 2.6vw, 30px)' }}
      >
        {title}
      </h2>
      <div className="vz-prose space-y-3">{children}</div>
    </section>
  );
}
