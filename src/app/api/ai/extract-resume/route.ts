import { type NextRequest } from 'next/server';
import { resumeSystem, resumeUser } from '@/lib/ai/prompts/resume';
import { handleAIStreamRoute } from '@/lib/ai/stream-route';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  return handleAIStreamRoute(request, {
    systemPrompt: resumeSystem,
    buildUserPrompt: resumeUser,
  });
}
