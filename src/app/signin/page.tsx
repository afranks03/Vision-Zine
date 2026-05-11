import type { Metadata } from 'next';
import Link from 'next/link';
import { BulletDot, Eyebrow, Meta } from '@/components/editorial';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to Vision Zine with a magic link.',
};

export default function SignInPage() {
  return (
    <div className="bg-vz-cream text-vz-ink flex min-h-screen flex-col">
      <header className="vz-container flex h-16 items-center justify-between">
        <Link
          href="/"
          aria-label="Vision Zine — home"
          className="font-display flex items-center gap-2 text-2xl leading-none transition-opacity hover:opacity-70"
        >
          <span>Vision</span>
          <em className="text-vz-coral">Zine</em>
        </Link>
        <Meta className="hidden items-center gap-2.5 sm:flex">
          <BulletDot /> Issue I <BulletDot /> Spring {new Date().getFullYear()}
        </Meta>
      </header>

      <main className="flex flex-1 items-center justify-center px-5">
        <section className="vz-container-narrow w-full max-w-md">
          <div className="border-vz-ink bg-vz-paper border p-9">
            <Eyebrow className="text-vz-coral">From the desk</Eyebrow>
            <h1
              className="font-display mt-4 leading-[0.9] font-normal tracking-[-0.02em]"
              style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}
            >
              Sign in to <em>your zine</em>.
            </h1>
            <p className="vz-prose mt-3 text-base">
              We&apos;ll email you a link. No password needed.
            </p>
            <div className="mt-7">
              <SignInForm />
            </div>
          </div>
          <p className="vz-prose text-vz-ink/70 mt-6 text-center text-sm">
            New here? Same form — your account is created on first sign-in.
          </p>
        </section>
      </main>

      <footer className="vz-container py-7">
        <Meta className="text-vz-ink/60">© Vision Zine · Brooklyn × Athens</Meta>
      </footer>
    </div>
  );
}
