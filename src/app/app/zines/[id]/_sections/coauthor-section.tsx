'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  inviteCoauthor,
  resendCoauthorInvite,
  revokeCoauthorInvite,
  saveSection,
} from '@/app/app/_actions';
import { Eyebrow, StatusPill } from '@/components/editorial';
import type { CoauthorContent, CoauthorInvitationRow } from '@/lib/supabase/types';

/**
 * Co-author section (Phase 5c). Two surfaces in one component:
 *
 *   - Owner view: invite form + invitation list + joint-notes editor.
 *   - Co-author view: just the joint-notes editor + partner display
 *     name field (no invite controls, no other zine sections).
 *
 * The parent (page.tsx) tells us which is which via `isOwner`. RLS
 * already enforces the constraint at the DB layer; this prop is for
 * showing the right UI shape.
 */
export function CoauthorSection({
  zineId,
  initial,
  invitations,
  isOwner,
}: {
  zineId: string;
  initial: Partial<CoauthorContent>;
  invitations: CoauthorInvitationRow[];
  isOwner: boolean;
}) {
  return (
    <div className="space-y-10">
      <div className="border-vz-ink border-b pb-4">
        <Eyebrow>Section · Co-author</Eyebrow>
        <h2 className="font-display mt-1 text-3xl leading-[0.95]">The joint section</h2>
        <p className="vz-prose text-vz-ink/70 mt-2 max-w-prose text-sm">
          {isOwner
            ? 'Invite a partner to write the joint section together. Anything they write here lands on the page alongside your editor’s letter. They won’t see your other sections.'
            : 'You’ve been invited to co-author this issue. The joint section below appears in the magazine alongside the owner’s editor’s letter — keep it short, honest, in your own voice.'}
        </p>
      </div>

      {isOwner && <InviteBlock zineId={zineId} invitations={invitations} />}

      <JointNotes zineId={zineId} initial={initial} />
    </div>
  );
}

/* -------------------- Invite block (owner only) -------------------- */

function InviteBlock({
  zineId,
  invitations,
}: {
  zineId: string;
  invitations: CoauthorInvitationRow[];
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSent(null);
    const value = email.trim();
    if (!value) return;
    startTransition(async () => {
      const result = await inviteCoauthor(zineId, value);
      if ('error' in result) {
        setError(result.error);
      } else {
        setSent(value);
        setEmail('');
        router.refresh();
      }
    });
  }

  return (
    <section className="space-y-5">
      <Eyebrow className="text-vz-ink">Invite a co-author</Eyebrow>
      <form
        onSubmit={handleInvite}
        className="border-vz-ink bg-vz-cream flex flex-col gap-3 border px-4 py-4 sm:flex-row sm:items-center"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="partner@example.com"
          disabled={pending}
          className="vz-prose flex-1 bg-transparent px-1 py-2 text-base focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={pending}
          className="vz-eyebrow border-vz-ink bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream border px-4 py-2 transition-colors disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? 'Sending…' : 'Send invitation'}
        </button>
      </form>
      {error && (
        <p className="vz-meta text-vz-coral">{error}</p>
      )}
      {sent && (
        <p className="vz-meta text-vz-ink/70">
          Invitation sent to <strong>{sent}</strong>. They’ll receive an email shortly.
        </p>
      )}

      {invitations.length > 0 && (
        <ul className="border-vz-ink border-t">
          {invitations.map((inv) => (
            <InvitationRow key={inv.id} invitation={inv} />
          ))}
        </ul>
      )}
    </section>
  );
}

