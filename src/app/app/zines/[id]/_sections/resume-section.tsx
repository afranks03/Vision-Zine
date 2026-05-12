'use client';

import type { ResumeContent } from '@/lib/supabase/types';
import { AISectionShell } from './ai-section-shell';

function linesToHighlights(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter((line) => line.length > 0);
}

export function ResumeSection({
  zineId,
  initial,
  displayName,
}: {
  zineId: string;
  initial: Partial<ResumeContent>;
  displayName?: string;
}) {
  return (
    <AISectionShell<'resume'>
      zineId={zineId}
      sectionKey="resume"
      endpoint="/api/ai/extract-resume"
      eyebrow="Section 04"
      title={
        <>
          Career <em>highlights</em>.
        </>
      }
      intro={
        <>
          Paste your resume, a LinkedIn export, or freeform career notes. We&apos;ll pick the 3–7
          most editorially interesting items as one-line highlights for the Career spread.
        </>
      }
      inputLabel="Source material"
      inputPlaceholder="Paste your resume / LinkedIn / career notes. The more raw the better — we'll edit it down."
      outputLabel="Highlights (one per line, edit freely)"
      suggestLabel="Extract highlights"
      initialRawInput={initial.raw_paste ?? ''}
      initialOutput={(initial.highlights ?? []).join('\n')}
      buildContent={({ rawInput, output }) => ({
        raw_paste: rawInput.trim() || undefined,
        highlights: linesToHighlights(output),
      })}
      displayName={displayName}
    />
  );
}
