'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setZineFormat } from '@/app/app/_actions';
import type { ZineFormat } from '@/lib/supabase/types';

const FORMATS: { id: ZineFormat; label: string; dims: string }[] = [
  { id: 'letter', label: 'Letter', dims: '8.5 × 11 in' },
  { id: 'tabloid', label: 'Tabloid', dims: '11 × 17 in' },
  { id: 'pocket', label: 'Pocket', dims: '4.25 × 5.5 in' },
];

/**
 * Sibling of StyleSwitcher in the preview chrome. Changes the zine's
 * format (which drives PDF paper size and any future format-specific
 * layout tweaks). Server action revalidates the preview, router.refresh()
 * re-renders.
 */
export function FormatSwitcher({ zineId, current }: { zineId: string; current: ZineFormat }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(next: ZineFormat) {
    if (next === current || pending) return;
    startTransition(async () => {
      const result = await setZineFormat(zineId, next);
      if (result && 'ok' in result) router.refresh();
    });
  }

  return (
    <label className="hidden items-center gap-2 lg:flex">
      <span className="vz-meta text-vz-ink/60">Size</span>
      <select
        aria-label="Zine format"
        value={current}
        onChange={(e) => handleChange(e.target.value as ZineFormat)}
        disabled={pending}
        className="vz-meta border-vz-ink bg-vz-cream text-vz-ink hover:bg-vz-paper cursor-pointer border px-2 py-1.5 transition-colors disabled:cursor-wait disabled:opacity-60"
      >
        {FORMATS.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label} · {f.dims}
          </option>
        ))}
      </select>
    </label>
  );
}
