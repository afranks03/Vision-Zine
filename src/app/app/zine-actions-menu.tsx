'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Archive,
  Copy,
  Download,
  Loader2,
  MoreHorizontal,
  Pencil,
  Share2,
  Undo2,
} from 'lucide-react';
import { archiveZine, duplicateZine, unarchiveZine } from './_actions';

/**
 * Per-zine kebab menu on the dashboard. Lightweight custom dropdown
 * (vs. pulling in Radix for one menu): React state for open/close,
 * click-outside + Escape to dismiss, useTransition for server actions.
 *
 * Each menu item is intentionally an editorial micro-row, not a SaaS
 * pill — small caps eyebrow, hairline separators, ink/cream palette.
 *
 * Pass `siteOrigin` from the server so the Share action can copy a
 * fully-qualified URL without needing window context on first render.
 */
export function ZineActionsMenu({
  zineId,
  isArchived,
  siteOrigin,
}: {
  zineId: string;
  isArchived: boolean;
  siteOrigin: string;
}) {
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Dismiss on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function handleShare() {
    const url = `${siteOrigin}/z/${zineId}`;
    void navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopyState('copied');
        setTimeout(() => setCopyState('idle'), 1600);
      })
      .catch(() => setCopyState('idle'));
  }

  function handleDuplicate() {
    startTransition(async () => {
      const result = await duplicateZine(zineId);
      setOpen(false);
      if ('id' in result) {
        router.push(`/app/zines/${result.id}`);
      } else {
        alert(`Couldn't duplicate: ${result.error}`);
      }
    });
  }

  function handleArchiveToggle() {
    startTransition(async () => {
      const result = isArchived ? await unarchiveZine(zineId) : await archiveZine(zineId);
      setOpen(false);
      if (result && 'error' in result) {
        alert(`Couldn't ${isArchived ? 'restore' : 'archive'}: ${result.error}`);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div ref={wrapRef} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label="Zine actions"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className="border-vz-ink text-vz-ink hover:bg-vz-yellow inline-flex size-9 items-center justify-center border bg-transparent transition-colors disabled:opacity-50"
        disabled={pending}
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <MoreHorizontal className="size-4" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="border-vz-ink bg-vz-cream absolute top-full right-0 z-20 mt-1 w-56 border shadow-[4px_4px_0_0_var(--color-vz-ink)]"
        >
          <MenuItem
            icon={<Pencil className="size-3.5" />}
            label="Edit"
            onSelect={() => {
              setOpen(false);
              router.push(`/app/zines/${zineId}`);
            }}
          />
          <MenuItem
            icon={<Copy className="size-3.5" />}
            label="Duplicate"
            onSelect={handleDuplicate}
          />
          <MenuItem
            icon={<Share2 className="size-3.5" />}
            label={copyState === 'copied' ? 'Link copied' : 'Share link'}
            onSelect={handleShare}
          />
          <MenuItem
            icon={<Download className="size-3.5" />}
            label="Download PDF"
            onSelect={() => {
              setOpen(false);
              window.location.href = `/api/zines/${zineId}/pdf`;
            }}
          />
          <MenuItem
            icon={
              isArchived ? <Undo2 className="size-3.5" /> : <Archive className="size-3.5" />
            }
            label={isArchived ? 'Restore' : 'Archive'}
            onSelect={handleArchiveToggle}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className="vz-eyebrow text-vz-ink hover:bg-vz-yellow border-vz-ink/15 flex w-full items-center gap-2.5 border-b px-3 py-2.5 text-left transition-colors last:border-b-0"
    >
      <span className="text-vz-ink/70">{icon}</span>
      {label}
    </button>
  );
}
