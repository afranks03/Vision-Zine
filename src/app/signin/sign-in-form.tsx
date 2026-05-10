'use client';

import { useState, useTransition } from 'react';
import { signInWithEmail } from '../actions';
import { Button } from '@/components/ui/button';

export function SignInForm() {
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
      <label className="text-xs uppercase tracking-wider text-neutral-500" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
      />
      <Button type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Send sign-in link'}
      </Button>
      {message && (
        <p
          className={`text-sm ${
            message.kind === 'ok' ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
