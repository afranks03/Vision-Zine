/**
 * Rate-limit helper (Phase 6b). Backed by Upstash Redis — free tier
 * handles ~10k commands/day, more than enough for AI request gating
 * at our scale.
 *
 * Pattern: lazy-init the client. If UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN are NOT set, every limit check returns
 * `{ success: true }` so local dev and unwired previews still work.
 * Production must set both env vars (see .env.example).
 *
 * Usage from a route:
 *
 *   const result = await aiRateLimit.limit(`ai:${userId}`);
 *   if (!result.success) {
 *     return NextResponse.json(
 *       { error: 'Rate limit exceeded. Try again in a minute.' },
 *       { status: 429, headers: { 'Retry-After': String(result.reset) } },
 *     );
 *   }
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let cachedClient: Redis | null = null;
let warned = false;

function getRedis(): Redis | null {
  if (cachedClient) return cachedClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (!warned) {
      console.warn(
        '[ratelimit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — rate limiting disabled.',
      );
      warned = true;
    }
    return null;
  }
  cachedClient = new Redis({ url, token });
  return cachedClient;
}

interface LimitResult {
  success: boolean;
  /** When the limit resets (epoch ms). Use for Retry-After. */
  reset: number;
  remaining: number;
  limit: number;
}

/**
 * Build a rate limiter for the given window. If Upstash isn't
 * configured, all calls fail-open (success: true) — the parent
 * pipeline keeps running. Phase 6 sets up Upstash; before that,
 * this is a no-op.
 *
 * Per-route limiters are cached at module scope so they share the
 * same Redis pipeline across requests.
 */
function buildLimiter(rate: number, windowSec: number, prefix: string) {
  let limiter: Ratelimit | null = null;
  function get(): Ratelimit | null {
    if (limiter) return limiter;
    const redis = getRedis();
    if (!redis) return null;
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(rate, `${windowSec} s`),
      analytics: true,
      prefix,
    });
    return limiter;
  }

  return {
    async limit(key: string): Promise<LimitResult> {
      const l = get();
      if (!l) {
        // Fail-open. Surface a permissive shape so callers don't branch.
        return {
          success: true,
          reset: Date.now() + windowSec * 1000,
          remaining: rate,
          limit: rate,
        };
      }
      const r = await l.limit(key);
      return {
        success: r.success,
        reset: r.reset,
        remaining: r.remaining,
        limit: r.limit,
      };
    },
  };
}

/**
 * 30 requests per hour per user, sliding window. The four /api/ai/*
 * routes share this bucket — a user who burns through 30 vision
 * suggestions can't then run 30 bio summaries.
 *
 * Generous enough that real usage never hits it; tight enough that a
 * runaway loop or accidental prompt-spam doesn't drain the Anthropic
 * budget.
 */
export const aiRateLimit = buildLimiter(30, 3600, 'vz:ai');
