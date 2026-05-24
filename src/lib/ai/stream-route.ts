import { NextResponse, type NextRequest } from 'next/server';
import { aiRateLimit } from '@/lib/ratelimit';
import { createClient } from '@/lib/supabase/server';
import { aiStreamRequestSchema, formatZodError } from '@/lib/validation/schemas';
import { AI_MODEL, getAnthropicClient } from './client';

/**
 * Shared helper for the four AI streaming routes. Validates auth + body
 * (Zod), applies a per-user rate limit, then runs the model with prompt
 * caching on the system block and returns a plain text ReadableStream
 * (one chunk per text delta).
 *
 * Phase 6 hardening: Zod replaces hand-rolled validation; Upstash rate
 * limiting prevents prompt-spam from draining the Anthropic budget.
 */

interface StreamRouteOptions {
  systemPrompt: string;
  buildUserPrompt: (rawInput: string, displayName?: string) => string;
}

export async function handleAIStreamRoute(
  request: NextRequest,
  { systemPrompt, buildUserPrompt }: StreamRouteOptions,
): Promise<Response> {
  // 1. Auth gate — must be signed in.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  // 2. Rate-limit by user_id. Shared bucket across the four AI routes
  //    (30/hour total) so a runaway loop in any one of them can't
  //    drain the entire Anthropic budget.
  const limit = await aiRateLimit.limit(`ai:${user.id}`);
  if (!limit.success) {
    const retryAfterSec = Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000));
    return NextResponse.json(
      {
        error:
          'You’ve made a lot of AI requests in the last hour. Try again in a few minutes.',
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

  // 3. Parse + validate body via Zod.
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  const parsed = aiStreamRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }
  const rawInput = parsed.data.raw_input.trim();
  const displayName = parsed.data.display_name?.trim() || undefined;
  if (!rawInput) {
    return NextResponse.json(
      { error: 'Write something before asking the assistant.' },
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

  const userPrompt = buildUserPrompt(rawInput, displayName);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const claudeStream = anthropic.messages.stream({
          model: AI_MODEL,
          max_tokens: 2048,
          thinking: { type: 'adaptive' },
          // System prompts are stable per route — cache them. The user prompt
          // varies per request, so it sits after the cached prefix.
          system: [
            {
              type: 'text',
              text: systemPrompt,
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: [{ role: 'user', content: userPrompt }],
        });

        // Forward each text delta as a UTF-8 chunk.
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
