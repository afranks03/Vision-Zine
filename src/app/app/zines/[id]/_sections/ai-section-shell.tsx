'use client';

import { type ReactNode, useState, useTransition } from 'react';
import { saveSection } from '@/app/app/_actions';
import { Eyebrow, HairlineRule } from '@/components/editorial';
import { useAIStream } from '@/lib/ai/use-stream';
import type { SectionContent, SectionKey } from '@/lib/supabase/types';
import { textareaClass } from './section-shell';

/**
 * Shared shell for AI-assisted sections. Same overall shape as the non-AI
 * shell, plus an input textarea, a "Suggest" button that streams from the
 * given /api/ai/* endpoint, an output textarea the user can edit, and an
 * Accept button that persists into zine_data.
 */
export function AISectionShell<K extends SectionKey>({
  zineId,
  sectionKey,
  endpoint,
  title,
  eyebrow,
  intro,
  inputLabel,
  inputPlaceholder,
  outputLabel,
  suggestLabel,
  initialRawInput,
  initialOutput,
  buildContent,
  displayName,
}: {
  zineId: string;
  sectionKey: K;
  endpoint: string;
  title: ReactNode;
  eyebrow: string;
  intro?: ReactNode;
  inputLabel: string;
  inputPlaceholder?: string;
  outputLabel: string;
  suggestLabel: string;
  initialRawInput?: string;
  initialOutput?: string;
  /** Map the freeform output text into the section's typed content payload. */
  buildContent: (params: { rawInput: string; output: string }) => SectionContent<K>;
  /** Optional display name to send with the AI request. */
  displayName?: string;
}) {
  const [rawInput, setRawInput] = useState(initialRawInput ?? '');
  const [savePending, startSave] = useTransition();
  const [saveMessage, setSaveMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(
    null,
  );

  const {
    output,
    pending: streaming,
    error: streamError,
    run,
    cancel,
    reset,
    setOutput,
  } = useAIStream({ endpoint });

  // Seed the editor with whatever was last saved.
  const [editableOutput, setEditableOutputState] = useState(initialOutput ?? '');
  // When the streaming value updates, mirror it to the editable field.
  const displayOutput = streaming || output ? output : editableOutput;

  function handleSuggest() {
    setSaveMessage(null);
    if (!rawInput.trim()) return;
    void run({ raw_input: rawInput, display_name: displayName });
  }

  function handleAccept() {
    setSaveMessage(null);
    const text = (streaming || output ? output : editableOutput).trim();
    if (!text) {
      setSaveMessage({ kind: 'error', text: 'Nothing to save yet.' });
      return;
    }
    startSave(async () => {
      const result = await saveSection({
        zineId,
        sectionKey,
        contentJson: buildContent({ rawInput, output: text }) as Record<string, unknown>,
      });
      if (result && 'error' in result && result.error) {
        setSaveMessage({ kind: 'error', text: result.error });
      } else {
        setEditableOutputState(text);
        setOutput('');
        reset();
        setSaveMessage({ kind: 'ok', text: 'Saved.' });
      }
    });
  }

  function handleDiscard() {
    reset();
    setOutput('');
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Eyebrow className="text-vz-coral">{eyebrow}</Eyebrow>
        <h2 className="font-display mt-2 text-4xl leading-[0.95] tracking-[-0.02em]">{title}</h2>
        {intro && <p className="vz-prose mt-3 text-base">{intro}</p>}
      </header>
      <HairlineRule />

      {/* Input */}
      <label className="flex flex-col gap-2">
        <span className="vz-meta text-vz-ink">{inputLabel}</span>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          rows={6}
          placeholder={inputPlaceholder}
          disabled={streaming}
          className={textareaClass}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={streaming ? cancel : handleSuggest}
          disabled={!streaming && !rawInput.trim()}
          className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream disabled:bg-vz-ink/40 cursor-pointer px-4 py-3 transition-colors disabled:cursor-not-allowed"
        >
          {streaming ? 'Stop' : suggestLabel}
        </button>
        {streaming && <span className="vz-meta text-vz-coral">Streaming…</span>}
        {streamError && <span className="text-vz-coral font-serif text-sm">{streamError}</span>}
      </div>

      <HairlineRule />

      {/* Output (editable) */}
      <label className="flex flex-col gap-2">
        <span className="vz-meta text-vz-ink">{outputLabel}</span>
        <textarea
          value={displayOutput}
          onChange={(e) => {
            if (streaming) return;
            setEditableOutputState(e.target.value);
            setOutput(e.target.value);
          }}
          rows={10}
          placeholder="Click the suggest button above to generate a draft, then edit here."
          className={`${textareaClass} min-h-[200px]`}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleAccept}
          disabled={savePending || streaming}
          className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream disabled:bg-vz-ink/40 cursor-pointer px-4 py-3 transition-colors disabled:cursor-not-allowed"
        >
          {savePending ? 'Saving…' : 'Accept & save'}
        </button>
        <button
          type="button"
          onClick={handleDiscard}
          disabled={savePending || streaming}
          className="vz-eyebrow border-vz-ink text-vz-ink hover:bg-vz-ink hover:text-vz-yellow cursor-pointer border px-4 py-3 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          Discard draft
        </button>
        {saveMessage && (
          <span
            className={`font-serif text-sm ${
              saveMessage.kind === 'ok' ? 'text-vz-green' : 'text-vz-coral'
            }`}
          >
            {saveMessage.text}
          </span>
        )}
      </div>
    </div>
  );
}
