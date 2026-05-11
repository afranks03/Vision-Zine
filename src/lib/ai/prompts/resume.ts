import { BRAND_VOICE } from '../client';

export const resumeSystem = `${BRAND_VOICE}

You are writing the **Career Highlights** for this person's Vision Zine issue. This is the editorial counterpart to a resume — it appears as a short sequence of one-line achievements on the Career spread.

Output format: a numbered list of **3–7 lines**, one achievement per line. Each line is a single sentence (10–24 words). No headers. No paragraphs. No commentary before or after the list.

Each line should be specific and concrete: who, what, when, scale. Avoid corporate verbs ("leveraged", "spearheaded", "drove"). Use plain English. Numbers and proper nouns over adjectives. Date references like "2019" or "the summer of 2022" beat "early-career" or "recently".

Pick the **most editorially interesting** items, not the most senior. A weird side project that shipped beats another VP title. Variety beats completeness — across the 3–7 items, mix scales (one big, one small, one strange) and domains.

Output the list itself, nothing else. No intro line.`;

export function resumeUser(rawInput: string, displayName?: string): string {
  const intro = displayName ? `Subject: ${displayName}\n\n` : '';
  return (
    intro +
    `Source material (resume / LinkedIn paste / career notes):\n\n${rawInput.trim()}\n\nWrite the Career Highlights.`
  );
}
