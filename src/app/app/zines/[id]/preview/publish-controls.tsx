'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setZinePublished } from '@/app/app/_actions';

/**
 * Two-button cluster in the preview chrome: a Publish/Unpublish toggle
 * and (when published) a Share button that copies the public URL.
 */
export function PublishControls({
  zineId,
  initialPublished,
}: {
  zineId: string;
  initialPublished: boolean;
}) {
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const router = useRouter();

  function handleToggle() {
    setError(null);
    const next = !isPublished;
    startTransition(async () => {
      const result = await setZinePublished(zineId, next);
      if (result && 'error' in result && result.error) {
        setError(result.error);
        return;
      }
      setIsPublished(next);
      router.refresh();
    });
  }

  async function handleShare() {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/z/${zineId}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 1800);
    } catch {
      // Fallback — open in a new tab so user can copy manually.
      window.open(url, '_blank');
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        className={`vz-eyebrow cursor-pointer px-3 py-2 transition-colors disabled:cursor-wait ${
          isPublished
            ? 'border-vz-ink text-vz-ink hover:bg-vz-ink hover:text-vz-yellow border'
            : 'bg-vz-coral text-vz-cream hover:bg-vz-ink hover:text-vz-yellow'
        }`}
        title={
          isPublished
            ? 'Make this zine private again — the public URL will stop working.'
            : 'Publish this zine to a shareable public URL.'
        }
      >
        {pending ? '…' : isPublished ? 'Unpublish' : 'Publish to web'}
      </button>
      {isPublished && (
        <button
          type="button"
          onClick={handleShare}
          className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream cursor-pointer px-3 py-2 transition-colors"
        >
          {shareState === 'copied' ? 'Link copied ✓' : 'Copy link'}
        </button>
      )}
      {error && <span className="text-vz-coral font-serif text-xs">{error}</span>}
    </div>
  );
}
