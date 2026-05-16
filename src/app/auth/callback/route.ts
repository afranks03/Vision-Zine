import { after } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email/send';

/**
 * Magic-link redirect handler. Exchanges the `code` query param for a Supabase
 * session and bounces the user to `next` (default `/app`).
 *
 * IMPORTANT: cookies set by `exchangeCodeForSession` MUST be attached to the
 * same NextResponse we return. Using `cookies()` from next/headers here would
 * set cookies on Next's implicit response — they would NOT propagate to the
 * redirect response, and the browser would never see the session. So we build
 * the response object up front and inject it into the Supabase cookie handler.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/app';

  if (!code) {
    return NextResponse.redirect(`${origin}/signin?error=missing_code`);
  }

  // Build the redirect response first so the Supabase client can write
  // session cookies onto it.
  const response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(error.message)}`);
  }

  // First-signin welcome email. Supabase populates `created_at` on user
  // registration; on subsequent signins it stays the same while
  // `last_sign_in_at` advances. We treat the exchange as a "new user"
  // event when the gap is small (≤ 60s), which is the typical magic-link
  // signup flow: user enters email → receives link → clicks link.
  //
  // Sent via after() so the redirect isn't held up by Resend latency,
  // and via the idempotency key in sendWelcomeEmail to deduplicate
  // repeat exchanges within Resend's dedup window.
  const user = data.user;
  if (user?.email && user.created_at) {
    const createdAtMs = Date.parse(user.created_at);
    const isFresh = Number.isFinite(createdAtMs) && Date.now() - createdAtMs < 60_000;
    if (isFresh) {
      const firstName = extractFirstName(user.user_metadata);
      after(async () => {
        await sendWelcomeEmail({ to: user.email!, firstName });
      });
    }
  }

  return response;
}

function extractFirstName(metadata: unknown): string | undefined {
  if (!metadata || typeof metadata !== 'object') return undefined;
  const meta = metadata as Record<string, unknown>;
  const candidates = [meta.first_name, meta.full_name, meta.name];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().length > 0) {
      // Take the first token (handles "Adrian Franks" → "Adrian").
      return c.trim().split(/\s+/)[0];
    }
  }
  return undefined;
}
