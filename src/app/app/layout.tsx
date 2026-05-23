import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signOut } from '@/app/actions';
import { Meta } from '@/components/editorial';
import { createClient } from '@/lib/supabase/server';

/**
 * /app — authenticated area. The layout enforces auth and renders the slim
 * app chrome (brand, dashboard link, sign out). Unauthenticated users are
 * bounced to /signin with a `next` parameter so they return here after auth.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin?next=/app');
  }

  return (
    <div className="bg-vz-oat text-vz-ink flex min-h-screen flex-col">
      {/* Studio chrome — sticky on screen, suppressed in print so the
          downloaded PDF and any browser-print don't pick up the
          authenticated UI (Dashboard nav, the user's email, Sign out).
          The Vision Zine wordmark is kept visible on screen but
          hidden in print too — covers + running heads carry the
          brand from page 1 onward, no need for it at the top of
          every PDF. */}
      <header className="bg-vz-cream border-vz-ink sticky top-0 z-50 border-b print:hidden">
        <nav className="vz-container flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link
              href="/app"
              aria-label="Vision Zine — dashboard"
              className="font-display flex items-center gap-2 text-2xl leading-none transition-opacity hover:opacity-70"
            >
              <span>Vision</span>
              <em className="text-vz-coral">Zine</em>
            </Link>
            <Link
              href="/app"
              className="vz-eyebrow text-vz-ink hover:text-vz-coral hidden transition-colors sm:inline-block"
            >
              Dashboard
            </Link>
            <Link
              href="/app/new"
              className="vz-eyebrow text-vz-ink hover:text-vz-coral hidden transition-colors sm:inline-block"
            >
              New zine
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Meta className="text-vz-ink/70 hidden md:inline-block">{user.email}</Meta>
            <form action={signOut}>
              <button
                type="submit"
                className="vz-eyebrow border-vz-ink text-vz-ink hover:bg-vz-ink hover:text-vz-yellow cursor-pointer border px-3 py-2 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
