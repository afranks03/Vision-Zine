import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Eyebrow, Meta } from '@/components/editorial';
import { STYLE_LABELS } from '@/components/zine/styles';
import { Zine } from '@/components/zine/zine';
import type { RenderableZine } from '@/components/zine/types';
import { createClient } from '@/lib/supabase/server';
import { signCoverUrl } from '@/lib/storage/zine-cover';
import type {
  AchievementsContent,
  BioContent,
  GoalsContent,
  PersonalContent,
  ResumeContent,
  SectionKey,
  TenetsContent,
  VisionContent,
  ZineDataRow,
  ZineRow,
} from '@/lib/supabase/types';
import { DownloadPdfButton } from './download-pdf-button';
import { FormatSwitcher } from './format-switcher';
import { PrintButton } from './print-button';
import { PublishControls } from './publish-controls';
import { StyleSwitcher } from './style-switcher';

export const metadata: Metadata = {
  title: 'Preview',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [zineRes, sectionsRes] = await Promise.all([
    supabase.from('zines').select('*').eq('id', id).single(),
    supabase.from('zine_data').select('*').eq('zine_id', id),
  ]);

  if (zineRes.error || !zineRes.data) {
    notFound();
  }

  const zine = zineRes.data as ZineRow;
  const sections = (sectionsRes.data ?? []) as ZineDataRow[];
  const data = denormalize(zine, sections);
  const coverImageUrl = zine.cover_image_path
    ? ((await signCoverUrl(zine.cover_image_path)) ?? undefined)
    : undefined;

  return (
    <div className="bg-vz-oat min-h-screen">
      {/* Preview chrome — only visible on screen, not in print. */}
      <div className="border-vz-ink/20 bg-vz-cream sticky top-0 z-50 border-b print:hidden">
        <div className="vz-container flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/app/zines/${id}`}
              className="vz-eyebrow text-vz-ink hover:text-vz-coral transition-colors"
            >
              ← Back to studio
            </Link>
            <Meta className="text-vz-ink/60 hidden sm:inline-block">
              Preview · {STYLE_LABELS[zine.style]} ·{' '}
              {zine.format.charAt(0).toUpperCase() + zine.format.slice(1)}
            </Meta>
          </div>
          <div className="flex items-center gap-2">
            <StyleSwitcher zineId={id} current={zine.style} />
            <FormatSwitcher zineId={id} current={zine.format} />
            <Eyebrow className="text-vz-coral hidden xl:inline-block">
              Issue {zine.issue_number}
            </Eyebrow>
            <PublishControls zineId={id} initialPublished={zine.is_published} />
            <PrintButton />
            <DownloadPdfButton zineId={id} />
            <Link
              href={`/app/zines/${id}/checkout`}
              className="vz-eyebrow bg-vz-coral text-vz-cream hover:bg-vz-ink hover:text-vz-yellow px-3 py-2 transition-colors"
            >
              {zine.status === 'paid' ? 'Paid ✓' : 'Get this issue →'}
            </Link>
          </div>
        </div>
      </div>

      <Zine data={data} coverImageUrl={coverImageUrl} />
    </div>
  );
}

/* ---- helpers ---- */

function denormalize(zine: ZineRow, sections: ZineDataRow[]): RenderableZine {
  const map = new Map<SectionKey, Record<string, unknown>>();
  for (const s of sections) {
    map.set(s.section_key, s.content_json);
  }
  return {
    zine,
    personal: (map.get('personal') ?? {}) as Partial<PersonalContent>,
    vision: (map.get('vision') ?? {}) as Partial<VisionContent>,
    bio: (map.get('bio') ?? {}) as Partial<BioContent>,
    resume: (map.get('resume') ?? {}) as Partial<ResumeContent>,
    achievements: (map.get('achievements') ?? {}) as Partial<AchievementsContent>,
    goals: (map.get('goals') ?? {}) as Partial<GoalsContent>,
    tenets: (map.get('tenets') ?? {}) as Partial<TenetsContent>,
  };
}
