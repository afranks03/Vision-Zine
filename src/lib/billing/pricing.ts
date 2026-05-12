/**
 * Pricing tiers. Dollar amounts are placeholders per DECISIONS.md
 * (deferred until prototype validates). Adrian sets real amounts here +
 * (optionally) creates Stripe Product/Price objects and pins their IDs
 * via STRIPE_PRICE_ONE_ISSUE / STRIPE_PRICE_ANNUAL env vars.
 *
 * For test mode, we use `price_data` inline on each Checkout Session —
 * no Stripe dashboard setup required.
 */

export type PricingTierId = 'one_issue' | 'annual';

export interface PricingTier {
  id: PricingTierId;
  name: string;
  /** Price in USD cents — the unit Stripe wants. */
  amountCents: number;
  /** Display string for the UI. */
  display: string;
  cadence: string;
  /** Stripe Checkout Session mode. */
  mode: 'payment' | 'subscription';
  /** For subscription mode, the recurring interval. */
  interval?: 'month' | 'year';
  /** Feature copy. */
  features: string[];
  primary?: boolean;
}

export const PRICING: Record<PricingTierId, PricingTier> = {
  one_issue: {
    id: 'one_issue',
    name: 'One Issue',
    amountCents: 2900,
    display: '$29',
    cadence: 'One-time · this zine',
    mode: 'payment',
    features: [
      'Print-ready PDF at your chosen size',
      'Public web edition with shareable URL',
      'Social crops (1080×1080, 1080×1920, 1200×630)',
      'One printed copy shipped to your door',
    ],
    primary: true,
  },
  annual: {
    id: 'annual',
    name: 'Annual',
    amountCents: 9900,
    display: '$99',
    cadence: 'Per year · billed once',
    mode: 'subscription',
    interval: 'year',
    features: [
      'Everything in One Issue',
      'Issue duplication with year-on-year diffs',
      'Annual reminder + reissue flow',
      'Co-author seat included',
      'Two printed copies per issue',
    ],
  },
};

export const PRICING_ORDER: PricingTierId[] = ['one_issue', 'annual'];

/** Optional Stripe Price ID override per tier — set in env if you want
 * to anchor to pre-created Products/Prices in the dashboard. Otherwise
 * we use inline price_data on each Checkout Session. */
export function priceIdFor(tier: PricingTierId): string | null {
  if (tier === 'one_issue') return process.env.STRIPE_PRICE_ONE_ISSUE ?? null;
  if (tier === 'annual') return process.env.STRIPE_PRICE_ANNUAL ?? null;
  return null;
}

/* ---- Output selections (independent of tier — for the chooser UI) ---- */

export type OutputId = 'pdf' | 'web' | 'social' | 'print';

export interface OutputOption {
  id: OutputId;
  name: string;
  description: string;
  requiresPaid: boolean;
}

export const OUTPUTS: OutputOption[] = [
  {
    id: 'pdf',
    name: 'Print-ready PDF',
    description: 'Letter, Tabloid, or Pocket. Print at home or hand to a printer.',
    requiresPaid: true,
  },
  {
    id: 'web',
    name: 'Web edition',
    description: 'A shareable URL with full editorial layout and social previews.',
    requiresPaid: true,
  },
  {
    id: 'social',
    name: 'Social crops',
    description: '1080×1080 (Instagram), 1080×1920 (Stories), 1200×630 (OG).',
    requiresPaid: true,
  },
  {
    id: 'print',
    name: 'Printed copy',
    description: 'One bound copy shipped to your door via Lulu xPress.',
    requiresPaid: true,
  },
];
