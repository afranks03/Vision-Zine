/* eslint-disable react/no-unknown-property */
import { ImageResponse } from 'next/og';
import { createAdminClient } from '@/lib/supabase/admin';
import { STYLE_PALETTES } from '@/components/zine/styles';
import type { PersonalContent, ZineRow } from '@/lib/supabase/types';

// Per-zine Open Graph image. 1200×630. Renders the cover masthead +
// owner name + style accent in the published zine's palette.

export const alt = 'A Vision Zine';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OpengraphImage({ params }: Props) {
  const { id } = await params;

  // Fall back to brand colors if we can't load the zine (deleted,
  // unpublished, or admin client init failed).
  let zine: ZineRow | null = null;
  let personal: Partial<PersonalContent> = {};
  try {
    const admin = createAdminClient();
    const [zineRes, personalRes] = await Promise.all([
      admin.from('zines').select('*').eq('id', id).eq('is_published', true).single(),
      admin
        .from('zine_data')
        .select('content_json')
        .eq('zine_id', id)
        .eq('section_key', 'personal')
        .maybeSingle(),
    ]);
    zine = (zineRes.data as ZineRow | null) ?? null;
    personal = ((personalRes.data?.content_json ?? {}) as Partial<PersonalContent>) ?? {};
  } catch {
    // service role unavailable — fall back to defaults
  }

  const palette = zine ? STYLE_PALETTES[zine.style].cover : STYLE_PALETTES.editorial.cover;
  const title = (zine?.title || 'Vision').toUpperCase();
  const issue = zine?.issue_number ?? 1;
  const displayName = personal.display_name || personal.full_name || 'a private edition';
  const fontSize = title.length <= 8 ? 200 : title.length <= 14 ? 150 : title.length <= 22 ? 100 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: palette.bg,
          color: palette.fg,
          display: 'flex',
          flexDirection: 'column',
          padding: 56,
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Top meta */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 18,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                width: 9,
                height: 9,
                background: palette.fg,
                borderRadius: '50%',
                marginRight: 12,
              }}
            />
            Issue {issue}
          </span>
          <span
            style={{
              width: 56,
              height: 56,
              border: `2px solid ${palette.fg}`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif',
            }}
          >
            VZ
          </span>
        </div>

        {/* Masthead */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8,
              fontSize: 22,
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: -6,
            }}
          >
            <span>From the desk of</span>
            <span
              style={{
                fontStyle: 'italic',
                fontFamily: 'Georgia, serif',
                textTransform: 'none',
              }}
            >
              {displayName}
            </span>
          </div>
          <div
            style={{
              fontSize,
              lineHeight: 0.9,
              letterSpacing: -3,
              fontWeight: 400,
              fontFamily: 'Georgia, serif',
              marginTop: 8,
              textAlign: 'center',
              maxWidth: 1050,
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom rule */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: `2px solid ${palette.fg}`,
            paddingTop: 18,
            fontSize: 16,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <span>vision-zine.vercel.app</span>
          <span>Vol. {issue}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
