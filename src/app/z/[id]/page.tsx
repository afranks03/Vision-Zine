import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Eyebrow, Meta } from '@/components/editorial';
import { Zine } from '@/components/zine/zine';
import type { RenderableZine } from '@/components/zine/types';
import { signCoverUrl } from '@/lib/storage/zine-cover';
import { createAdminClient } from '@/lib/supabase/admin';
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

/**
 * Public web edition. No auth — anyone with the URL views the zine.
 * The owner controls visibility via the `is_published` flag from the
 * studio's preview chrome. We use the service-role client to bypass RLS
 * for this read; the is_published check is the public-access gate.
 */

interface Props {
  params: Promise<{ id: string }>;
}

async function loadZine(id: string): Promise<RenderableZine | null> {
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return null;
  }

  const [zineRes, sectionsRes] = await Promise.all([
    admin.from('zines').select('*').eq('id', id).eq('is_published', true).single(),
    admin.from('zine_data').select('*').eq('zine_id', id),
  ]);

  if (zineRes.error || !zineRes.data) return null;
  const zine = zineRes.data as ZineRow;
  const sections = (sectionsRes.data ?? []) as ZineDataRow[];

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await loadZine(id);
  if (!data) {
    return { title: 'Zine not found', robots: { index: false } };
  }
  const displayName = data.personal.display_name || data.personal.full_name || 'someone';
  const title = data.zine.title || `Issue ${data.zine.issue_number}`;
  const description =
    data.vision.statement?.split('\n')[0]?.slice(0, 200) ||
    data.bio.summary?.slice(0, 200) ||
    `${title} — a private edition of Vision Zine, from the desk of ${displayName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'Vision Zine',
      // The opengraph-image.tsx adjacent file generates this automatically.
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PublicZinePage({ params }: Props) {
  const { id } = await params;
  const data = await loadZine(id);
  if (!data) notFound();

  const coverImageUrl = data.zine.cover_image_path
    ? ((await signCoverUrl(data.zine.cover_image_path)) ?? undefined)
    : undefined;

  return (
    <div className="bg-vz-oat min-h-screen">
      <Zine data={data} coverImageUrl={coverImageUrl} />
      <PublicFooter zineId={id} />
    </div>
  );
}

function PublicFooter({ zineId }: { zineId: string }) {
  return (
    // print:hidden — the CTAs and URL display are web-only chrome.
    // They appear in the live /z/[id] view and on social shares but
    // never on the PDF the user downloads or the bound print copy.
    <footer className="bg-vz-ink text-vz-cream print:hidden">
      <div className="vz-container vz-section-tight text-center">
        <Eyebrow className="text-vz-yellow">A Vision Zine</Eyebrow>
        <p
          className="font-display mx-auto mt-5 max-w-xl leading-tight"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
        >
          Make one of your own.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="vz-eyebrow bg-vz-yellow text-vz-ink hover:bg-vz-coral hover:text-vz-cream px-5 py-3 transition-colors"
          >
            Start your zine
          </Link>
          <Link
            href="/examples"
            className="vz-eyebrow border-vz-cream text-vz-cream hover:bg-vz-cream hover:text-vz-ink border px-5 py-3 transition-colors"
          >
            See more
          </Link>
        </div>
        <Meta className="text-vz-cream/50 mt-8 block font-mono">/z/{zineId}</Meta>
      </div>
    </footer>
  );
}
