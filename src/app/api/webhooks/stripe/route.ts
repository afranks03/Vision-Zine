import { NextResponse, type NextRequest } from 'next/server';
import { getStripeClient } from '@/lib/billing/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
// Webhook handlers must be fast — Stripe expects 200 within ~5s. Don't
// chain long work here; instead enqueue it (we'll add background jobs in
// Phase 5/6). For now we just mark the zine paid.
export const maxDuration = 15;

/**
 * Stripe webhook handler. Verifies the signature against
 * STRIPE_WEBHOOK_SECRET, then processes events:
 *   - checkout.session.completed → mark zines.status = 'paid' on the
 *     associated zine_id (from session.metadata)
 *
 * Uses the Supabase service role key (server-only) since the webhook
 * runs without a user session — RLS would otherwise block the update.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      {
        error:
          'STRIPE_WEBHOOK_SECRET is not set. Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` locally; set the value in Vercel env for production.',
      },
      { status: 500 },
    );
  }

  const sig = request.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  // Stripe requires the raw body for signature verification — Next gives
  // us the raw text via `request.text()`.
  const body = await request.text();

  let stripe;
  try {
    stripe = getStripeClient();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Stripe is not configured.' },
      { status: 500 },
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid webhook signature.';
    return NextResponse.json({ error: `Webhook signature failed: ${message}` }, { status: 400 });
  }

  // Process the event we care about.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const zineId = session.metadata?.zine_id;
    if (zineId) {
      const result = await markZinePaid(zineId);
      if ('error' in result) {
        console.error('[stripe webhook] failed to mark zine paid', {
          zineId,
          error: result.error,
        });
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function markZinePaid(zineId: string): Promise<{ ok: true } | { error: string }> {
  let client;
  try {
    client = createAdminClient();
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Admin client init failed.' };
  }

  const { error } = await client.from('zines').update({ status: 'paid' }).eq('id', zineId);

  if (error) return { error: error.message };
  return { ok: true };
}
