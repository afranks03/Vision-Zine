'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveSection } from '@/app/app/_actions';
import { Eyebrow, HairlineRule } from '@/components/editorial';
import type { PracticeContent, VisionContent } from '@/lib/supabase/types';

/**
 * The Practice (Phase 7). Six short reflective inputs the user fills out
 * before writing the Vision. Two visual groups:
 *
 *   Inward  — gratitude, forgiveness, grounding, spirituality
 *   Outward — environment, friend_circle
 *
 * All save on blur. Bottom of the section: a "Sharpen my Vision"
 * button that's wired up in 7c — disabled here as a placeholder.
 */

interface FieldDef {
  key: keyof PracticeContent;
  label: string;
  prompt: string;
}

const INWARD_FIELDS: FieldDef[] = [
  {
    key: 'gratitude',
    label: 'Gratitude',
    prompt: 'What are you carrying forward from this year?',
  },
  {
    key: 'forgiveness',
    label: 'Forgiveness',
    prompt: 'What are you releasing — others, yourself, the year itself?',
  },
  {
    key: 'grounding',
    label: 'Grounding',
    prompt: 'What holds you when the year gets hard?',
  },
  {
    key: 'spirituality',
    label: 'Spirituality',
    prompt: 'What do you orient toward, beyond the goals?',
  },
];

const OUTWARD_FIELDS: FieldDef[] = [
  {
    key: 'environment',
    label: 'Environment',
    prompt: 'Where do you live and work? What surrounds you — and what would you change?',
  },
  {
    key: 'friend_circle',
    label: 'Friend circle',
    prompt: 'Who’s in your inner circle this year? What does it ask of you, what does it give?',
  },
];

