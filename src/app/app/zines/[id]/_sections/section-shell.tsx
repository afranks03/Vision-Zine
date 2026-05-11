'use client';

import { type ReactNode, useState, useTransition } from 'react';
import { saveSection } from '@/app/app/_actions';
import { Eyebrow, HairlineRule } from '@/components/editorial';
import type { SectionContent, SectionKey } from '@/lib/supabase/types';

/**
 * Shared shell every non-AI section uses: title, eyebrow, save state,
 * children render the actual fields. Saves via the `saveSection` server
 * action, which upserts into zine_data.
 */
export function SectionShell<K extends SectionKey>({
  zineId,
  sectionKey,
  title,
  eyebrow,
  intro,
  collect,
  children,
}: {
  zineId: string;
  sectionKey: K;
  title: ReactNode;
  eyebrow: string;
  intro?: ReactNode;
  /** Read current form values out of refs/state and return the JSON payload. */
  collect: () => SectionContent<K>;
  children: ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const payload = collect();
      const result = await saveSection({
        zineId,
        sectionKey,
        contentJson: payload as Record<string, unknown>,
      });
      if (result && 'error' in result && result.error) {
        setMessage({ kind: 'error', text: result.error });
      } else {
        setMessage({ kind: 'ok', text: 'Saved.' });
      }
    });
  }

  return (
    <form action={handleSave} className="flex flex-col gap-6">
      <header>
        <Eyebrow className="text-vz-coral">{eyebrow}</Eyebrow>
        <h2 className="font-display mt-2 text-4xl leading-[0.95] tracking-[-0.02em]">{title}</h2>
        {intro && <p className="vz-prose mt-3 text-base">{intro}</p>}
      </header>
      <HairlineRule />
      <div className="flex flex-col gap-5">{children}</div>
      <HairlineRule className="mt-2" />
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream cursor-pointer px-4 py-3 transition-colors disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save section'}
        </button>
        {message && (
          <span
            className={`font-serif text-sm ${
              message.kind === 'ok' ? 'text-vz-green' : 'text-vz-coral'
            }`}
          >
            {message.text}
          </span>
        )}
      </div>
    </form>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="vz-meta text-vz-ink">{label}</span>
      {hint && <span className="text-vz-ink/70 font-serif text-sm">{hint}</span>}
      {children}
    </label>
  );
}

export const inputClass =
  'border-vz-ink bg-vz-cream text-vz-ink placeholder:text-vz-ink/40 focus:border-vz-coral border-2 px-3 py-2.5 font-serif text-base transition-colors outline-none';

export const textareaClass =
  'border-vz-ink bg-vz-cream text-vz-ink placeholder:text-vz-ink/40 focus:border-vz-coral border-2 px-3 py-2.5 font-serif text-base leading-relaxed transition-colors outline-none min-h-[80px]';
