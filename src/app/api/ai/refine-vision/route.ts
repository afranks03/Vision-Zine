import { NextResponse, type NextRequest } from 'next/server';
import { AI_MODEL, getAnthropicClient } from '@/lib/ai/client';
import { refineVisionSystem, refineVisionUser } from '@/lib/ai/prompts/refine-vision';
import { aiRateLimit } from '@/lib/ratelimit';
import { createClient } from '@/lib/supabase/server';
import { formatZodError, refineVisionRequestSchema } from '@/lib/validation/schemas';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Refine-Vision endpoint (Phase 7c). Mirrors handleAIStreamRoute's
 * auth + rate-limit + Zod pipeline but takes a structured body
 * (current_vision + the six practice fields) rather than raw_input.
 * Streams the refined Vision back as plain text — the client appends
 * deltas into a comparison panel for accept/reject.
 *
 * Shares the same /hour/user rate-limit bucket as the four /api/ai/*
 * routes so prompt-spam can't go around it through this endpoint.
 */
export async function POST(request: NextRequest) {
  // 1. Auth.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  // 2. Rate-limit (shared bucket with the four AI streaming routes).
  const limit = await aiRateLimit.limit(`ai:${user.id}`);
  if (!limit.success) {
    const retryAfterSec = Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000));
    return NextResponse.json(
      {
        error: 'You’ve made a lot of AI requests in the last hour. Try again in a few minutes.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': String(limit.limit),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  // 3. Zod-validated body.
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  const parsed = refineVisionRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  // At least one Practice field OR a current Vision is required —
  // otherwise the model has nothing to work with.
  const p = parsed.data.practice;
  const hasAnyPractice = Boolean(
    p.gratitude || p.forgiveness || p.grounding || p.spirituality || p.environment || p.friend_circle,
  );
  if (!hasAnyPractice && !parsed.data.current_vision?.trim()) {
    return NextResponse.json(
      {
        error:
          'Write at least one Practice prompt or a Vision draft before asking the editor to sharpen.',
      },
      { status: 400 },
    );
  }

  // 4. Build and stream the Claude call.
  let anthropic;
  try {
    anthropic = getAnthropicClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Anthropic client init failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const userPrompt = refineVisionUser({
    currentVision: parsed.data.current_vision,
    ...p,
    displayName: parsed.data.display_name,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const claudeStream = anthropic.messages.stream({
          model: AI_MODEL,
          max_tokens: 2048,
          thinking: { type: 'adaptive' },
          system: [
            {
              type: 'text',
              text: refineVisionSystem,
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: [{ role: 'user', content: userPrompt }],
        });

        claudeStream.on('text', (delta) => {
          controller.enqueue(encoder.encode(delta));
        });

        await claudeStream.finalMessage();
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'AI stream failed.';
        controller.enqueue(encoder.encode(`\n\n[error] ${message}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    },
  });
}
