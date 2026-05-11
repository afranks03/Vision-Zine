'use client';

import { useState } from 'react';
import { Eyebrow } from '@/components/editorial';
import type { GoalsContent } from '@/lib/supabase/types';
import { SectionShell, textareaClass } from './section-shell';

/**
 * Goals — four clusters, free-text per cluster. Each line becomes a goal in
 * the rendered zine's Forecast pages.
 */
const CLUSTERS: { key: keyof GoalsContent; label: string; hint: string }[] = [
  {
    key: 'financial',
    label: 'Financial',
    hint: 'Money, business, runway. Numbers when they help.',
  },
  {
    key: 'creative',
    label: 'Creative',
    hint: 'Work, craft, output. What you want to make this year.',
  },
  {
    key: 'place',
    label: 'Place',
    hint: 'Where you live, where you visit, where you build a base.',
  },
  {
    key: 'body_spirit',
    label: 'Body & Spirit',
    hint: 'Health, practice, devotion. The non-negotiables.',
  },
];

export function GoalsSection({
  zineId,
  initial,
}: {
  zineId: string;
  initial: Partial<GoalsContent>;
}) {
  // Store each cluster as a single \n-separated string in form state for easy editing.
  // Convert to/from string[] when reading initial / collecting.
  const [values, setValues] = useState<Record<keyof GoalsContent, string>>(() => ({
    financial: (initial.financial ?? []).join('\n'),
    creative: (initial.creative ?? []).join('\n'),
    place: (initial.place ?? []).join('\n'),
    body_spirit: (initial.body_spirit ?? []).join('\n'),
  }));

  return (
    <SectionShell
      zineId={zineId}
      sectionKey="goals"
      eyebrow="Section 06"
      title={
        <>
          The <em>Forecast</em>.
        </>
      }
      intro={
        <>
          Goals by domain. One per line. Keep them specific — &ldquo;Finish the second
          draft&rdquo; over &ldquo;Write more.&rdquo;
        </>
      }
      collect={() => ({
        financial: linesOf(values.financial),
        creative: linesOf(values.creative),
        place: linesOf(values.place),
        body_spirit: linesOf(values.body_spirit),
      })}
    >
      <div className="grid gap-7 md:grid-cols-2">
        {CLUSTERS.map((cluster) => (
          <div key={cluster.key} className="flex flex-col gap-3">
            <div className="border-vz-ink flex items-baseline justify-between border-b pb-2">
              <Eyebrow>{cluster.label}</Eyebrow>
              <Eyebrow className="text-vz-coral text-[9px]">
                {linesOf(values[cluster.key]).length} goal{linesOf(values[cluster.key]).length === 1 ? '' : 's'}
              </Eyebrow>
            </div>
            <p className="font-serif text-sm text-vz-ink/70">{cluster.hint}</p>
            <textarea
              value={values[cluster.key]}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [cluster.key]: e.target.value }))
              }
              rows={6}
              placeholder="One goal per line"
              className={textareaClass}
            />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function linesOf(s: string): string[] {
  return s
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
