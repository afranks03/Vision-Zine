import type { Metadata } from 'next';
import { Eyebrow, HeavyRule, MetaRow } from '@/components/editorial';
import { NewZineForm } from './new-zine-form';

export const metadata: Metadata = {
  title: 'New zine',
};

export default function NewZinePage() {
  return (
    <div className="vz-container vz-section">
      <MetaRow
        className="mb-7"
        items={[<span key="d">Dashboard / New</span>, <span key="i">Issue setup</span>]}
      />
      <h1
        className="font-display leading-[0.9] font-normal tracking-[-0.02em]"
        style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}
      >
        Choose a <em>style</em>, then a <em>format</em>.
      </h1>
      <HeavyRule className="mt-6 mb-10" />

      <Eyebrow className="text-vz-coral">You can change either later</Eyebrow>
      <p className="vz-prose mt-3 max-w-2xl">
        Style sets the typographic personality of the zine. Format sets the physical size of the
        printed copy. Both swap instantly without losing any of the content you write.
      </p>

      <div className="mt-12">
        <NewZineForm />
      </div>
    </div>
  );
}
