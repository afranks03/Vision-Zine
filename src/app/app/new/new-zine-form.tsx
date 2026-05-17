'use client';

import { useState, useTransition } from 'react';
import { createZine } from '../_actions';
import { Eyebrow } from '@/components/editorial';
import type { ZineFormat, ZineStyle } from '@/lib/supabase/types';

const STYLES: { id: ZineStyle; name: string; tag: string; blurb: string; swatch: string }[] = [
  {
    id: 'editorial',
    name: 'Editorial',
    tag: 'The reference',
    blurb: 'Bold serif masthead, hairline rules, dramatic display headlines.',
    swatch: 'bg-vz-yellow text-vz-ink',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    tag: 'Slow & warm',
    blurb: 'Paper-forward, generous photography, Kinfolk-adjacent calm.',
    swatch: 'bg-vz-rose text-vz-ink',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    tag: 'High contrast',
    blurb: 'Bold blocks of color, italic captions, runway pacing.',
    swatch: 'bg-vz-coral text-vz-cream',
  },
  {
    id: 'art_catalog',
    name: 'Art Catalog',
    tag: 'Restrained',
    blurb: 'Museum-grade. White space, single-image spreads, quiet captions.',
    swatch: 'bg-vz-paper text-vz-ink',
  },
  {
    id: 'travel',
    name: 'Travel',
    tag: 'A journey',
    blurb: 'Map dividers, mileage tickers, postcard sidebars, ferry footers.',
    swatch: 'bg-vz-blue text-vz-cream',
  },
  {
    id: 'financial',
    name: 'Financial',
    tag: 'Annual report',
    blurb: 'Charts treated like covers. Footnotes in a serif you can love.',
    swatch: 'bg-vz-green text-vz-cream',
  },
];

const FORMATS: { id: ZineFormat; name: string; dims: string; note: string }[] = [
  {
    id: 'letter',
    name: 'Letter',
    dims: '8.5 × 11 in',
    note: 'The default — handles long reading.',
  },
  {
    id: 'pocket',
    name: 'Pocket',
    dims: '4.25 × 6.875 in',
    note: 'Mass-market paperback. The novel-on-the-plane scale.',
  },
];

export function NewZineForm() {
  const [style, setStyle] = useState<ZineStyle>('editorial');
  const [format, setFormat] = useState<ZineFormat>('letter');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await createZine({ style, format, title: title.trim() || undefined });
      if (result && 'error' in result) {
        setError(result.error);
      }
      // success path: server action redirects to /app/zines/[id]
    });
  }

  return (
    <div className="flex flex-col gap-12">
      {/* ---- Style ---- */}
      <div>
        <Eyebrow>Step 1 · Style</Eyebrow>
        <div className="border-vz-ink mt-4 grid grid-cols-1 border-l sm:grid-cols-2 lg:grid-cols-3">
          {STYLES.map((s) => {
            const selected = style === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                aria-pressed={selected}
                className={`${s.swatch} border-vz-ink relative flex min-h-[200px] cursor-pointer flex-col items-start gap-3 border-r border-b p-6 text-left transition-all hover:opacity-90 ${
                  selected ? 'ring-vz-ink z-10 ring-4 ring-offset-0' : 'ring-0'
                }`}
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <span className="font-display text-3xl leading-[0.9]">{s.name}</span>
                  <Eyebrow>{s.tag}</Eyebrow>
                </div>
                <p className="font-serif text-sm leading-relaxed">{s.blurb}</p>
                {selected && (
                  <span className="vz-meta mt-auto inline-flex items-center gap-1">
                    <span aria-hidden>✓</span> Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- Format ---- */}
      <div>
        <Eyebrow>Step 2 · Format</Eyebrow>
        <div className="border-vz-ink mt-4 grid grid-cols-1 border-l sm:grid-cols-3">
          {FORMATS.map((f) => {
            const selected = format === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                aria-pressed={selected}
                className={`bg-vz-paper text-vz-ink border-vz-ink hover:bg-vz-cream relative flex min-h-[160px] cursor-pointer flex-col items-start gap-2 border-r border-b p-6 text-left transition-all ${
                  selected ? 'ring-vz-coral bg-vz-cream z-10 ring-4' : 'ring-0'
                }`}
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <span className="font-display text-3xl leading-[0.9]">{f.name}</span>
                  <Eyebrow className="text-vz-coral">{f.dims}</Eyebrow>
                </div>
                <p className="font-serif text-sm leading-relaxed">{f.note}</p>
                {selected && (
                  <span className="vz-meta text-vz-coral mt-auto inline-flex items-center gap-1">
                    <span aria-hidden>✓</span> Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- Title (optional) ---- */}
      <div>
        <Eyebrow>Step 3 · Title (optional)</Eyebrow>
        <p className="vz-prose mt-2 max-w-xl text-base">
          The headline on your cover. You can leave this blank and we&apos;ll show &ldquo;Issue
          I.&rdquo;
        </p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. The Franks Forecast"
          className="border-vz-ink bg-vz-paper text-vz-ink placeholder:text-vz-ink/40 focus:border-vz-coral mt-4 w-full max-w-xl border-2 px-3 py-3 font-serif text-base transition-colors outline-none"
        />
      </div>

      {/* ---- Submit ---- */}
      <div className="border-vz-ink border-t pt-8">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={pending}
            className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream cursor-pointer px-5 py-3.5 transition-colors disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? 'Creating…' : 'Create issue'}
          </button>
          <span className="vz-meta text-vz-ink/60">
            We&apos;ll start a draft. Nothing is published until you choose to.
          </span>
        </div>
        {error && <p className="text-vz-coral mt-3 font-serif text-sm">{error}</p>}
      </div>
    </div>
  );
}
