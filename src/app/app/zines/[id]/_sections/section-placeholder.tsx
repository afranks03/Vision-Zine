import { Eyebrow, HairlineRule } from '@/components/editorial';

/**
 * Stand-in for sections that aren't built yet. Shows what's coming and when,
 * so the studio always renders something useful even before AI / uploads /
 * co-author flows are wired.
 */
export function SectionPlaceholder({ title, reason }: { title: string; reason: string }) {
  return (
    <div className="flex flex-col gap-5">
      <header>
        <Eyebrow className="text-vz-coral">Section under construction</Eyebrow>
        <h2 className="font-display mt-2 text-4xl leading-[0.95] tracking-[-0.02em]">{title}</h2>
      </header>
      <HairlineRule />
      <p className="vz-prose text-base">{reason}</p>
      <p className="vz-prose text-vz-ink/70 text-sm">
        You can complete other sections in the meantime — your progress is saved per section.
      </p>
    </div>
  );
}
