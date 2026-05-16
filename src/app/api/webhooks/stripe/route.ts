import { after } from 'next/server';
import { NextResponse, type NextRequest } from 'next/server';
import { getStripeClient } from '@/lib/billing/stripe';
import { sendPaymentReceiptEmail } from '@/lib/email/send';
import { kickoffPrintOrder } from '@/lib/print/pipeline';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
// Stripe expects 200 within ~5s. We mark the zine paid synchronously and
// schedule the print pipeline via after() so the response is fast.
// after() can run up to maxDuration; the print pipeline takes 30–60s.
export const maxDuration = 90;

/**
 * Stripe webhook handler. Verifies the signature against
 * STRIPE_WEBHOOK_SECRET, then processes events:
 *   - checkout.session.completed → mark zines.status = 'paid' AND
 *     (if `print` is in the selected outputs) kick off the Lulu print
 *     pipeline in the background via next/server `after()`.
 *
 * Uses the Supabase service role key — RLS would otherwise block the
 * unauthenticated update.
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const zineId = session.metadata?.zine_id;
    const userId = session.metadata?.user_id;
    const outputs = (session.metadata?.outputs || '').split(',').filter(Boolean);
    const wantsPrint = outputs.includes('print');

    if (zineId) {
      // Synchronous: mark the zine paid first (this is the quick part).
      const result = await markZinePaid(zineId);
      if ('error' in result) {
        console.error('[stripe webhook] failed to mark zine paid', {
          zineId,
          error: result.error,
        });
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      // Background: send the payment receipt email. Best-effort; failure
      // doesn't reverse the paid state. Idempotency-keyed on the Stripe
      // session id so webhook retries don't double-send.
      const contactEmail =
        session.customer_details?.email || session.customer_email || '';
      if (contactEmail) {
        after(async () => {
          try {
            const receiptCtx = await buildReceiptContext(zineId, session.id, {
              outputs,
              amountTotal: session.amount_total,
              currency: session.currency,
              wantsPrint,
            });
            if (receiptCtx) {
              await sendPaymentReceiptEmail({
                to: contactEmail,
                stripeSessionId: session.id,
                ...receiptCtx,
              });
            }
          } catch (err) {
            console.error('[stripe webhook] receipt email crashed', err);
          }
        });
      }

      // Background: kick off the print pipeline if applicable. We pass
      // the work to next/server's after() so Stripe gets a 200 back
      // immediately but the work continues server-side.
      const collectedShipping = extractShippingDetails(session);
      if (wantsPrint && userId && collectedShipping) {
        const stripeShipping = stripeShippingToInput(collectedShipping, session);
        const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://vision-zine.vercel.app';

        if (stripeShipping && contactEmail) {
          after(async () => {
            try {
              await kickoffPrintOrder({
                zineId,
                userId,
                stripeSessionId: session.id,
                contactEmail,
                stripeShipping,
                origin,
              });
            } catch (err) {
              console.error('[stripe webhook] print pipeline crashed', err);
            }
          });
        } else {
          console.warn('[stripe webhook] print requested but shipping or email missing', {
            zineId,
            hasShipping: !!stripeShipping,
            hasEmail: !!contactEmail,
          });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}

/* ---- helpers ---- */

interface StripeShippingShape {
  name: string;
  address: {
    line1: string;
    line2?: string | null;
    city: string;
    state?: string | null;
    postal_code: string;
    country: string;
  };
  phone?: string;
}

interface CollectedShipping {
  name?: string | null;
  address?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
}

/**
 * Stripe API version `dahlia` (2026-04-22) moved shipping info from
 * `session.shipping_details` to `session.collected_information.shipping_details`.
 * We support both shapes so the code keeps working across version bumps.
 */
function extractShippingDetails(session: unknown): CollectedShipping | null {
  const s = session as {
    shipping_details?: CollectedShipping | null;
    collected_information?: { shipping_details?: CollectedShipping | null } | null;
  };
  return s.collected_information?.shipping_details ?? s.shipping_details ?? null;
}

function stripeShippingToInput(
  d: CollectedShipping,
  session: { customer_details?: { phone?: string | null } | null },
): StripeShippingShape | null {
  if (!d.name || !d.address) return null;
  const a = d.address;
  if (!a.line1 || !a.city || !a.postal_code || !a.country) return null;
  return {
    name: d.name,
    address: {
      line1: a.line1,
      line2: a.line2,
      city: a.city,
      state: a.state,
      postal_code: a.postal_code,
      country: a.country,
    },
    phone: session.customer_details?.phone || undefined,
  };
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

/**
 * Build the prop bag for the payment-receipt email by fetching the zine
 * title (so the user sees "Receipt for The Broadwater Chronicle" rather
 * than a UUID) and formatting the Stripe amount/currency for display.
 *
 * Returns null if the zine has been deleted between checkout and now —
 * an edge case but worth handling cleanly.
 */
async function buildReceiptContext(
  zineId: string,
  stripeSessionId: string,
  stripeData: {
    outputs: string[];
    amountTotal: number | null;
    currency: string | null;
    wantsPrint: boolean;
  },
): Promise<{
  zineTitle: string;
  zineId: string;
  amountPaid: string;
  outputsList: string;
  includesPrint: boolean;
  paidAt: string;
} | null> {
  let client;
  try {
    client = createAdminClient();
  } catch (err) {
    console.error('[stripe webhook] admin client failed for receipt', err);
    return null;
  }

  const { data, error } = await client
    .from('zines')
    .select('title, issue_number')
    .eq('id', zineId)
    .single();
  if (error || !data) {
    console.warn('[stripe webhook] zine not found for receipt', { zineId });
    return null;
  }
  const row = data as { title: string | null; issue_number: number };
  void stripeSessionId; // not used in props, just for log correlation

  const zineTitle = row.title?.trim() || `Issue ${row.issue_number}`;
  const amountPaid = formatAmount(stripeData.amountTotal, stripeData.currency);
  const outputsList = stripeData.outputs.map(prettifyOutput).join(', ') || 'Digital download';

  return {
    zineTitle,
    zineId,
    amountPaid,
    outputsList,
    includesPrint: stripeData.wantsPrint,
    paidAt: new Date().toISOString(),
  };
}

function formatAmount(amountTotal: number | null, currency: string | null): string {
  if (typeof amountTotal !== 'number') return '—';
  const code = (currency || 'usd').toUpperCase();
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(
      amountTotal / 100,
    );
  } catch {
    return `${(amountTotal / 100).toFixed(2)} ${code}`;
  }
}

function prettifyOutput(o: string): string {
  return (
    (
      {
        digital: 'Digital PDF',
        print: 'Printed copy',
        web: 'Web edition',
        social: 'Social crops',
      } as Record<string, string>
    )[o] ?? o
  );
}
