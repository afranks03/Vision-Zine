import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signOut } from './actions';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-6 py-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Vision Zine</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Phase 0 smoke test</h1>
      </header>

      <section className="rounded-md border border-neutral-200 bg-neutral-50 p-6 text-sm">
        {user ? (
          <div className="flex flex-col gap-4">
            <p>
              Signed in as <span className="font-medium">{user.email}</span>
            </p>
            <p className="text-neutral-600">User ID: {user.id}</p>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>Not signed in.</p>
            <Button asChild size="sm">
              <Link href="/signin">Sign in with email</Link>
            </Button>
          </div>
        )}
      </section>

      <footer className="text-xs text-neutral-500">
        Foundation scaffold — Next.js <span className="font-mono">16</span>, Tailwind{' '}
        <span className="font-mono">4</span>, shadcn/ui, Supabase auth wired.
      </footer>
    </main>
  );
}
