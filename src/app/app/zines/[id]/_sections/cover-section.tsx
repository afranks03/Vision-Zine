'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  clearCoverImage,
  setCoverAccent,
  setCoverFocalPoint,
  setCoverLayout,
  setCoverSubtitle,
  setZineTitle,
} from '@/app/app/_actions';
import { Eyebrow } from '@/components/editorial';
import type { CoverAccent, CoverLayout, ZineRow } from '@/lib/supabase/types';

/**
 * Cover composer (Phase 3d-i-b). Five controls stack vertically:
 *   1. Title + Subtitle (text inputs, debounced server-saved on blur)
 *   2. Layout picker — five named cards
 *   3. Accent palette — six color swatches
 *   4. Cover photograph — upload zone + focal-point picker
 *
 * Each control commits to the server independently. We use
 * router.refresh() rather than client-cached state so the preview
 * (server-rendered) gets the new values without a full reload.
 */

const LAYOUTS: { id: CoverLayout; name: string; description: string }[] = [
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Full-bleed photograph, masthead in accent color, name vertical right edge.',
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Full-bleed photograph, lowercase masthead vertical left, quiet.',
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Block masthead in corner, title set as scattered letters over photo.',
  },
  {
    id: 'daily_life',
    name: 'Daily Life',
    description: 'Centered photograph, calm sans masthead, contributor strip on the spine.',
  },
  {
    id: 'big_type',
    name: 'Big Type',
    description: 'No photograph. The title fills the cover. Type-as-poster.',
  },
];

const ACCENTS: { id: CoverAccent; label: string; hex: string }[] = [
  { id: 'coral', label: 'Coral', hex: '#E8584C' },
  { id: 'yellow', label: 'Yellow', hex: '#FFD629' },
  { id: 'magenta', label: 'Magenta', hex: '#D62B7E' },
  { id: 'blue', label: 'Deep Blue', hex: '#1F4E89' },
  { id: 'green', label: 'Forest', hex: '#2A6E3F' },
  { id: 'ink', label: 'Ink', hex: '#0A0A0A' },
];

