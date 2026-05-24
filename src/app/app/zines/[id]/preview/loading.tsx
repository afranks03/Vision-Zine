/**
 * Preview loading skeleton (Phase 5e). The real preview is a stack of
 * full-page spreads; we render two muted skeleton pages to keep
 * spatial parity while the data loads.
 */
export default function PreviewLoading() {
  return (
    <div className="bg-vz-oat min-h-screen">
      {/* Slim chrome placeholder — matches the sticky header height */}
      <div className="border-vz-ink/20 bg-vz-cream sticky top-0 z-50 h-14 border-b" />

      <div className="flex flex-col">
        {/* Two muted page-sized blocks */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="relative flex items-center justify-center"
            style={{
              minHeight: 'min(80vh, 900px)',
              background: i % 2 === 0 ? '#f5efdd' : '#faf6e9',
            }}
          >
            <div className="space-y-5 text-center">
              <p
                className="vz-eyebrow text-vz-ink/30"
                aria-live="polite"
              >
                Composing the issue…
              </p>
              <div className="h-12 w-72 animate-pulse bg-vz-ink/8 mx-auto" />
              <div className="h-3 w-48 animate-pulse bg-vz-ink/6 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
