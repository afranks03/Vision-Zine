import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

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

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(error.message)}`);
  }

  return response;
}
