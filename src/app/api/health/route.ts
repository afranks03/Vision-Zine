import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Health check (Phase 6e). Used by external uptime monitors
 * (BetterStack / UptimeRobot / Pingdom) to verify the app is
 * reachable AND that critical dependencies are responsive.
 *
 * Returns 200 with a structured payload on success. Returns 503
 * when Supabase isn't reachable (the most critical dependency —
 * everything else degrades gracefully). Vercel + Resend + Stripe
 * + Lulu failures don't bring this endpoint down because they're
 * only hit on user-initiated flows, not on every page load.
 *
 * No auth — by design. The endpoint exposes only "ok / not ok"
 * and a build SHA, never user data.
 */
export async function GET() {
  const startedAt = Date.now();
  const checks: Record<string, { ok: boolean; ms: number; error?: string }> = {};

  // Supabase ping — light SELECT against a publicly readable
  // count. Fails fast if DB is unreachable.
  try {
    const t0 = Date.now();
    const client = createAdminClient();
    // `head: true` + `count: exact` runs as a tiny HEAD-style
    // request — returns just the count, no rows.
    const { error } = await client.from('zines').select('id', { count: 'exact', head: true });
    checks.supabase = error
      ? { ok: false, ms: Date.now() - t0, error: error.message }
      : { ok: true, ms: Date.now() - t0 };
  } catch (err) {
    checks.supabase = {
      ok: false,
      ms: 0,
      error: err instanceof Error ? err.message : 'unreachable',
    };
  }

  const ok = Object.values(checks).every((c) => c.ok);
  const body = {
    ok,
    checks,
    sha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
    region: process.env.VERCEL_REGION ?? 'local',
    elapsed_ms: Date.now() - startedAt,
    at: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    status: ok ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}
