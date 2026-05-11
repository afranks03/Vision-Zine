import { MarketingFooter } from '@/components/marketing-footer';
import { MarketingNav } from '@/components/marketing-nav';
import { createClient } from '@/lib/supabase/server';

/**
 * Marketing route group layout. Wraps all public-facing pages
 * (/, /examples, /pricing, /about, /faq) with a shared nav + footer.
 * Reads the current Supabase user server-side so the nav can show
 * "Sign in" vs "Sign out" without flicker.
 */
export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav userEmail={user?.email} />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
