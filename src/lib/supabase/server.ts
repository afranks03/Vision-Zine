import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  // Database type intentionally not passed here yet — we'll wire it back in
  // once `supabase gen types typescript --linked` is set up. Hand-written
  // Database types are brittle to maintain against the postgrest-js generic
  // constraints. Until then, callers should hold their own row types.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component — middleware refreshes the session, ignore here.
          }
        },
      },
    },
  );
}
