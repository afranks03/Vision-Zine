import { createServerClient } from '@supabase/ssr';

/**
 * Service-role Supabase client. Bypasses RLS — use ONLY for trusted
 * server-side reads/writes where the route is itself the trust boundary
 * (the public /z/[id] route, the Stripe webhook handler).
 *
 * Never import this into a Client Component or expose its results
 * without filtering them against the caller's identity.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      'Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.',
    );
  }
  return createServerClient(url, serviceKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {
        /* no cookies in service-role contexts */
      },
    },
  });
}
