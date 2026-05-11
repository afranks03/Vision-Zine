import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BulletDot, Eyebrow, HairlineRule, Meta } from '@/components/editorial';
import { createClient } from '@/lib/supabase/server';
import type { SectionContent, SectionKey, ZineDataRow, ZineRow } from '@/lib/supabase/types';
import { AchievementsSection } from './_sections/achievements-section';
import { BioSection } from './_sections/bio-section';
import { GoalsSection } from './_sections/goals-section';
import { PersonalSection } from './_sections/personal-section';
import { ResumeSection } from './_sections/resume-section';
import { SectionPlaceholder } from './_sections/section-placeholder';
import { TenetsSection } from './_sections/tenets-section';
import { VisionSection } from './_sections/vision-section';

export const metadata: Metadata = {
  title: 'Studio',
};

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ section?: string }>;
}

/**
 * Section index — the order they appear in the left rail and the canonical
 * label/copy for each. Marked AI = needs Phase 2b integration.
 */
const SECTIONS: { key: SectionKey; label: string; ai: boolean }[] = [
  { key: 'personal', label: 'Personal', ai: false },
  { key: 'vision', label: 'Vision Statement', ai: true },
  { key: 'bio', label: 'Bio', ai: true },
  { key: 'resume', label: 'Resume / Career', ai: true },
  { key: 'achievements', label: 'Achievements', ai: true },
  { key: 'goals', label: 'Goals', ai: false },
  { key: 'tenets', label: 'Daily Code', ai: false },
  { key: 'online', label: 'Online Presence', ai: false },
  { key: 'documents', label: 'Documents', ai: false },
  { key: 'coauthor', label: 'Co-author', ai: false },
];

function isSectionKey(s: string | undefined): s is SectionKey {
  return !!s && SECTIONS.some((sec) => sec.key === s);
}

export default async function StudioPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const sectionKey: SectionKey = isSectionKey(sp.section) ? sp.section : 'personal';

  const supabase = await createClient();

  // Load zine + all sections in parallel.
  const [zineRes, sectionsRes] = await Promise.all([
    supabase.from('zines').select('*').eq('id', id).single(),
    supabase.from('zine_data').select('*').eq('zine_id', id),
  ]);

  if (zineRes.error || !zineRes.data) {
    notFound();
  }

  const zine = zineRes.data as ZineRow;
  const sections = (sectionsRes.data ?? []) as ZineDataRow[];
  const sectionMap = new Map(sections.map((s) => [s.section_key, s.content_json]));

  function contentFor<K extends SectionKey>(key: K): Partial<SectionContent<K>> {
    return (sectionMap.get(key) ?? {}) as Partial<SectionContent<K>>;
  }

  return (
    <div className="vz-container py-7">
      {/* Studio header */}
      <div className="border-vz-ink flex flex-wrap items-end justify-between gap-4 border-b pb-5">
        <div>
          <Meta className="flex items-center gap-2.5">
            <Link href="/app" className="hover:text-vz-coral transition-colors">
              Dashboard
            </Link>
            <BulletDot />
            <span>Studio</span>
            <BulletDot />
            <span>{labelStyle(zine.style)}</span>
            <BulletDot />
            <span>{labelFormat(zine.format)}</span>
          </Meta>
          <h1
            className="font-display mt-2 leading-[0.95] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            {zine.title || `Issue ${romanize(zine.issue_number)}`}
          </h1>
        </div>
        <Eyebrow className="text-vz-coral">Draft · autosaved</Eyebrow>
      </div>

      {/* Two-column layout: section rail + editor */}
      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
        {/* Left rail */}
        <aside>
          <Eyebrow className="mb-3">Sections</Eyebrow>
          <ol className="border-vz-ink border-t">
            {SECTIONS.map((sec, i) => {
              const isActive = sec.key === sectionKey;
              const isFilled = sectionMap.has(sec.key);
              return (
                <li key={sec.key} className="border-vz-ink border-b">
                  <Link
                    href={`/app/zines/${id}?section=${sec.key}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 px-1 py-3 transition-colors ${
                      isActive ? 'bg-vz-yellow text-vz-ink' : 'hover:bg-vz-cream'
                    }`}
                  >
                    <span className="font-display w-7 text-xl leading-none">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-serif text-sm">{sec.label}</span>
                    {sec.ai && <Eyebrow className="text-vz-coral text-[9px]">AI</Eyebrow>}
                    {isFilled && (
                      <span aria-hidden className="text-vz-coral text-xs">
                        ✓
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
          <HairlineRule className="my-6" />
          <Eyebrow className="text-vz-ink/60">
            {sectionMap.size} of {SECTIONS.length} sections started
          </Eyebrow>
        </aside>

        {/* Editor */}
        <section className="bg-vz-paper border-vz-ink min-h-[480px] border p-8">
          {renderSection(zine.id, sectionKey, contentFor, displayNameFromPersonal(contentFor))}
        </section>
      </div>
    </div>
  );
}

function renderSection(
  zineId: string,
  key: SectionKey,
  contentFor: <K extends SectionKey>(k: K) => Partial<SectionContent<K>>,
  displayName: string | undefined,
) {
  switch (key) {
    case 'personal':
      return <PersonalSection zineId={zineId} initial={contentFor('personal')} />;
    case 'goals':
      return <GoalsSection zineId={zineId} initial={contentFor('goals')} />;
    case 'tenets':
      return <TenetsSection zineId={zineId} initial={contentFor('tenets')} />;
    case 'vision':
      return (
        <VisionSection
          zineId={zineId}
          initial={contentFor('vision')}
          displayName={displayName}
        />
      );
    case 'bio':
      return (
        <BioSection
          zineId={zineId}
          initial={contentFor('bio')}
          displayName={displayName}
        />
      );
    case 'resume':
      return (
        <ResumeSection
          zineId={zineId}
          initial={contentFor('resume')}
          displayName={displayName}
        />
      );
    case 'achievements':
      return (
        <AchievementsSection
          zineId={zineId}
          initial={contentFor('achievements')}
          displayName={displayName}
        />
      );
    case 'online':
      return (
        <SectionPlaceholder
          title="Online Presence"
          reason="Coming in Phase 2c (URL metadata fetching)"
        />
      );
    case 'documents':
      return (
        <SectionPlaceholder
          title="Documents"
          reason="Coming in Phase 2c (Supabase Storage uploads)"
        />
      );
    case 'coauthor':
      return <SectionPlaceholder title="Co-author" reason="Coming in Phase 2d (invitation flow)" />;
  }
}

/** Pull a friendly display name out of the Personal section, if filled. */
function displayNameFromPersonal(
  contentFor: <K extends SectionKey>(k: K) => Partial<SectionContent<K>>,
): string | undefined {
  const personal = contentFor('personal');
  return personal.display_name || personal.full_name || undefined;
}

// ---- helpers ----

function romanize(n: number): string {
  const map: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let out = '';
  let remaining = n;
  for (const [value, numeral] of map) {
    while (remaining >= value) {
      out += numeral;
      remaining -= value;
    }
  }
  return out || 'I';
}

function labelStyle(s: string) {
  return (
    (
      {
        editorial: 'Editorial',
        lifestyle: 'Lifestyle',
        fashion: 'Fashion',
        art_catalog: 'Art Catalog',
        travel: 'Travel',
        financial: 'Financial',
      } as Record<string, string>
    )[s] ?? s
  );
}

function labelFormat(f: string) {
  return (
    ({ letter: 'Letter', tabloid: 'Tabloid', pocket: 'Pocket' } as Record<string, string>)[f] ?? f
  );
}
