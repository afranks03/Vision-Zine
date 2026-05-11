import Link from 'next/link';
import { signOut } from '@/app/actions';
import { Eyebrow } from '@/components/editorial';
import { cn } from '@/lib/utils';

interface MarketingNavProps {
  userEmail?: string | null;
}

const NAV_LINKS = [
  { href: '/examples', label: 'Examples' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];

export function MarketingNav({ userEmail }: MarketingNavProps) {
  return (
    <header className="bg-vz-oat border-vz-ink sticky top-0 z-50 border-b backdrop-blur-sm">
      <nav className="vz-container flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="Vision Zine — home"
          className="font-display flex items-center gap-2 text-2xl leading-none transition-opacity hover:opacity-70"
        >
          <span>Vision</span>
          <em className="text-vz-coral">Zine</em>
        </Link>

        <ul className="hidden items-center gap-7 sm:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'vz-eyebrow text-vz-ink hover:text-vz-coral transition-colors',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {userEmail ? (
            <SignedInActions email={userEmail} />
          ) : (
            <Link
              href="/signin"
              className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream px-3 py-2 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function SignedInActions({ email }: { email: string }) {
  return (
    <div className="flex items-center gap-3">
      <Eyebrow className="hidden md:inline-block">{email}</Eyebrow>
      <form action={signOut}>
        <button
          type="submit"
          className="vz-eyebrow border-vz-ink text-vz-ink hover:bg-vz-ink hover:text-vz-yellow cursor-pointer border px-3 py-2 transition-colors"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
