import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Eyebrow, Meta } from '@/components/editorial';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { CoauthorInvitationRow } from '@/lib/supabase/types';

export const metadata: Metadata = {
  title: 'Co-author invitation',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ token: string }>;
}

/**
 * Accept-invitation page (Phase 5c).
 *
 * Flow:
 *   1. Look up the invitation by token (admin client — bypass RLS so we
 *      can read it even when the recipient isn't signed in yet).
 *   2. If revoked / accepted / expired: show a quiet error message.
 *   3. If not signed in: bounce to /signin?next=/invite/{token} so the
 *      user creates an account first, then returns here.
 *   4. If signed in but email doesn't match the invitation: ask them to
 *      sign out and use the invited address.
 *   5. Mark the invitation accepted (admin client — owners' RLS would
 *      otherwise block the partner from writing here) and redirect into
 *      the studio with section=coauthor.
 */
export default async function InvitePage({ params }: Props) {
  const { token } = await params;

  const admin = createAdminClient();
  const { data: invRaw } = await admin
    .from('coauthor_invitations')
    .select('*')
    .eq('token', token)
    .single();
  const invitation = invRaw as CoauthorInvitationRow | null;

  if (!invitation) {
    return (
      <InviteShell
        title="Invitation not found"
        body="This link doesn’t match an invitation. Ask whoever sent it to resend a fresh one."
      />
    );
  }

  if (invitation.status === 'accepted') {
    return (
      <InviteShell
        title="Already accepted"
        body="You’ve already joined this issue. Open your dashboard to see the zines you’re co-authoring."
        cta={{ href: '/app', label: 'Open dashboard' }}
      />
    );
  }
  if (invitation.status === 'revoked') {
    return (
      <InviteShell
        title="Invitation revoked"
        body="The owner withdrew this invitation. If that was a mistake, ask them to resend."
      />
    );
  }
  if (invitation.status === 'expired') {
    return (
      <InviteShell
        title="Invitation expired"
        body="This invitation lapsed. Ask the owner to send a fresh one."
      />
    );
  }

  // Status is 'pending' from here. Auth gate.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Bounce through /signin — the magic-link callback brings them back.
    redirect(`/signin?next=${encodeURIComponent(`/invite/${token}`)}`);
  }

  if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
    return (
      <InviteShell
        title="Sign in with the invited address"
        body={
          <>
            This invitation was sent to <strong>{invitation.email}</strong>, but you&apos;re signed
            in as <strong>{user.email}</strong>. Sign out and sign back in with the invited
            address.
          </>
        }
        cta={{ href: '/signin', label: 'Sign out & try again' }}
      />
    );
  }

  // Accept. Use admin client because the partner can't yet UPDATE
  // their own row (the invitee-select policy lets them SELECT but
  // the row's update policy is owner-only). After this update, the
  // accepted_by index makes them visible as a coauthor across the
  // other tables via the policies in 20260518120000.
  const { error: acceptErr } = await admin
    .from('coauthor_invitations')
    .update({
      status: 'accepted',
      accepted_by: user.id,
      accepted_at: new Date().toISOString(),
    })
    .eq('id', invitation.id);
  if (acceptErr) {
    return (
      <InviteShell
        title="Couldn’t accept the invitation"
        body={`We hit a snag finalizing your acceptance: ${acceptErr.message}. Please try again or ask the owner to resend.`}
      />
    );
  }

  // Land them in the studio's co-author section.
  redirect(`/app/zines/${invitation.zine_id}?section=coauthor`);
}

function InviteShell({
  title,
  body,
  cta,
}: {
  title: string;
  body: React.ReactNode;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="bg-vz-oat flex min-h-screen items-center justify-center px-6 py-20">
      <div className="border-vz-ink bg-vz-cream w-full max-w-lg border p-10">
        <Eyebrow className="text-vz-coral">Co-author invitation</Eyebrow>
        <h1
          className="font-display mt-3 leading-[1] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
        >
          {title}
        </h1>
        <div className="vz-prose text-vz-ink/80 mt-5 text-base">{body}</div>
        <div className="mt-7 flex items-center gap-4">
          {cta && (
            <Link
              href={cta.href}
              className="vz-eyebrow border-vz-ink bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream border px-4 py-2 transition-colors"
            >
              {cta.label}
            </Link>
          )}
          <Meta className="text-vz-ink/50">
            <Link href="/" className="hover:text-vz-coral transition-colors">
              ← Back to Vision Zine
            </Link>
          </Meta>
        </div>
      </div>
    </div>
  );
}
