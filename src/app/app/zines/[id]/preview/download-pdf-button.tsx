'use client';

import { useState } from 'react';

export function DownloadPdfButton({ zineId }: { zineId: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/zines/${zineId}/pdf`, { method: 'GET' });
      if (!res.ok) {
        let message = `Failed (HTTP ${res.status}).`;
        try {
          const data = (await res.json()) as { error?: string };
          if (data?.error) message = data.error;
        } catch {
          // ignore — fall back to status
        }
        throw new Error(message);
      }
      const blob = await res.blob();
      const cd = res.headers.get('Content-Disposition') ?? '';
      const match = cd.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? 'vision-zine.pdf';

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleDownload}
        disabled={pending}
        className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream disabled:bg-vz-ink/40 cursor-pointer px-3 py-2 transition-colors disabled:cursor-wait"
      >
        {pending ? 'Generating…' : 'Download PDF'}
      </button>
      {error && <span className="font-serif text-vz-coral text-xs">{error}</span>}
    </div>
  );
}
