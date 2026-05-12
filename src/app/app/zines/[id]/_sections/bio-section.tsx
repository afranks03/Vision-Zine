'use client';

import type { BioContent } from '@/lib/supabase/types';
import { AISectionShell } from './ai-section-shell';

export function BioSection({
  zineId,
  initial,
  displayName,
}: {
  zineId: string;
  initial: Partial<BioContent>;
  displayName?: string;
}) {
  return (
    <AISectionShell<'bio'>
      zineId={zineId}
      sectionKey="bio"
      endpoint="/api/ai/summarize-bio"
      eyebrow="Section 03"
      title={
        <>
          The <em>Bio</em>.
        </>
      }
      intro={
        <>
          Paste an existing bio, a LinkedIn summary, or notes about yourself. We&apos;ll distill it
          into a short editorial bio for the colophon.
        </>
      }
      inputLabel="Source material"
      inputPlaceholder="Paste your existing bio, a LinkedIn paste, or some notes about yourself."
      outputLabel="Bio (edit before saving)"
      suggestLabel="Summarize"
      initialRawInput={initial.raw_paste ?? ''}
      initialOutput={initial.summary ?? ''}
      buildContent={({ rawInput, output }) => ({
        raw_paste: rawInput.trim() || undefined,
        summary: output.trim(),
      })}
      displayName={displayName}
    />
  );
}
