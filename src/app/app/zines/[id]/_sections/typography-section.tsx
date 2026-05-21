'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setTypographyPreset } from '@/app/app/_actions';
import { Eyebrow } from '@/components/editorial';
import type { ZineRow } from '@/lib/supabase/types';
import {
  TYPOGRAPHY_PRESETS,
  presetCssVars,
  type TypographyPreset,
} from '@/lib/typography/presets';

/**
 * Typography section (Phase 3d-ii). One control: pick one of five
 * curated font pairings. Each card shows a live type specimen rendered
 * in the preset's actual fonts, so the user can see the personality
 * before committing.
 */
export function TypographySection({ zine }: { zine: ZineRow }) {
  const [preset, setPreset] = useState<TypographyPreset>(zine.typography_preset);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function choose(next: TypographyPreset) {
    if (next === preset) return;
    setPreset(next);
    startTransition(async () => {
      const result = await setTypographyPreset(zine.id, next);
      if (result && 'error' in result) {
        alert(`Couldn't save: ${result.error}`);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-vz-ink border-b pb-4">
        <Eyebrow>Section · Typography</Eyebrow>
        <h2 className="font-display mt-1 text-3xl leading-[0.95]">The typeface</h2>
        <p className="vz-prose text-vz-ink/70 mt-2 max-w-prose text-sm">
          Five pairings, curated. Each is a complete editorial voice — a display face for the
          masthead and headlines, a body face for long-form reading, and a sans for labels.
          Changes apply across every spread of this issue.
        </p>
      </div>

      {/* Preset cards */}
      <ul className="grid gap-4">
        {Object.values(TYPOGRAPHY_PRESETS).map((cfg) => {
          const active = cfg.id === preset;
          return (
            <li key={cfg.id}>
              <button
                type="button"
                onClick={() => choose(cfg.id)}
                aria-pressed={active}
                className={`border-vz-ink group flex w-full flex-col gap-4 border p-5 text-left transition-colors ${
                  active ? 'bg-vz-ink' : 'bg-vz-cream hover:bg-vz-paper'
                }`}
              >
                {/* Header row — preset name + descriptor */}
                <div className="flex items-baseline justify-between gap-4">
                  <span
                    className={`vz-eyebrow ${active ? 'text-vz-yellow' : 'text-vz-ink'}`}
                  >
                    {cfg.name}
                  </span>
                  <span
                    className={`vz-meta ${
                      active ? 'text-vz-cream/70' : 'text-vz-ink/60'
                    } max-w-[60%] text-right`}
                  >
                    {cfg.description}
                  </span>
                </div>

                {/* Live type specimen rendered in the preset's fonts */}
                <div
                  className={`flex flex-col gap-2 border-t pt-4 ${
                    active ? 'border-vz-cream/30' : 'border-vz-ink/15'
                  }`}
                  style={presetCssVars(cfg.id)}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(36px, 5vw, 56px)',
                      lineHeight: 0.95,
                      letterSpacing: '-0.01em',
                      color: active ? 'var(--color-vz-cream, #f5efdd)' : '#0a0a0a',
                    }}
                  >
                    {cfg.sample.display}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 16,
                      lineHeight: 1.45,
                      fontStyle: 'italic',
                      color: active ? 'rgba(245,239,221,0.8)' : 'rgba(10,10,10,0.7)',
                    }}
                  >
                    {cfg.sample.body}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: active ? 'rgba(245,239,221,0.6)' : 'rgba(10,10,10,0.5)',
                      marginTop: 4,
                    }}
                  >
                    Display · Serif · Sans
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
