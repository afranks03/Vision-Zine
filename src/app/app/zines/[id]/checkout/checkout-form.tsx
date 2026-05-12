'use client';

import { useState, useTransition } from 'react';
import { Eyebrow } from '@/components/editorial';
import { OUTPUTS, PRICING, PRICING_ORDER, type OutputId, type PricingTierId } from '@/lib/billing/pricing';
import { createCheckoutSession } from './_actions';

/**
 * Checkout form. Lets the user select desired outputs + pricing tier, then
 * submits via the server action which redirects to Stripe Checkout.
 */
export function CheckoutForm({ zineId }: { zineId: string }) {
  const [tier, setTier] = useState<PricingTierId>('one_issue');
  const [outputs, setOutputs] = useState<Record<OutputId, boolean>>({
    pdf: true,
    web: true,
    social: true,
    print: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggleOutput(id: OutputId) {
    setOutputs((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSubmit() {
    setError(null);
    const chosen = (Object.keys(outputs) as OutputId[]).filter((k) => outputs[k]);
    if (chosen.length === 0) {
      setError('Pick at least one output.');
      return;
    }
    startTransition(async () => {
      const result = await createCheckoutSession({ zineId, tier, outputs: chosen });
      if (result && 'error' in result && result.error) {
        setError(result.error);
      }
      // success path: server action redirects to Stripe Checkout
    });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Outputs */}
      <div>
        <Eyebrow>Step 1 · Outputs</Eyebrow>
        <div className="border-vz-ink mt-4 grid grid-cols-1 border-l sm:grid-cols-2">
          {OUTPUTS.map((o) => {
            const selected = outputs[o.id];
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => toggleOutput(o.id)}
                aria-pressed={selected}
                className={`border-vz-ink relative flex cursor-pointer flex-col items-start gap-2 border-r border-b p-6 text-left transition-all ${
                  selected
                    ? 'bg-vz-yellow text-vz-ink'
                    : 'bg-vz-paper text-vz-ink hover:bg-vz-cream'
                }`}
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <span className="font-display text-2xl leading-[0.95]">{o.name}</span>
                  <span
                    aria-hidden
                    className={`vz-meta ${selected ? 'text-vz-ink' : 'text-vz-ink/40'}`}
                  >
                    {selected ? '✓ on' : 'off'}
                  </span>
                </div>
                <p className="font-serif text-sm leading-relaxed">{o.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier */}
      <div>
        <Eyebrow>Step 2 · Tier</Eyebrow>
        <div className="border-vz-ink mt-4 grid grid-cols-1 border-l sm:grid-cols-2">
          {PRICING_ORDER.map((tierId) => {
            const t = PRICING[tierId];
            const selected = tier === tierId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTier(tierId)}
                aria-pressed={selected}
                className={`border-vz-ink relative flex min-h-[160px] cursor-pointer flex-col items-start gap-2 border-r border-b p-6 text-left transition-all ${
                  selected
                    ? t.primary
                      ? 'ring-vz-ink bg-vz-yellow text-vz-ink z-10 ring-4'
                      : 'ring-vz-coral bg-vz-paper text-vz-ink z-10 ring-4'
                    : 'bg-vz-paper text-vz-ink hover:bg-vz-cream'
                }`}
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <span className="font-display text-3xl leading-[0.9]">{t.name}</span>
                  <span className="font-display text-3xl leading-[0.9]">{t.display}</span>
                </div>
                <Eyebrow className="text-vz-coral">{t.cadence}</Eyebrow>
                <p className="font-serif text-sm leading-relaxed">{t.features[0]}</p>
                {selected && (
                  <span className="vz-meta mt-auto inline-flex items-center gap-1">✓ Selected</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <div className="border-vz-ink border-t pt-8">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={pending}
            className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream disabled:bg-vz-ink/40 cursor-pointer px-5 py-3.5 transition-colors disabled:cursor-wait"
          >
            {pending ? 'Redirecting to Stripe…' : `Pay ${PRICING[tier].display} →`}
          </button>
          <span className="vz-meta text-vz-ink/60">
            Stripe handles the card. You&apos;ll come back here when it&apos;s done.
          </span>
        </div>
        {error && <p className="font-serif text-vz-coral mt-3 text-sm">{error}</p>}
      </div>
    </div>
  );
}
