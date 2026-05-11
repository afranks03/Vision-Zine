import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AI_MODEL, getAnthropicClient } from './client';

/**
 * Shared helper for the four AI streaming routes. Validates auth, runs the
 * model with prompt caching on the system block, and returns a plain text
 * ReadableStream (one chunk per text delta).
 */

const MAX_INPUT_CHARS = 8000;

interface StreamRouteOptions {
  systemPrompt: string;
  buildUserPrompt: (rawInput: string, displayName?: string) => string;
}

interface RouteRequestBody {
  raw_input?: unknown;
  display_name?: unknown;
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

  // 2. Parse + validate body.
  let body: RouteRequestBody;
  try {
    body = (await request.json()) as RouteRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const rawInput = typeof body.raw_input === 'string' ? body.raw_input.trim() : '';
  const displayName =
    typeof body.display_name === 'string' && body.display_name.trim()
      ? body.display_name.trim()
      : undefined;

  if (!rawInput) {
    return NextResponse.json(
      { error: 'raw_input is required and must be a non-empty string.' },
      { status: 400 },
    );
  }
  if (rawInput.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      { error: `raw_input too long (max ${MAX_INPUT_CHARS} chars).` },
      { status: 413 },
    );
  }

  // 3. Build and stream the Claude call.
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
        const message =
          err instanceof Error ? err.message : 'AI stream failed.';
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
