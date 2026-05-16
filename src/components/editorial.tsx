/**
 * Editorial primitives — the small typographic / layout building blocks
 * lifted from /reference/Vision_3.0.html. Used throughout the marketing site.
 */
import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

/** Small caps label (Monocle-style eyebrow). 11px, Archivo 700, uppercase. */
export function Eyebrow({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('vz-eyebrow', className)} {...props}>
      {children}
    </p>
  );
}

/** Tinier label — 10px. For footer / meta. */
export function Meta({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('vz-meta', className)} {...props}>
      {children}
    </span>
  );
}

/** Inline filled circle "bullet" — the brand's separator. */
export function BulletDot({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('inline-block size-1.5 rounded-full bg-current', className)} />
  );
}

/** Circular numbered badge — 24px, ink/yellow by default. */
export function NumberedBadge({
  n,
  variant = 'default',
  className,
}: {
  n: number | string;
  variant?: 'default' | 'invert' | 'coral';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'vz-num-badge',
        variant === 'invert' && 'invert',
        variant === 'coral' && 'coral',
        className,
      )}
    >
      {n}
    </span>
  );
}

/** Section header — eyebrow + numbered badge, with optional rule below. */
export function SectionHeader({
  label,
  n,
  rule = true,
  className,
}: {
  label: string;
  n?: number | string;
  rule?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3.5',
        rule && 'border-vz-ink mb-4 border-b pb-3',
        className,
      )}
    >
      {n !== undefined && <NumberedBadge n={n} />}
      <Eyebrow>{label}</Eyebrow>
    </div>
  );
}

/** 2px ink rule — the kind under a feature head. */
export function HeavyRule({ className }: { className?: string }) {
  return <div className={cn('bg-vz-ink h-0.5 w-full', className)} aria-hidden />;
}

/** 1px hairline rule. */
export function HairlineRule({ className }: { className?: string }) {
  return <div className={cn('bg-vz-ink h-px w-full', className)} aria-hidden />;
}

/**
 * Status pill — small caps, hard rectangular, color-coded.
 *
 * Tone palette aligned with our brand tokens; intentionally not rounded
 * (rounded = SaaS-y; we keep the editorial slab look). Used on the
 * dashboard to surface zine + print_order state at a glance.
 */
export function StatusPill({
  tone,
  children,
  className,
}: {
  tone: 'neutral' | 'draft' | 'paid' | 'in_progress' | 'success' | 'warning' | 'muted';
  children: ReactNode;
  className?: string;
}) {
  const toneClass = {
    neutral: 'bg-vz-cream text-vz-ink border-vz-ink',
    draft: 'bg-vz-paper text-vz-ink border-vz-ink',
    paid: 'bg-vz-yellow text-vz-ink border-vz-ink',
    in_progress: 'bg-vz-coral text-vz-cream border-vz-coral',
    success: 'bg-vz-green text-vz-cream border-vz-green',
    warning: 'bg-vz-ink text-vz-yellow border-vz-ink',
    muted: 'bg-transparent text-vz-ink/60 border-vz-ink/30',
  }[tone];
  return (
    <span
      className={cn(
        'vz-eyebrow inline-flex items-center border px-2 py-[3px] leading-none',
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A line of eyebrow text with bullet dots between items. */
export function MetaRow({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <div className={cn('vz-eyebrow flex flex-wrap items-center gap-2.5', className)}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2.5">
          {i > 0 && <BulletDot />}
          {item}
        </span>
      ))}
    </div>
  );
}
