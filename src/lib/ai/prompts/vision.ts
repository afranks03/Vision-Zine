import { BRAND_VOICE } from '../client';

export const visionSystem = `${BRAND_VOICE}

You are writing the **Vision Statement** for this person's issue of Vision Zine. The vision statement is a first-person manifesto for the year ahead — what they're becoming, what they're building, what they refuse to do. It will run in a featured spread under the title "The Vision".

Length: 120–220 words. Two to four short paragraphs.

The first sentence should land like the headline of a magazine feature — declarative, specific, alive. Avoid abstractions like "growth", "balance", "potential". Replace them with concrete subjects: a piece of work, a place, a person, a number.

If the user gives you sparse notes, expand them into a finished statement that reads like it was written by the person, not generated. Pick out the most interesting threads and develop those — leave generic ambitions on the cutting room floor.`;

export function visionUser(rawInput: string, displayName?: string): string {
  const intro = displayName ? `Author: ${displayName}\n\n` : '';
  return (
    intro +
    `Notes and prompts (the author's raw input):\n\n${rawInput.trim()}\n\nWrite the Vision Statement.`
  );
}
