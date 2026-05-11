'use client';

import { useCallback, useRef, useState } from 'react';

interface UseAIStreamOptions {
  endpoint: string;
}

interface StreamPayload {
  raw_input: string;
  display_name?: string;
}

/**
 * Client-side helper for calling our /api/ai/* streaming routes. POSTs the
 * payload, then reads the response body chunk-by-chunk, decoding UTF-8 text
 * and appending it to `output`. Supports cancellation via `cancel()`.
 */
export function useAIStream({ endpoint }: UseAIStreamOptions) {
  const [output, setOutput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (payload: StreamPayload) => {
      setError(null);
      setOutput('');
      setPending(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!res.ok) {
          // Routes return JSON for errors.
          let message = `Request failed (${res.status}).`;
          try {
            const data = (await res.json()) as { error?: string };
            if (data?.error) message = data.error;
          } catch {
            // ignore — fall back to status code message
          }
          throw new Error(message);
        }

        if (!res.body) {
          throw new Error('Response body is empty.');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');

        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            setOutput((prev) => prev + chunk);
          }
        }
      } catch (err) {
        if ((err as { name?: string })?.name === 'AbortError') {
          // user cancelled; not an error
        } else {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        setPending(false);
        abortRef.current = null;
      }
    },
    [endpoint],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    setOutput('');
    setError(null);
  }, []);

  return { output, pending, error, run, cancel, reset, setOutput };
}
