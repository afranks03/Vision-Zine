/**
 * Annual reissue reminder (Phase 5d). Fired by the daily cron when a
 * zine crosses the 365-day mark with no newer issue from the same
 * owner. Brand voice: calm, never urgent, never "exciting!"
 *
 * The CTA lands on /app/zines/[id]/reissue, which duplicates the zine
 * structure + content into a new draft and redirects into the studio.
 */
import { EmailBody, EmailButton, EmailHeadline, EmailLayout, EmailMetaRow } from './_layout';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://vision-zine.vercel.app';

export interface AnnualReminderProps {
  /** Title of the existing zine (last year's issue). */
  zineTitle: string;
  /** Issue number of the existing zine (the "current" issue). */
  currentIssue: number;
  /** Owner's display name. */
  ownerName: string;
  /** Zine id — used to build the reissue link. */
  zineId: string;
  /** Year the previous issue was published (the year it'll display
   *  on the reminder). */
  previousYear: number;
}

const ROMAN_FOR_NEXT: Record<number, string> = {
  1: 'II',
  2: 'III',
  3: 'IV',
  4: 'V',
  5: 'VI',
  6: 'VII',
  7: 'VIII',
  8: 'IX',
  9: 'X',
};

export function AnnualReminderEmail(props: AnnualReminderProps) {
  const nextRoman = ROMAN_FOR_NEXT[props.currentIssue] ?? `${props.currentIssue + 1}`;
  const reissueUrl = `${SITE}/app/zines/${props.zineId}/reissue`;
  return (
    <EmailLayout
      preview={`A year on ${props.zineTitle}. Ready for Issue ${nextRoman}?`}
      eyebrow="Annual reminder"
    >
      <EmailHeadline>
        <em>It&rsquo;s been a year</em> on {props.zineTitle}.
      </EmailHeadline>

      <EmailBody>
        {props.previousYear} closed with your last issue. Same author, new chapter — if you want
        one. Issue {nextRoman} is half-built waiting for you: the templates, the prompts, and last
        year&rsquo;s content as a starting point you can riff on or rewrite.
      </EmailBody>

      <EmailMetaRow
        items={[
          { label: 'Last issue', value: `${props.zineTitle} · No. ${props.currentIssue}` },
          { label: 'Author', value: props.ownerName },
          { label: 'Year', value: String(props.previousYear) },
        ]}
      />

      <EmailButton href={reissueUrl} label={`Start Issue ${nextRoman}`} />

      <EmailBody>
        Or ignore this email. We only send the annual reminder once per issue — you won&rsquo;t
        hear from us again unless you start a new one yourself.
      </EmailBody>
    </EmailLayout>
  );
}
