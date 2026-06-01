import { BRAND_VOICE } from '../client';

/**
 * Sharpen-my-Vision (Phase 7c). Reads the user's six Practice fields
 * (Gratitude / Forgiveness / Grounding / Spirituality / Environment /
 * Friend Circle) PLUS their current Vision draft, and proposes a
 * refined Vision that's truer to what they've reflected on.
 *
 * The tone is "good editor sharpening an essay," not "fortune cookie
 * writing the user's life for them."
 */
export const refineVisionSystem = `${BRAND_VOICE}

You are the **editor** sharpening this person's Vision Statement for their issue of Vision Zine. They have already written reflections in their Practice section — six short fields of inward and outward reckoning — and they have written (or attempted to write) a Vision Statement. Your job is to propose a revised Vision Statement that is truer to the Practice reflections and to the person's own voice.

Length: 120–220 words. Two to four short paragraphs.

Discipline:
- Preserve the author's voice and their specific subjects. Do not introduce people, places, or claims that aren't in their inputs.
- Pull the strongest threads from the Practice reflections into the Vision — what they're carrying forward (Gratitude), what they're releasing (Forgiveness), what they orient toward (Spirituality), the surround that shapes them (Environment / Friend Circle).
- The first sentence should land like the headline of a magazine feature — declarative, specific, alive. Avoid abstractions like "growth", "balance", "potential". Replace them with concrete subjects: a piece of work, a place, a person, a number.
- If their current Vision is empty or thin, write one from scratch off the Practice fields. If their current Vision is substantial, sharpen it rather than rewriting it from zero — same backbone, tighter prose, more honest specifics.
- Do not preface or apologize. Return ONLY the revised Vision Statement, no headers, no markdown, no "Here's a revised version:".`;

interface RefineVisionInput {
  currentVision?: string;
  gratitude?: string;
  forgiveness?: string;
  grounding?: string;
  spirituality?: string;
  environment?: string;
  friend_circle?: string;
  displayName?: string;
}

/**
 * Build the user prompt as a structured dossier the model can pattern
 * against. Each section gets a labeled block so the model knows
 * what came from which prompt.
 */
export function refineVisionUser(input: RefineVisionInput): string {
  const blocks: string[] = [];

  if (input.displayName) {
    blocks.push(`Author: ${input.displayName}`);
  }

  const fields: { label: string; value?: string }[] = [
    { label: 'Gratitude (what they’re carrying forward)', value: input.gratitude },
    { label: 'Forgiveness (what they’re releasing)', value: input.forgiveness },
    { label: 'Grounding (what holds them when the year gets hard)', value: input.grounding },
    { label: 'Spirituality (what they orient toward)', value: input.spirituality },
    { label: 'Environment (what surrounds them)', value: input.environment },
    { label: 'Friend Circle (the people around them)', value: input.friend_circle },
  ];

  blocks.push('---');
  blocks.push('## The Practice');
  for (const f of fields) {
    if (f.value?.trim()) {
      blocks.push(`### ${f.label}\n${f.value.trim()}`);
    }
  }

  const trimmedCurrent = input.currentVision?.trim();
  blocks.push('---');
  if (trimmedCurrent) {
    blocks.push(`## Current Vision Statement (draft to sharpen)\n${trimmedCurrent}`);
  } else {
    blocks.push(
      '## Current Vision Statement\n(empty — write a new Vision Statement from the Practice fields above)',
    );
  }

  blocks.push('---');
  blocks.push(
    'Return ONLY the revised Vision Statement (120–220 words, 2–4 short paragraphs). No headers, no markdown.',
  );

  return blocks.join('\n\n');
}
