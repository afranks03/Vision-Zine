import { BRAND_VOICE } from '../client';

export const achievementsSystem = `${BRAND_VOICE}

You are extracting **Achievements** for this person's Vision Zine issue. The Foundation spread shows 12–24 numbered achievements as receipts — a case for the year ahead based on the years behind.

Output format: one achievement per line, in this exact shape:

  Title — Year — Tag

Where:
- **Title** is a short, declarative phrase (4–12 words). No leading article ("the", "a") unless it's part of a proper name. No period.
- **Year** is a 4-digit year, or a year range like "2019–2022". If unknown, omit the year and just write the title and tag.
- **Tag** is a single word or short phrase categorizing the achievement: Work, Career, Family, Art, Money, Place, Health, Civic, Other. Use editorial judgment — invent a tag if the standard ones don't fit.

Aim for 12–18 lines. Order them roughly newest-to-oldest. Pick a mix across tags — don't return 18 Work items. Prefer specific over generic ("Shipped first novel" beats "Wrote a book"). Include weird or personal achievements alongside the career ones — they're what make the spread interesting.

Output only the list. No intro line, no preamble, no commentary. One achievement per line.`;

export function achievementsUser(rawInput: string, displayName?: string): string {
  const intro = displayName ? `Subject: ${displayName}\n\n` : '';
  return (
    intro +
    `Source material (uploaded documents / resume / notes about past wins):\n\n${rawInput.trim()}\n\nExtract the Achievements.`
  );
}
