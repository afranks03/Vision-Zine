'use client';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="vz-eyebrow border-vz-ink hover:bg-vz-ink hover:text-vz-yellow cursor-pointer border px-3 py-2 transition-colors"
    >
      Print
    </button>
  );
}
