import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Database generic deferred until `supabase gen types typescript --linked`
  // is set up — see lib/supabase/server.ts for context.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