function InvitationRow({ invitation }: { invitation: CoauthorInvitationRow }) {
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const router = useRouter();

  function handleRevoke() {
    if (!confirm(`Revoke invitation to ${invitation.email}?`)) return;
    startTransition(async () => {
      const result = await revokeCoauthorInvite(invitation.id);
      if (result && 'error' in result) {
        setActionError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleResend() {
    startTransition(async () => {
      const result = await resendCoauthorInvite(invitation.id);
      if (result && 'error' in result) {
        setActionError(result.error);
      } else {
        setActionError('Resent.');
        setTimeout(() => setActionError(null), 1800);
      }
    });
  }

  const statusTone =
    invitation.status === 'accepted'
      ? 'success'
      : invitation.status === 'pending'
        ? 'paid'
        : 'muted';
  const statusLabel = invitation.status[0]!.toUpperCase() + invitation.status.slice(1);
  const sent = new Date(invitation.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <li className="border-vz-ink flex flex-col gap-2 border-b py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col">
        <span className="font-serif text-base">{invitation.email}</span>
        <span className="vz-meta text-vz-ink/55">Invited {sent}</span>
      </div>
      <div className="flex items-center gap-3">
        <StatusPill tone={statusTone}>{statusLabel}</StatusPill>
        {invitation.status === 'pending' && (
          <>
            <button
              type="button"
              onClick={handleResend}
              disabled={pending}
              className="vz-eyebrow text-vz-ink hover:text-vz-coral disabled:opacity-50"
            >
              Resend
            </button>
            <button
              type="button"
              onClick={handleRevoke}
              disabled={pending}
              className="vz-eyebrow text-vz-coral hover:text-vz-ink disabled:opacity-50"
            >
              Revoke
            </button>
          </>
        )}
      </div>
      {actionError && <span className="vz-meta text-vz-coral sm:ml-3">{actionError}</span>}
    </li>
  );
}

/* -------------------- Joint notes (both views) -------------------- */

function JointNotes({
  zineId,
  initial,
}: {
  zineId: string;
  initial: Partial<CoauthorContent>;
}) {
  const [partnerName, setPartnerName] = useState(initial.partner_display_name ?? '');
  const [jointNotes, setJointNotes] = useState(initial.joint_notes ?? '');
  const [saved, setSaved] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [, startTransition] = useTransition();

  function commit() {
    setSaved('saving');
    startTransition(async () => {
      const result = await saveSection({
        zineId,
        sectionKey: 'coauthor',
        contentJson: {
          partner_display_name: partnerName.trim() || undefined,
          joint_notes: jointNotes.trim() || undefined,
        } as Record<string, unknown>,
      });
      if (result && 'error' in result) {
        setSaved('idle');
        alert(`Couldn’t save: ${result.error}`);
      } else {
        setSaved('saved');
        setTimeout(() => setSaved('idle'), 1600);
      }
    });
  }

  return (
    <section className="space-y-6">
      <Eyebrow className="text-vz-ink">Joint section</Eyebrow>

      <div>
        <label className="vz-eyebrow text-vz-ink mb-2 block" htmlFor="partner-name">
          Partner display name
        </label>
        <input
          id="partner-name"
          type="text"
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          onBlur={commit}
          placeholder="The name to appear in print"
          className="border-vz-ink bg-vz-cream font-serif w-full border px-4 py-3 text-base focus:outline-none"
        />
      </div>

      <div>
        <label className="vz-eyebrow text-vz-ink mb-2 block" htmlFor="joint-notes">
          Joint notes
        </label>
        <textarea
          id="joint-notes"
          value={jointNotes}
          onChange={(e) => setJointNotes(e.target.value)}
          onBlur={commit}
          rows={10}
          placeholder="A few paragraphs about the joint venture, in your own voice."
          className="border-vz-ink bg-vz-cream font-serif w-full border px-4 py-3 text-base leading-relaxed focus:outline-none"
        />
        <p className="vz-meta text-vz-ink/50 mt-2">
          Saves on blur. Appears in the magazine&apos;s Co-author section.{' '}
          {saved === 'saving' && <span className="text-vz-coral">Saving…</span>}
          {saved === 'saved' && <span className="text-vz-coral">Saved.</span>}
        </p>
      </div>
    </section>
  );
}
