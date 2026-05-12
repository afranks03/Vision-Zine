import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, HeavyRule } from '@/components/editorial';

export const metadata: Metadata = {
  title: 'Checkout cancelled',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CheckoutCancelPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="vz-container-narrow vz-section">
      <Eyebrow className="text-vz-coral">Checkout cancelled</Eyebrow>
      <h1
        className="font-display mt-3 font-normal leading-[0.9] tracking-[-0.02em]"
        style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}
      >
        No charge. <em>Your draft is safe.</em>
      </h1>
      <HeavyRule className="mt-6 mb-10" />

      <p className="vz-prose max-w-2xl">
        Nothing was charged. Your zine sections, the AI-written copy, and your style choice
        are all still in the studio — come back when you&apos;re ready.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={`/app/zines/${id}/checkout`}
          className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream px-5 py-3.5 transition-colors"
        >
          Try again
        </Link>
        <Link
          href={`/app/zines/${id}`}
          className="vz-eyebrow border-vz-ink hover:bg-vz-ink hover:text-vz-yellow border px-5 py-3.5 transition-colors"
        >
          Back to studio
        </Link>
      </div>
    </div>
  );
}
