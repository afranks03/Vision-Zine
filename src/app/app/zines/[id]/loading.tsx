import { Eyebrow, HairlineRule } from '@/components/editorial';

/**
 * Studio loading skeleton (Phase 5e). Mirrors the studio's two-column
 * layout (left rail + editor pane) so the chrome doesn't shift when
 * real content arrives.
 */
export default function StudioLoading() {
  return (
    <div className="vz-container py-7">
      <div className="border-vz-ink flex flex-wrap items-end justify-between gap-4 border-b pb-5">
        <div className="space-y-3">
          <div className="h-3 w-40 animate-pulse bg-vz-ink/10" />
          <div className="h-9 w-72 animate-pulse bg-vz-ink/12" />
        </div>
        <div className="h-9 w-28 animate-pulse bg-vz-ink/12" />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
        {/* Left rail */}
        <aside>
          <Eyebrow className="mb-3 text-vz-ink/40">Sections</Eyebrow>
          <ol className="border-vz-ink border-t">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="border-vz-ink border-b">
                <div className="flex items-center gap-3 px-1 py-3">
                  <span className="w-7 h-5 animate-pulse bg-vz-ink/10" />
                  <span className="h-4 flex-1 animate-pulse bg-vz-ink/8" />
                </div>
              </li>
            ))}
          </ol>
          <HairlineRule className="my-6" />
        </aside>

        {/* Editor pane */}
        <section className="bg-vz-paper border-vz-ink min-h-[480px] border p-8">
          <div className="space-y-5">
            <div className="h-3 w-32 animate-pulse bg-vz-ink/10" />
            <div className="h-9 w-2/3 animate-pulse bg-vz-ink/12" />
            <HairlineRule className="my-4 opacity-30" />
            <div className="h-4 w-full animate-pulse bg-vz-ink/8" />
            <div className="h-4 w-11/12 animate-pulse bg-vz-ink/8" />
            <div className="h-4 w-3/4 animate-pulse bg-vz-ink/8" />
            <div className="mt-6 h-36 w-full animate-pulse bg-vz-ink/8" />
          </div>
        </section>
      </div>
    </div>
  );
}