export function CoverSection({
  zine,
  initialCoverUrl,
}: {
  zine: ZineRow;
  initialCoverUrl: string | null;
}) {
  const [title, setTitle] = useState(zine.title ?? '');
  const [subtitle, setSubtitle] = useState(zine.cover_subtitle ?? '');
  const [layout, setLayout] = useState<CoverLayout>(zine.cover_layout);
  const [accent, setAccent] = useState<CoverAccent>(zine.cover_accent);
  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverUrl);
  const [focal, setFocal] = useState({
    x: zine.cover_image_focal_x,
    y: zine.cover_image_focal_y,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function withTransition<T>(p: Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const v = await p;
          router.refresh();
          resolve(v);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  function commitTitle() {
    if (title === (zine.title ?? '')) return;
    void withTransition(setZineTitle(zine.id, title));
  }

  function commitSubtitle() {
    if (subtitle === (zine.cover_subtitle ?? '')) return;
    void withTransition(setCoverSubtitle(zine.id, subtitle));
  }

  function chooseLayout(next: CoverLayout) {
    if (next === layout) return;
    setLayout(next);
    void withTransition(setCoverLayout(zine.id, next));
  }

  function chooseAccent(next: CoverAccent) {
    if (next === accent) return;
    setAccent(next);
    void withTransition(setCoverAccent(zine.id, next));
  }

  async function handleUpload(file: File) {
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`/api/zines/${zine.id}/cover`, {
        method: 'POST',
        body: fd,
      });
      const body = (await res.json()) as { ok?: boolean; signedUrl?: string; error?: string };
      if (!res.ok || !body.signedUrl) {
        throw new Error(body.error ?? `Upload failed (${res.status})`);
      }
      setCoverUrl(body.signedUrl);
      setFocal({ x: 0.5, y: 0.5 });
      router.refresh();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    if (!coverUrl) return;
    if (!confirm('Remove the cover photograph?')) return;
    setCoverUrl(null);
    void withTransition(clearCoverImage(zine.id));
  }

  function handleFocalChange(nx: number, ny: number) {
    setFocal({ x: nx, y: ny });
    void withTransition(setCoverFocalPoint(zine.id, nx, ny));
  }

  const isPhotoLayout = layout !== 'big_type';

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-vz-ink border-b pb-4">
        <Eyebrow>Section · Cover</Eyebrow>
        <h2 className="font-display mt-1 text-3xl leading-[0.95]">The cover</h2>
        <p className="vz-prose text-vz-ink/70 mt-2 max-w-prose text-sm">
          The first thing anyone sees. Pick a layout, set the title, and (for four of the five
          layouts) upload a hero photograph. Drag the focal point to keep the subject in frame.
        </p>
      </div>

      {/* Title + Subtitle */}
      <section className="space-y-5">
        <div>
          <label className="vz-eyebrow text-vz-ink mb-2 block" htmlFor="cover-title">
            Title
          </label>
          <input
            id="cover-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitTitle}
            placeholder="The Broadwater Chronicle"
            className="border-vz-ink bg-vz-cream font-display w-full border px-4 py-3 text-2xl leading-tight tracking-tight focus:outline-none"
          />
          <p className="vz-meta text-vz-ink/50 mt-2">
            Saves on blur. Used as the masthead in every layout.
          </p>
        </div>

        <div>
          <label className="vz-eyebrow text-vz-ink mb-2 block" htmlFor="cover-subtitle">
            Cover line (optional)
          </label>
          <input
            id="cover-subtitle"
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            onBlur={commitSubtitle}
            placeholder="A magazine of departures"
            className="border-vz-ink bg-vz-cream font-serif w-full border px-4 py-3 text-base italic focus:outline-none"
          />
          <p className="vz-meta text-vz-ink/50 mt-2">
            One short line shown near the cover photo. Fashion / Travel / Design / Daily Life only.
          </p>
        </div>
      </section>

      {/* Layout picker */}
      <section>
        <Eyebrow className="text-vz-ink mb-3">Layout</Eyebrow>
        <ul className="grid gap-3 sm:grid-cols-2">
          {LAYOUTS.map((l) => {
            const active = l.id === layout;
            return (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => chooseLayout(l.id)}
                  className={`border-vz-ink group flex w-full flex-col items-start gap-1.5 border p-4 text-left transition-colors ${
                    active
                      ? 'bg-vz-ink text-vz-yellow'
                      : 'bg-vz-cream text-vz-ink hover:bg-vz-yellow'
                  }`}
                >
                  <span className="vz-eyebrow">{l.name}</span>
                  <span
                    className={`font-serif text-sm leading-snug ${
                      active ? 'text-vz-cream/85' : 'text-vz-ink/75'
                    }`}
                  >
                    {l.description}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Accent palette */}
      <section>
        <Eyebrow className="text-vz-ink mb-3">Accent color</Eyebrow>
        <div className="flex flex-wrap gap-3">
          {ACCENTS.map((a) => {
            const active = a.id === accent;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => chooseAccent(a.id)}
                title={a.label}
                aria-label={a.label}
                aria-pressed={active}
                className={`border-vz-ink relative size-14 border transition-transform ${
                  active ? 'ring-vz-ink scale-105 ring-2 ring-offset-2 ring-offset-vz-paper' : 'hover:scale-105'
                }`}
                style={{ background: a.hex }}
              >
                <span className="sr-only">{a.label}</span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute right-1 bottom-1 size-1.5 rounded-full bg-white shadow-[0_0_0_1px_#0a0a0a]"
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className="vz-meta text-vz-ink/50 mt-2">
          Six brand-locked swatches. One accent per zine — used as the masthead emphasis (Fashion),
          block fill (Design), or scattered letter highlight.
        </p>
      </section>

      {/* Cover photograph */}
      <section className={isPhotoLayout ? '' : 'opacity-60'}>
        <div className="flex items-baseline justify-between">
          <Eyebrow className="text-vz-ink">Photograph</Eyebrow>
          {!isPhotoLayout && (
            <Eyebrow className="text-vz-ink/40">Not used by Big Type</Eyebrow>
          )}
        </div>

        {coverUrl ? (
          <div className="mt-3 space-y-4">
            <FocalPointPicker
              imageUrl={coverUrl}
              focalX={focal.x}
              focalY={focal.y}
              onChange={handleFocalChange}
              disabled={!isPhotoLayout}
            />
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleUpload(f);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="vz-eyebrow border-vz-ink bg-vz-cream text-vz-ink hover:bg-vz-yellow border px-3 py-2 transition-colors disabled:cursor-wait disabled:opacity-60"
              >
                {uploading ? 'Uploading…' : 'Replace photograph'}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="vz-eyebrow text-vz-coral hover:text-vz-ink transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <UploadZone
            uploading={uploading}
            disabled={!isPhotoLayout}
            error={uploadError}
            onFile={handleUpload}
          />
        )}
      </section>
    </div>
  );
}

/* ----- subcomponents ----- */

function UploadZone({
  uploading,
  disabled,
  error,
  onFile,
}: {
  uploading: boolean;
  disabled: boolean;
  error: string | null;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={`border-vz-ink mt-3 flex flex-col items-center justify-center gap-2 border border-dashed py-12 text-center transition-colors ${
        dragOver ? 'bg-vz-yellow' : 'bg-vz-cream'
      } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled || uploading}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = '';
        }}
      />
      <p className="font-display text-vz-ink/80 text-lg">
        {uploading ? 'Uploading…' : 'Drop a photograph here'}
      </p>
      <p className="vz-meta text-vz-ink/50">
        or click to pick a file · JPG, PNG, WebP · up to 12 MB
      </p>
      {error && (
        <p className="font-serif text-vz-coral mt-3 max-w-prose text-sm">{error}</p>
      )}
    </div>
  );
}

/**
 * Focal-point picker. Click or drag anywhere on the image to set
 * (focal_x, focal_y) as 0..1 ratios. The dot follows the pointer; on
 * pointer-up we commit to the server.
 *
 * Pointer-based (works with mouse + touch). We track our own pointer
 * id to avoid losing the gesture when the user drags outside the box.
 */
function FocalPointPicker({
  imageUrl,
  focalX,
  focalY,
  onChange,
  disabled,
}: {
  imageUrl: string;
  focalX: number;
  focalY: number;
  onChange: (x: number, y: number) => void;
  disabled?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [draftX, setDraftX] = useState(focalX);
  const [draftY, setDraftY] = useState(focalY);
  const [dragging, setDragging] = useState(false);

  function computeFromEvent(e: React.PointerEvent | PointerEvent) {
    const wrap = wrapRef.current;
    if (!wrap) return null;
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return { x: clamp01(x), y: clamp01(y) };
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (disabled) return;
    e.preventDefault();
    const p = computeFromEvent(e);
    if (!p) return;
    setDraftX(p.x);
    setDraftY(p.y);
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const p = computeFromEvent(e);
    if (!p) return;
    setDraftX(p.x);
    setDraftY(p.y);
  }

  function handlePointerUp() {
    if (!dragging) return;
    setDragging(false);
    onChange(draftX, draftY);
  }

  // External state changes (e.g., parent reset) override the draft.
  // We accept incoming props as the source of truth when not dragging.
  if (!dragging && (draftX !== focalX || draftY !== focalY)) {
    setDraftX(focalX);
    setDraftY(focalY);
  }

  return (
    <div className="space-y-2">
      <div
        ref={wrapRef}
        className="border-vz-ink relative w-full overflow-hidden border select-none"
        style={{ aspectRatio: '3 / 4', touchAction: 'none', maxHeight: 480 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Cover photograph preview"
          draggable={false}
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: `${draftX * 100}% ${draftY * 100}%` }}
        />
        {/* Focal-point indicator — crosshair-style ring at (draftX, draftY) */}
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: `${draftX * 100}%`,
            top: `${draftY * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="size-7 rounded-full border-2 border-white shadow-[0_0_0_2px_#0a0a0a,0_1px_8px_rgba(0,0,0,0.6)]"
            style={{ background: 'rgba(255,255,255,0.18)' }}
          />
        </div>
      </div>
      <p className="vz-meta text-vz-ink/60">
        Drag anywhere on the image to set the focal point. Subject stays in frame across all
        cover layouts.
      </p>
    </div>
  );
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0.5;
  return Math.max(0, Math.min(1, n));
}
