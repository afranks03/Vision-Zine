import { type NextRequest } from 'next/server';
import { visionSystem, visionUser } from '@/lib/ai/prompts/vision';
import { handleAIStreamRoute } from '@/lib/ai/stream-route';

export const runtime = 'nodejs';
// Vision Statement may take a moment — give the route headroom.
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  return handleAIStreamRoute(request, {
    systemPrompt: visionSystem,
    buildUserPrompt: visionUser,
  });
}
