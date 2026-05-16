import { Resend } from 'resend';

/**
 * Lazy Resend client. We don't instantiate at module load because the
 * env var may be absent in local dev (in which case we want to log a
 * warning and skip, not crash).
 *
 * Mirrors the pattern in lib/billing/stripe.ts.
 */
let cached: Resend | null = null;

export function getResendClient(): Resend {
  if (!cached) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error(
        'RESEND_API_KEY is not set. Get one at resend.com → API Keys and add it to .env.local.',
      );
    }
    cached = new Resend(key);
  }
  return cached;
}

/** Truthy if we have email credentials configured. Use this before
 *  attempting to send so callers can fail-soft (log + continue) when
 *  Resend isn't wired up yet. */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getFromAddress(): string {
  return process.env.EMAIL_FROM || 'Vision Zine <onboarding@resend.dev>';
}

export function getBccAddress(): string | undefined {
  const bcc = process.env.EMAIL_BCC?.trim();
  return bcc && bcc.length > 0 ? bcc : undefined;
}