export function PracticeSection({
  zineId,
  initial,
  initialVision,
  displayName,
}: {
  zineId: string;
  initial: Partial<PracticeContent>;
  initialVision: Partial<VisionContent>;
  displayName?: string;
}) {
  const [fields, setFields] = useState<Partial<PracticeContent>>({
    gratitude: initial.gratitude ?? '',
    forgiveness: initial.forgiveness ?? '',
    grounding: initial.grounding ?? '',
    spirituality: initial.spirituality ?? '',
    environment: initial.environment ?? '',
    friend_circle: initial.friend_circle ?? '',
  });
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [refining, setRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);
  const [proposedVision, setProposedVision] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const currentVision = initialVision.statement?.trim() ?? '';

  function hasAnyField(): boolean {
    return Object.values(fields).some((v) => (v ?? '').trim().length > 0);
  }

  async function handleSharpen() {
    setRefineError(null);
    setProposedVision('');
    setRefining(true);
    try {
      const res = await fetch('/api/ai/refine-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_vision: currentVision || undefined,
          practice: fields,
          display_name: displayName,
        }),
      });
      if (!res.ok || !res.body) {
        // Try to extract a JSON error before falling back.
        let message = `Request failed (${res.status}).`;
        try {
          const data = (await res.json()) as { error?: string };
          if (data?.error) message = data.error;
        } catch {
          // not JSON — keep the generic message
        }
        throw new Error(message);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        acc += chunk;
        setProposedVision(acc);
      }
    } catch (err) {
      setRefineError(err instanceof Error ? err.message : 'Sharpen failed.');
      setProposedVision(null);
    } finally {
      setRefining(false);
    }
  }

  function handleAccept() {
    if (!proposedVision) return;
    startTransition(async () => {
      const result = await saveSection({
        zineId,
        sectionKey: 'vision',
        contentJson: { statement: proposedVision.trim() } as Record<string, unknown>,
      });
      if (result && 'error' in result) {
        alert(`Couldn’t save the revised Vision: ${result.error}`);
        return;
      }
      setProposedVision(null);
      router.refresh();
      // Quietly nudge them to the Vision section to confirm.
      router.push(`/app/zines/${zineId}?section=vision`);
    });
  }

  function handleReject() {
    setProposedVision(null);
    setRefineError(null);
  }

  function update(key: keyof PracticeContent, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function commit() {
    setSaving('saving');
    const trimmed: Record<string, string | undefined> = {};
    for (const [k, v] of Object.entries(fields)) {
      const t = (v ?? '').trim();
      if (t) trimmed[k] = t;
    }
    startTransition(async () => {
      const result = await saveSection({
        zineId,
        sectionKey: 'practice',
        contentJson: trimmed as Record<string, unknown>,
      });
      if (result && 'error' in result) {
        setSaving('idle');
        alert(`Couldn’t save: ${result.error}`);
      } else {
        setSaving('saved');
        setTimeout(() => setSaving('idle'), 1600);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-vz-ink border-b pb-4">
        <Eyebrow>Section · The Practice</Eyebrow>
        <h2 className="font-display mt-1 text-3xl leading-[0.95]">The Practice.</h2>
        <p className="vz-prose text-vz-ink/70 mt-2 max-w-prose text-sm">
          Six prompts to ask before you write the Vision. Treat them like opening a notebook in
          the morning — short, honest, not for an audience. Saves on blur.
        </p>
      </div>

      {/* Inward group */}
      <section className="space-y-5">
        <FieldGroupHeader title="Inward" subtitle="What's happening inside you" />
        <div className="space-y-5">
          {INWARD_FIELDS.map((f) => (
            <PracticeField
              key={f.key}
              def={f}
              value={fields[f.key] ?? ''}
              onChange={(v) => update(f.key, v)}
              onBlur={commit}
            />
          ))}
        </div>
      </section>

      <HairlineRule />

      {/* Outward group */}
      <section className="space-y-5">
        <FieldGroupHeader title="Outward" subtitle="What surrounds you" />
        <div className="space-y-5">
          {OUTWARD_FIELDS.map((f) => (
            <PracticeField
              key={f.key}
              def={f}
              value={fields[f.key] ?? ''}
              onChange={(v) => update(f.key, v)}
              onBlur={commit}
            />
          ))}
        </div>
      </section>

      {/* Save status + Sharpen-my-Vision (Phase 7c) */}
      <div className="border-vz-ink flex flex-wrap items-center justify-between gap-4 border-t pt-5">
        <p className="vz-meta text-vz-ink/55">
          {saving === 'saving' && <span className="text-vz-coral">Saving…</span>}
          {saving === 'saved' && <span className="text-vz-coral">Saved.</span>}
          {saving === 'idle' && <span>Six prompts, six honest paragraphs.</span>}
        </p>
        <button
          type="button"
          onClick={handleSharpen}
          disabled={refining || (!hasAnyField() && !currentVision)}
          className="vz-eyebrow border-vz-ink bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream border px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:bg-vz-ink/20 disabled:text-vz-ink/30"
        >
          {refining ? 'Reading the Practice…' : 'Sharpen my Vision'}
        </button>
      </div>

      {refineError && (
        <p className="vz-meta text-vz-coral border-vz-coral/30 border bg-vz-coral/5 px-3 py-2">
          {refineError}
        </p>
      )}

      {(proposedVision !== null || refining) && (
        <RefinedVisionPanel
          current={currentVision}
          proposed={proposedVision ?? ''}
          isStreaming={refining}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

/**
 * Side-by-side comparison panel. Current Vision on the left,
 * proposed (streaming) on the right. Accept overwrites the
 * Vision section; reject dismisses the panel.
 */
function RefinedVisionPanel({
  current,
  proposed,
  isStreaming,
  onAccept,
  onReject,
}: {
  current: string;
  proposed: string;
  isStreaming: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="border-vz-ink bg-vz-cream border p-6 space-y-4">
      <div className="flex items-baseline justify-between">
        <Eyebrow className="text-vz-coral">Proposed revision</Eyebrow>
        <span className="vz-meta text-vz-ink/55">
          {isStreaming ? 'Streaming…' : 'Read both. Accept to overwrite the Vision section.'}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <p className="vz-eyebrow text-vz-ink/55">Current</p>
          <div
            className="border-vz-ink/20 font-serif min-h-[180px] whitespace-pre-wrap border bg-white/40 px-4 py-3 text-sm leading-relaxed"
          >
            {current.length > 0 ? (
              current
            ) : (
              <span className="text-vz-ink/45 italic">(no Vision written yet)</span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <p className="vz-eyebrow text-vz-coral">Proposed</p>
          <div
            className="border-vz-coral/40 font-serif min-h-[180px] whitespace-pre-wrap border bg-white/60 px-4 py-3 text-sm leading-relaxed"
          >
            {proposed.length > 0 ? (
              proposed
            ) : (
              <span className="text-vz-ink/40 italic">…</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onAccept}
          disabled={isStreaming || proposed.trim().length === 0}
          className="vz-eyebrow border-vz-ink bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream border px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          Accept · overwrite Vision
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={isStreaming}
          className="vz-eyebrow border-vz-ink text-vz-ink hover:bg-vz-yellow border px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reject
        </button>
        <span className="vz-meta text-vz-ink/55 ml-auto">
          Accepted text replaces your Vision Statement. You can always edit it after.
        </span>
      </div>
    </div>
  );
}

function FieldGroupHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <Eyebrow className="text-vz-coral">{title}</Eyebrow>
      <span className="vz-meta text-vz-ink/55">{subtitle}</span>
    </div>
  );
}

function PracticeField({
  def,
  value,
  onChange,
  onBlur,
}: {
  def: FieldDef;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <div>
      <label className="vz-eyebrow text-vz-ink mb-1.5 block" htmlFor={`practice-${def.key}`}>
        {def.label}
      </label>
      <p className="vz-meta text-vz-ink/60 mb-2 italic">{def.prompt}</p>
      <textarea
        id={`practice-${def.key}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={4}
        className="border-vz-ink bg-vz-cream font-serif w-full border px-4 py-3 text-base leading-relaxed focus:outline-none"
      />
    </div>
  );
}
