import type { Metadata } from 'next';
import { Eyebrow, HeavyRule, Meta } from '@/components/editorial';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Vision Zine handles your data.',
};

/**
 * Privacy policy (Phase 5e). Placeholder content in brand voice —
 * the legal substance is correct (covers data we actually collect)
 * but should be reviewed by counsel before launch. The intent is to
 * have a real page at the URL the footer is already pointing at,
 * not a 404.
 */
export default function PrivacyPage() {
  const updated = '2026-05-19';
  return (
    <article className="vz-container vz-section max-w-3xl">
      <Eyebrow className="text-vz-coral">Privacy</Eyebrow>
      <h1
        className="font-display mt-3 leading-[0.95] tracking-[-0.02em]"
        style={{ fontSize: 'clamp(40px, 7vw, 88px)' }}
      >
        Your data, plainly.
      </h1>
      <Meta className="text-vz-ink/60 mt-4 block">Last updated: {updated}</Meta>
      <HeavyRule className="mt-8" />

      <div className="vz-prose mt-10 space-y-7 text-base leading-relaxed">
        <Section title="What we collect">
          <p>
            We collect the data you give us — what you type into the studio (your vision
            statement, achievements, goals, tenets, bio), the photographs you upload, the title and
            style you pick for each issue. We also collect your email address (to sign you in and
            send transactional emails) and your shipping address (only when you order a printed
            copy).
          </p>
          <p>
            We do not track you across other sites. We do not use third-party advertising cookies.
          </p>
        </Section>

        <Section title="Who can see it">
          <p>
            By default, only you can see the contents of your zine. The web edition is private
            until you publish it from the preview screen. Co-authors you invite can write into the
            joint section but cannot see your other sections unless you publish the issue.
          </p>
        </Section>

        <Section title="Who we share data with">
          <p>
            We use a small number of vendors to run the product. Each one sees only what they need:
          </p>
          <ul className="vz-prose mt-2 list-disc space-y-1.5 pl-6">
            <li>
              <strong>Supabase</strong> stores your account, zine content, and uploaded files.
            </li>
            <li>
              <strong>Vercel</strong> hosts the site and runs the rendering / PDF pipeline.
            </li>
            <li>
              <strong>Stripe</strong> processes payments. We never see your full card number — only
              the last four digits on the receipt.
            </li>
            <li>
              <strong>Resend</strong> sends transactional emails (receipts, invitations, the annual
              reminder).
            </li>
            <li>
              <strong>Lulu xPress</strong> prints and ships your copy when you order one. They
              receive the PDF, your shipping address, and your phone number.
            </li>
            <li>
              <strong>Anthropic</strong> powers the AI prompts when you ask the studio to suggest
              copy. Your inputs are sent to Anthropic for that request; we don&rsquo;t store
              copies on Anthropic&rsquo;s servers.
            </li>
          </ul>
        </Section>

        <Section title="How long we keep it">
          <p>
            Your zines stay in your account until you delete them. When you delete a zine, we
            delete its content and any associated files within seven days. When you close your
            account, we remove your data within thirty days, with limited exceptions for legal and
            tax records.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            You can read, export, edit, or delete anything you&rsquo;ve put into Vision Zine at any
            time from your dashboard. If you&rsquo;d like a copy of everything we have on you, or
            you&rsquo;d like us to delete your account entirely, email{' '}
            <a className="text-vz-coral underline-offset-2 hover:underline" href="mailto:hello@visionzine.com">
              hello@visionzine.com
            </a>{' '}
            and we&rsquo;ll take care of it within thirty days.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            We use a small set of essential cookies to keep you signed in and remember your
            preferences. We don&rsquo;t use advertising cookies. We use Plausible for analytics —
            it doesn&rsquo;t use cookies, doesn&rsquo;t collect personal data, and doesn&rsquo;t
            follow you across the web.
          </p>
        </Section>

        <Section title="Children">
          <p>Vision Zine is not for users under 16. Please don&rsquo;t use it if you&rsquo;re under 16.</p>
        </Section>

        <Section title="Changes">
          <p>
            We&rsquo;ll update this page if our practices change. Material changes will be flagged
            on the page and, for active users, emailed in advance.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions, concerns, requests:{' '}
            <a className="text-vz-coral underline-offset-2 hover:underline" href="mailto:hello@visionzine.com">
              hello@visionzine.com
            </a>
            . A real person reads every message.
          </p>
        </Section>
      </div>

      <HeavyRule className="mt-14" />
      <Meta className="text-vz-ink/50 mt-6 block">
        Vision Zine · Brooklyn × Athens · This policy is a plain-language summary, not a legal
        contract. The terms of service are the binding document.
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
