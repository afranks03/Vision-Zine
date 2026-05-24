import { Eyebrow, HeavyRule, MetaRow } from '@/components/editorial';

/**
 * Dashboard loading skeleton (Phase 5e). Shown during the initial
 * server fetch on /app. Matches the real dashboard layout closely
 * so the page doesn't jump when content lands.
 */
export default function DashboardLoading() {
  return (
    <div className="vz-container vz-section">
      <MetaRow
        className="mb-7"
        items={[<span key="d">Dashboard</span>, <span key="i">Loading issue index…</span>]}
      />

      <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
        <div className="h-[88px] w-full max-w-2xl animate-pulse bg-vz-ink/8" />
        <div className="h-12 w-40 animate-pulse bg-vz-ink/12" />
      </div>
      <HeavyRule className="mt-6" />

      {/* Row skeletons */}
      <ul className="mt-10 grid gap-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            key={i}
            className="border-vz-ink flex flex-col gap-4 border-t border-b py-7 sm:flex-row sm:items-end sm:gap-8"
            style={{ borderBottomWidth: i === 2 ? 1 : 0 }}
          >
            <div className="h-12 w-12 animate-pulse bg-vz-ink/15" />
            <div className="flex-1 space-y-3">
              <div className="h-7 w-2/3 animate-pulse bg-vz-ink/12" />
              <div className="h-3 w-1/2 animate-pulse bg-vz-ink/10" />
            </div>
            <div className="h-7 w-24 animate-pulse bg-vz-ink/12" />
          </li>
        ))}
      </ul>

      <Eyebrow className="text-vz-ink/35 mt-8 block">Loading…</Eyebrow>
    </div>
  );
}
