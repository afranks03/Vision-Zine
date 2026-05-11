'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const next = String(formData.get('next') ?? '').trim() || '/app';
  if (!email) return { error: 'Email is required.' };

  // Allow only same-origin redirects to prevent open-redirect via magic link.
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/app';

  const callback = new URL('/auth/callback', process.env.NEXT_PUBLIC_SITE_URL);
  callback.searchParams.set('next', safeNext);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callback.toString(),
    },
  });

  if (error) return { error: error.message };
  return { ok: true };
}
