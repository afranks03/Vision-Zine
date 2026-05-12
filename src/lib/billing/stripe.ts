import Stripe from 'stripe';

/**
 * Lazy-init Stripe server client. Like the Anthropic client, we wait until
 * a route actually needs it so the build doesn't fail without keys set.
 */
let _client: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (_client) return _client;
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Get a test-mode key at dashboard.stripe.com → ' +
        'Developers → API keys, then set it in .env.local for local dev and in ' +
        'Vercel → Settings → Environment Variables for production.',
    );
  }
  _client = new Stripe(apiKey, {
    // Pin to the SDK's bundled API version so future Stripe API upgrades
    // don't silently change behavior.
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
  });
  return _client;
}

export const STRIPE_WEBHOOK_SECRET_ENV = 'STRIPE_WEBHOOK_SECRET';
