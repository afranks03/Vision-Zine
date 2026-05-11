'use client';

import type { AchievementsContent } from '@/lib/supabase/types';
import { AISectionShell } from './ai-section-shell';

interface AchievementItem {
  title: string;
  year?: number;
  tag?: string;
}

/**
 * Parse the AI output back into structured AchievementItems.
 * Expected line shape: "Title — Year — Tag" with em-dash or hyphen separators.
 */
function parseAchievements(text: string): AchievementItem[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      // Split on em-dash, en-dash, or " - " (hyphen surrounded by spaces).
      const parts = line.split(/\s+[—–-]\s+/).map((p) => p.trim());
      const title = parts[0] ?? line;
      let year: number | undefined;
      let tag: string | undefined;
      for (const part of parts.slice(1)) {
        const yearMatch = part.match(/^(\d{4})(?:[–-]\d{4})?$/);
        if (yearMatch && !year) {
          year = Number(yearMatch[1]);
        } else if (!tag) {
          tag = part;
        }
      }
      return { title, year, tag };
    });
}

function itemsToText(items: AchievementItem[]): string {
  return items
    .map((item) => {
      const parts = [item.title];
      if (item.year) parts.push(String(item.year));
      if (item.tag) parts.push(item.tag);
      return parts.join(' — ');
    })
    .join('\n');
}

export function AchievementsSection({
  zineId,
  initial,
  displayName,
}: {
  zineId: string;
  initial: Partial<AchievementsContent>;
  displayName?: string;
}) {
  return (
    <AISectionShell<'achievements'>
      zineId={zineId}
      sectionKey="achievements"
      endpoint="/api/ai/extract-achievements"
      eyebrow="Section 05"
      title={
        <>
          The <em>Foundation</em>.
        </>
      }
      intro={
        <>
          12 to 24 achievements — the receipts for the year ahead. Paste anything:
          past resumes, year-end reviews, journal entries. We&apos;ll extract them
          in <code className="font-mono text-sm">Title — Year — Tag</code> format,
          one per line. You can edit before saving.
        </>
      }
      inputLabel="Source material"
      inputPlaceholder="Paste documents, notes, or a freeform list of wins from past years."
      outputLabel="Achievements (one per line: Title — Year — Tag)"
      suggestLabel="Extract achievements"
      initialOutput={itemsToText(initial.items ?? [])}
      buildContent={({ output }) => ({
        items: parseAchievements(output),
      })}
      displayName={displayName}
    />
  );
}
