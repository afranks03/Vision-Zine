import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    // Surface a clear, actionable error in Vercel logs instead of an opaque MIDDLEWARE_INVOCATION_FAILED.
    // Both vars are inlined at BUILD time — must redeploy after adding them in Vercel.
    console.error(
      `[supabase/middleware] Missing env at build time: ` +
        `NEXT_PUBLIC_SUPABASE_URL=${url ? 'set' : 'MISSING'}, ` +
        `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${key ? 'set' : 'MISSING'}`,
    );
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Touching getUser() refreshes the session cookie when it's near expiry.
  await supabase.auth.getUser();

  return supabaseResponse;
}
