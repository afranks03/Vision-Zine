'use client';

import type { VisionContent } from '@/lib/supabase/types';
import { AISectionShell } from './ai-section-shell';

export function VisionSection({
  zineId,
  initial,
  displayName,
}: {
  zineId: string;
  initial: Partial<VisionContent>;
  displayName?: string;
}) {
  return (
    <AISectionShell<'vision'>
      zineId={zineId}
      sectionKey="vision"
      endpoint="/api/ai/suggest-vision"
      eyebrow="Section 02"
      title={
        <>
          The <em>Vision</em>.
        </>
      }
      intro={
        <>
          A first-person manifesto for the year ahead. Tell us what you&apos;re becoming, what
          you&apos;re building, what you refuse to do — in plain notes. We&apos;ll compose the
          spread.
        </>
      }
      inputLabel="Your notes (anything — bullets, fragments, half-sentences)"
      inputPlaceholder="What does the next year look like? What are you done with? What will you be holding in your hands twelve months from now?"
      outputLabel="Vision statement (edit before saving)"
      suggestLabel="Sharpen into a statement"
      initialOutput={initial.statement ?? ''}
      buildContent={({ output }) => ({ statement: output.trim() })}
      displayName={displayName}
    />
  );
}
