'use client';

import { useState, useTransition } from 'react';
import { signInWithEmail } from '../actions';

export function SignInForm({ next }: { next?: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await signInWithEmail(formData);
      if (result?.error) setMessage({ kind: 'error', text: result.error });
      else setMessage({ kind: 'ok', text: 'Check your inbox for a sign-in link.' });
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-3">
      <label className="vz-meta text-vz-ink" htmlFor="email">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="border-vz-ink bg-vz-paper text-vz-ink placeholder:text-vz-ink/40 focus:border-vz-coral focus:ring-vz-coral border-2 px-3 py-3 font-serif text-base transition-colors outline-none"
      />
      {/* Pass along where the user was trying to go (default /app). */}
      <input type="hidden" name="next" value={next ?? '/app'} />
      <button
        type="submit"
        disabled={pending}
        className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream mt-1 cursor-pointer px-4 py-3 transition-colors disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send sign-in link'}
      </button>
      {message && (
        <p
          className={`font-serif text-sm ${
            message.kind === 'ok' ? 'text-vz-green' : 'text-vz-coral'
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
