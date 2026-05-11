import { type NextRequest } from 'next/server';
import { bioSystem, bioUser } from '@/lib/ai/prompts/bio';
import { handleAIStreamRoute } from '@/lib/ai/stream-route';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  return handleAIStreamRoute(request, {
    systemPrompt: bioSystem,
    buildUserPrompt: bioUser,
  });
}
