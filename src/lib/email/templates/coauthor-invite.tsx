/**
 * Co-author invitation email (Phase 5c). Sent when a zine owner invites
 * a partner to fill out the joint section of their issue. Brand voice:
 * calm, warm, never "exciting!"
 */
import { EmailBody, EmailButton, EmailHeadline, EmailLayout, EmailMetaRow } from './_layout';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://vision-zine.vercel.app';

export interface CoauthorInviteProps {
  /** The zine title, or "Issue I" fallback. */
  zineTitle: string;
  /** Owner's display name (the inviter). */
  inviterName: string;
  /** Invitation token from coauthor_invitations.token. */
  token: string;
}

export function CoauthorInviteEmail(props: CoauthorInviteProps) {
  const acceptUrl = `${SITE}/invite/${props.token}`;
  return (
    <EmailLayout preview={`${props.inviterName} invited you to co-author ${props.zineTitle}.`}
      eyebrow="Invitation"
    >
      <EmailHeadline>
        <em>{props.inviterName}</em> invited you to co-author.
      </EmailHeadline>

      <EmailBody>
        {props.inviterName} is making a Vision Zine — a printable, editorial-quality magazine of
        their year — and would like you to write a section together.
      </EmailBody>

      <EmailMetaRow
        items={[
          { label: 'Issue', value: props.zineTitle },
          { label: 'Invited by', value: props.inviterName },
          { label: 'Your role', value: 'Co-author · joint section' },
        ]}
      />

      <EmailButton href={acceptUrl} label="Accept the invitation" />

      <EmailBody>
        You&rsquo;ll be able to write the joint section in your own words. The rest of the issue
        is theirs — you won&rsquo;t see other sections until {props.inviterName} publishes.
      </EmailBody>

      <EmailBody>
        If you weren&rsquo;t expecting this, you can safely ignore the email. The link expires when
        the invitation is revoked or accepted.
      </EmailBody>
    </EmailLayout>
  );
}
