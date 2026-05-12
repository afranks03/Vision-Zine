'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setZineStyle } from '@/app/app/_actions';
import { STYLE_LABELS } from '@/components/zine/styles';
import type { ZineStyle } from '@/lib/supabase/types';

const ORDER: ZineStyle[] = [
  'editorial',
  'lifestyle',
  'fashion',
  'art_catalog',
  'travel',
  'financial',
];

/**
 * Style switcher in the preview chrome. Submits the new style via a server
 * action, then router.refresh() to re-fetch the zine + re-render. The
 * preview page is a Server Component so revalidatePath in the action is
 * what makes the new style appear.
 */
export function StyleSwitcher({
  zineId,
  current,
}: {
  zineId: string;
  current: ZineStyle;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(next: ZineStyle) {
    if (next === current || pending) return;
    startTransition(async () => {
      const result = await setZineStyle(zineId, next);
      if (result && 'ok' in result) {
        router.refresh();
      }
    });
  }

  return (
    <label className="hidden items-center gap-2 lg:flex">
      <span className="vz-meta text-vz-ink/60">Style</span>
      <select
        aria-label="Zine style"
        value={current}
        onChange={(e) => handleChange(e.target.value as ZineStyle)}
        disabled={pending}
        className="vz-meta border-vz-ink bg-vz-cream text-vz-ink hover:bg-vz-paper cursor-pointer border px-2 py-1.5 transition-colors disabled:cursor-wait disabled:opacity-60"
      >
        {ORDER.map((style) => (
          <option key={style} value={style}>
            {STYLE_LABELS[style]}
          </option>
        ))}
      </select>
    </label>
  );
}
