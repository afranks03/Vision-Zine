'use client';

import { useState } from 'react';
import { Eyebrow, HairlineRule } from '@/components/editorial';
import type { TenetsContent } from '@/lib/supabase/types';
import { SectionShell, textareaClass } from './section-shell';

/**
 * Tenets / Daily Code — ten short statements you read first and last thing.
 * UI: 10 numbered slots. User fills as many as they want; 10 is the ideal.
 */
export function TenetsSection({
  zineId,
  initial,
}: {
  zineId: string;
  initial: Partial<TenetsContent>;
}) {
  // 10 slots. Padded with empty strings.
  const [tenets, setTenets] = useState<string[]>(() => {
    const seed = initial.tenets ?? [];
    const padded = [...seed];
    while (padded.length < 10) padded.push('');
    return padded.slice(0, 10);
  });

  function updateAt(i: number, val: string) {
    setTenets((prev) => prev.map((t, idx) => (idx === i ? val : t)));
  }

  const filledCount = tenets.filter((t) => t.trim().length > 0).length;

  return (
    <SectionShell
      zineId={zineId}
      sectionKey="tenets"
      eyebrow="Section 07"
      title={
        <>
          The <em>Daily Code</em>.
        </>
      }
      intro={
        <>
          Ten tenets you can read first thing and last thing. Short, declarative, in the
          first person if you can manage it. (Fewer than ten is fine — the printed page
          shows only filled ones.)
        </>
      }
      collect={() => ({
        tenets: tenets.map((t) => t.trim()).filter((t) => t.length > 0),
      })}
    >
      <div className="flex items-baseline justify-between">
        <Eyebrow>Tenets</Eyebrow>
        <Eyebrow className="text-vz-coral">
          {filledCount} of 10 filled
        </Eyebrow>
      </div>
      <HairlineRule />
      <ol className="grid gap-3 md:grid-cols-2">
        {tenets.map((value, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="font-display text-2xl leading-[0.9] w-7 pt-1 shrink-0">
              {(i + 1).toString().padStart(2, '0')}
            </span>
            <textarea
              value={value}
              onChange={(e) => updateAt(i, e.target.value)}
              rows={2}
              placeholder={`Tenet ${i + 1}`}
              className={`${textareaClass} min-h-0 flex-1`}
            />
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
