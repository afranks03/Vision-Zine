import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BulletDot, Eyebrow, HeavyRule, Meta } from '@/components/editorial';
import { OUTPUTS, PRICING, PRICING_ORDER } from '@/lib/billing/pricing';
import { createClient } from '@/lib/supabase/server';
import type { ZineRow } from '@/lib/supabase/types';
import { CheckoutForm } from './checkout-form';

export const metadata: Metadata = {
  title: 'Get this issue',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CheckoutPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: zine, error } = await supabase.from('zines').select('*').eq('id', id).single();

  if (error || !zine) notFound();
  const typedZine = zine as ZineRow;

  return (
    <div className="vz-container vz-section">
      <Meta className="mb-7 flex items-center gap-2.5">
        <Link href={`/app/zines/${id}`} className="hover:text-vz-coral transition-colors">
          Studio
        </Link>
        <BulletDot />
        <span>Checkout</span>
        <BulletDot />
        <span>{typedZine.title || `Issue ${typedZine.issue_number}`}</span>
      </Meta>

      <h1
        className="font-display leading-[0.9] font-normal tracking-[-0.02em]"
        style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}
      >
        Get this <em>issue</em>.
      </h1>
      <HeavyRule className="mt-6 mb-10" />

      <Eyebrow className="text-vz-coral">Choose outputs and a tier</Eyebrow>
      <p className="vz-prose mt-3 max-w-2xl">
        Pick which outputs you want — the PDF, the web edition, social crops, the printed copy — and
        one of the two tiers. Both tiers include all four outputs; the annual tier renews and
        includes a co-author seat and a second print copy per issue.
      </p>

      {typedZine.status === 'paid' && (
        <div className="border-vz-coral bg-vz-paper mt-10 border-2 p-6">
          <Eyebrow className="text-vz-coral">Already paid</Eyebrow>
          <p className="vz-prose mt-2 text-base">
            This issue is already marked paid. You can re-download or order another copy from the{' '}
            <Link href={`/app/zines/${id}/preview`} className="underline">
              preview
            </Link>
            .
          </p>
        </div>
      )}

      <div className="mt-12">
        <CheckoutForm zineId={id} />
      </div>

      {/* Tier summary cards for reference */}
      <div className="mt-16">
        <Eyebrow>Tier comparison</Eyebrow>
        <div className="border-vz-ink mt-4 grid grid-cols-1 border-l md:grid-cols-2">
          {PRICING_ORDER.map((tierId) => {
            const tier = PRICING[tierId];
            return (
              <article
                key={tier.id}
                className={`border-vz-ink border-r border-b p-8 ${
                  tier.primary ? 'bg-vz-yellow text-vz-ink' : 'bg-vz-paper text-vz-ink'
                }`}
              >
                <div className="flex items-start justify-between">
                  <Eyebrow>{tier.cadence}</Eyebrow>
                  {tier.primary && (
                    <span className="vz-meta bg-vz-coral text-vz-cream px-2 py-1">Recommended</span>
                  )}
                </div>
                <h2 className="font-display mt-3 text-5xl leading-[0.9] tracking-[-0.02em]">
                  {tier.name}
                </h2>
                <p className="font-display mt-3 text-5xl leading-[0.85]">{tier.display}</p>
                <ul className="mt-6 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 font-serif text-sm leading-snug">
                      <BulletDot className="mt-2 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>

      {/* Outputs reference */}
      <div className="mt-12">
        <Eyebrow>What you get either way</Eyebrow>
        <div className="border-vz-ink mt-4 grid grid-cols-1 border-l sm:grid-cols-2">
          {OUTPUTS.map((o) => (
            <div key={o.id} className="border-vz-ink border-r border-b p-6">
              <h3 className="font-display text-2xl leading-tight">{o.name}</h3>
              <p className="text-vz-ink/75 mt-2 font-serif text-sm leading-relaxed">
                {o.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
