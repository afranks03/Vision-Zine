import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Eyebrow, Meta } from '@/components/editorial';
import { createClient } from '@/lib/supabase/server';
import type { ZineRow } from '@/lib/supabase/types';

export const metadata: Metadata = {
  title: 'Start the next issue',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * One-click reissue (Phase 5d).
 *
 * The annual reminder email links to this page. Server-rendered: auth
 * check, owner check, then clones the previous zine's structure and
 * content_json into a new draft (new issue_number is auto-assigned by
 * the DB trigger). Redirects into the studio for the new issue.
 *
 * Title is intentionally NOT suffixed with "(copy)" the way the
 * dashboard's Duplicate action does. This is a real reissue — same
 * editorial title, new chapter. The user can edit it in the Cover
 * section if they want a fresh name.
 */
export default async function ReissuePage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/signin?next=${encodeURIComponent(`/app/zines/${id}/reissue`)}`);
  }

  // Owner check via RLS — if the user doesn't own the zine, the
  // select returns nothing and we show a "not found" shell.
  const { data: source, error: fetchErr } = await supabase
    .from('zines')
    .select('*')
    .eq('id', id)
    .single();
  if (fetchErr || !source) {
    return (
      <ReissueShell
        title="Issue not found"
        body="This zine doesn't exist or you don't have permission to reissue it. Open your dashboard to start a fresh one."
        cta={{ href: '/app', label: 'Open dashboard' }}
      />
    );
  }
  const sourceZine = source as ZineRow;
  if (sourceZine.user_id !== user.id) {
    return (
      <ReissueShell
        title="Not your zine"
        body="Only the owner can reissue a zine. If this is your zine, sign out and back in with the email you used to create it."
        cta={{ href: '/app', label: 'Open dashboard' }}
      />
    );
  }

  // Create the new draft. issue_number is auto-assigned by the DB
  // trigger as MAX(issue_number) + 1 for this user.
  const { data: newZine, error: insertErr } = await supabase
    .from('zines')
    .insert({
      user_id: user.id,
      style: sourceZine.style,
      format: sourceZine.format,
      title: sourceZine.title, // verbatim — this is a reissue, not a copy
      cover_layout: sourceZine.cover_layout,
      cover_accent: sourceZine.cover_accent,
      cover_subtitle: sourceZine.cover_subtitle,
      cover_image_path: sourceZine.cover_image_path,
      cover_image_focal_x: sourceZine.cover_image_focal_x,
      cover_image_focal_y: sourceZine.cover_image_focal_y,
      typography_preset: sourceZine.typography_preset,
    })
    .select('id')
    .single();
  if (insertErr || !newZine) {
    return (
      <ReissueShell
        title="Couldn't start the next issue"
        body={`We hit a snag creating the new draft: ${insertErr?.message ?? 'unknown error'}. Try again, or start a new zine from scratch.`}
        cta={{ href: '/app', label: 'Open dashboard' }}
      />
    );
  }
  const newZineId = (newZine as { id: string }).id;

  // Clone section data verbatim. Best-effort — if the copy fails, the
  // new zine exists but is empty. The user can fill it from scratch.
  const { data: sourceSections } = await supabase
    .from('zine_data')
    .select('section_key, content_json')
    .eq('zine_id', id);
  if (sourceSections && sourceSections.length > 0) {
    const rows = sourceSections.map((row) => ({
      zine_id: newZineId,
      section_key: row.section_key,
      content_json: row.content_json,
    }));
    await supabase.from('zine_data').insert(rows);
  }

  // Drop them in the new studio.
  redirect(`/app/zines/${newZineId}`);
}

function ReissueShell({
  title,
  body,
  cta,
}: {
  title: string;
  body: React.ReactNode;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="bg-vz-oat flex min-h-screen items-center justify-center px-6 py-20">
      <div className="border-vz-ink bg-vz-cream w-full max-w-lg border p-10">
        <Eyebrow className="text-vz-coral">Reissue</Eyebrow>
        <h1
          className="font-display mt-3 leading-[1] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
        >
          {title}
        </h1>
        <div className="vz-prose text-vz-ink/80 mt-5 text-base">{body}</div>
        <div className="mt-7 flex items-center gap-4">
          {cta && (
            <Link
              href={cta.href}
              className="vz-eyebrow border-vz-ink bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream border px-4 py-2 transition-colors"
            >
              {cta.label}
            </Link>
          )}
          <Meta className="text-vz-ink/50">
            <Link href="/" className="hover:text-vz-coral transition-colors">
              ← Back to Vision Zine
            </Link>
          </Meta>
        </div>
      </div>
    </div>
  );
}
