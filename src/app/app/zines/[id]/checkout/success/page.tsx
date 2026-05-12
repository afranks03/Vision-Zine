import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Eyebrow, HeavyRule, Meta } from '@/components/editorial';
import { createClient } from '@/lib/supabase/server';
import type { ZineRow } from '@/lib/supabase/types';

export const metadata: Metadata = {
  title: 'Payment received',
};

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { session_id } = await searchParams;

  const supabase = await createClient();
  const { data: zine, error } = await supabase
    .from('zines')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !zine) notFound();
  const typedZine = zine as ZineRow;
  const isPaid = typedZine.status === 'paid';

  return (
    <div className="vz-container-narrow vz-section">
      <Eyebrow className="text-vz-coral">Payment received</Eyebrow>
      <h1
        className="font-display mt-3 font-normal leading-[0.9] tracking-[-0.02em]"
        style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}
      >
        Thank you. <em>Your issue is queued.</em>
      </h1>
      <HeavyRule className="mt-6 mb-10" />

      <p className="vz-prose max-w-2xl">
        Stripe handled the payment. We&apos;ve marked{' '}
        <strong>{typedZine.title || `Issue ${typedZine.issue_number}`}</strong> as paid and
        we&apos;re generating the outputs you chose.
      </p>

      {!isPaid && (
        <p className="font-serif text-vz-coral mt-6 text-sm">
          (The webhook hasn&apos;t marked the zine paid yet — should arrive any second.
          Refresh in a moment if the status doesn&apos;t update.)
        </p>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={`/app/zines/${id}/preview`}
          className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream px-5 py-3.5 transition-colors"
        >
          Open the preview
        </Link>
        <Link
          href={`/app/zines/${id}`}
          className="vz-eyebrow border-vz-ink hover:bg-vz-ink hover:text-vz-yellow border px-5 py-3.5 transition-colors"
        >
          Back to studio
        </Link>
      </div>

      {session_id && (
        <Meta className="text-vz-ink/50 mt-10 block">
          Stripe session: <span className="font-mono">{session_id}</span>
        </Meta>
      )}
    </div>
  );
}
