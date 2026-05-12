'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { PRICING, priceIdFor, type OutputId, type PricingTierId } from '@/lib/billing/pricing';
import { getStripeClient } from '@/lib/billing/stripe';
import { createClient } from '@/lib/supabase/server';

interface CreateCheckoutInput {
  zineId: string;
  tier: PricingTierId;
  outputs: OutputId[];
}

/**
 * Create a Stripe Checkout Session for a zine and redirect the caller to
 * Stripe's hosted checkout page.
 *
 * Verifies auth + ownership before talking to Stripe. Uses an inline
 * `price_data` object so this works without pre-created Stripe Products —
 * Adrian can add real Price IDs later via STRIPE_PRICE_* env vars.
 */
export async function createCheckoutSession(input: CreateCheckoutInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const { data: zine, error } = await supabase
    .from('zines')
    .select('id, user_id, title, format, issue_number, status')
    .eq('id', input.zineId)
    .single();
  if (error || !zine) return { error: 'Zine not found.' };
  if ((zine as { user_id: string }).user_id !== user.id) {
    return { error: 'Not authorized.' };
  }

  const tier = PRICING[input.tier];
  if (!tier) return { error: 'Unknown pricing tier.' };

  let stripe;
  try {
    stripe = getStripeClient();
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Stripe is not configured.' };
  }

  // Build the line item. If an explicit Price ID is set in env, use it;
  // otherwise generate an inline price_data object.
  const explicitPriceId = priceIdFor(tier.id);
  const lineItem = explicitPriceId
    ? { price: explicitPriceId, quantity: 1 }
    : {
        price_data: {
          currency: 'usd',
          unit_amount: tier.amountCents,
          product_data: {
            name: `Vision Zine — ${tier.name}`,
            description:
              tier.id === 'one_issue'
                ? `Issue ${(zine as { issue_number: number }).issue_number}: ${
                    (zine as { title: string | null }).title || 'Untitled'
                  }`
                : 'Annual subscription — issue all year',
          },
          ...(tier.mode === 'subscription' && tier.interval
            ? { recurring: { interval: tier.interval } }
            : {}),
        },
        quantity: 1,
      };

  // Construct the success/cancel URLs from the current request's origin so
  // dev and prod both work without env coupling.
  const hdrs = await headers();
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host');
  const proto = hdrs.get('x-forwarded-proto') ?? 'https';
  const origin = host
    ? `${proto}://${host}`
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const successUrl = `${origin}/app/zines/${input.zineId}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/app/zines/${input.zineId}/checkout/cancel`;

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: tier.mode,
      line_items: [lineItem],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      // Carry the zine_id + chosen outputs through to the webhook.
      metadata: {
        zine_id: input.zineId,
        tier: tier.id,
        user_id: user.id,
        outputs: input.outputs.join(','),
      },
      // For subscriptions, set the metadata on the subscription too.
      ...(tier.mode === 'subscription'
        ? {
            subscription_data: {
              metadata: { user_id: user.id, tier: tier.id },
            },
          }
        : {}),
      // Capture shipping for the printed copy at the print step (Phase 4d).
      // For now we just record that outputs were chosen.
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to create checkout session.' };
  }

  if (!session.url) {
    return { error: 'Stripe did not return a checkout URL.' };
  }

  redirect(session.url);
}
