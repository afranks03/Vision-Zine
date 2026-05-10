import { SignInForm } from './sign-in-form';

export default function SignInPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-16">
      <header>
        <p className="text-xs tracking-[0.2em] text-neutral-500 uppercase">Vision Zine</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-neutral-600">
          We&apos;ll email you a link. No password needed.
        </p>
      </header>
      <SignInForm />
    </main>
  );
}
