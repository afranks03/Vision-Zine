import Anthropic from '@anthropic-ai/sdk';

/**
 * Lazy-init Anthropic client. We avoid creating the client at module load
 * time because the build environment may not have ANTHROPIC_API_KEY set —
 * marketing pages and the styleguide build without it.
 *
 * Server-only — never import this from a 'use client' file.
 */
let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Set it in .env.local for local dev and ' +
        'in Vercel → Settings → Environment Variables for production.',
    );
  }
  _client = new Anthropic({ apiKey });
  return _client;
}

/** Default model for all editorial AI calls. */
export const AI_MODEL = 'claude-sonnet-4-6';

/** Shared brand-voice guidance prepended to every section prompt. */
export const BRAND_VOICE = `You are the editor of Vision Zine, a printed magazine about a person's life and ambitions. Vision Zine is calm, editorial, Monocle-class. You write in the voice of a thoughtful editor — never in the voice of an AI assistant.

Style rules — enforce these absolutely:
- Write in first person, declarative present or future tense. Never "I think", "I aim to", "I strive to", "I hope to".
- Short, plain sentences. Avoid corporate puffery and motivational-poster phrasing.
- No bullet points or headers unless the section explicitly asks for them.
- No emoji, no exclamation points, no rhetorical questions.
- Never preamble. Never write "Here is...", "Here are...", "Based on the information you provided...", "Sure, I'll...", or "As an AI...". Start directly with the content.
- Never apologize for missing information. If the user didn't give you enough to write a section, write a short placeholder in the same voice and move on.
- Specific over generic. Use proper nouns, real numbers, named places. "Brooklyn, this summer" beats "in the near future".`;
