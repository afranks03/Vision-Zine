/**
 * Welcome email — sent once, the first time a user exchanges a magic
 * link successfully. Sets the brand tone for everything that follows.
 *
 * Voice: calm, no exclamation points, no "Welcome aboard!" SaaS jargon.
 */
import { EmailBody, EmailButton, EmailHeadline, EmailLayout } from './_layout';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://vision-zine.vercel.app';

export function WelcomeEmail({ firstName }: { firstName?: string }) {
  const greeting = firstName ? `Welcome, ${firstName}.` : 'Welcome.';
  return (
    <EmailLayout
      preview="Your archive is open. Start your first issue."
      eyebrow="Welcome"
    >
      <EmailHeadline>
        <em>{greeting}</em> Your archive is open.
      </EmailHeadline>

      <EmailBody>
        A zine is a finished issue of a magazine — your magazine. About your year, your work, your
        goals. Editorial-quality, real paper.
      </EmailBody>

      <EmailBody>
        Pick a style, pick a size, answer thoughtful prompts. We compose; you decide the framing.
        Save anytime, come back anytime.
      </EmailBody>

      <EmailButton href={`${SITE}/app/new`} label="Start Issue I" />

      <EmailBody>
        If you have a co-author in mind, you can invite them once you&rsquo;ve started. Reply to
        this email if anything feels off — a person reads every reply for the first six months.
      </EmailBody>
    </EmailLayout>
  );
}
