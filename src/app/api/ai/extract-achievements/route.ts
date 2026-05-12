import { type NextRequest } from 'next/server';
import { achievementsSystem, achievementsUser } from '@/lib/ai/prompts/achievements';
import { handleAIStreamRoute } from '@/lib/ai/stream-route';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  return handleAIStreamRoute(request, {
    systemPrompt: achievementsSystem,
    buildUserPrompt: achievementsUser,
  });
}
