# Vision Zine

Editorial-quality vision boards, printed.

This repo is the SaaS web app described in [`BRIEF.md`](./BRIEF.md). Live status of the build is in [`PROGRESS.md`](./PROGRESS.md). Architectural decisions live in [`DECISIONS.md`](./DECISIONS.md). Open questions for the founder are in [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md). Phased roadmap is in [`PLAN.md`](./PLAN.md).

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript 5**
- **Tailwind CSS v4** (CSS-first config)
- **shadcn/ui** (Radix primitives, Nova preset — Geist + Lucide)
- **Supabase** (Postgres + Auth + Storage)
- **Vercel** (hosting, planned)
- **pnpm 11** (package manager)

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm build        # production build
pnpm format       # prettier --write .
```

A pre-commit hook (Husky + lint-staged) runs Prettier and ESLint on staged files.

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values. `.env.local` is gitignored.

| Variable | Required by | Notes |
|----------|-------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Phase 0+ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Phase 0+ | Browser-safe anon-equivalent (`sb_publishable_*`) |
| `SUPABASE_SECRET_KEY` | Phase 0+ | Server-only, bypasses RLS (`sb_secret_*`) |
| `NEXT_PUBLIC_SITE_URL` | Phase 0+ | Origin used for OG and email links |
| `ANTHROPIC_API_KEY` | Phase 2 | Claude Sonnet 4.6 (server-only) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Phase 4 | Stripe Checkout |
| `RESEND_API_KEY` | Phase 5 | Transactional email |
| `LULU_CLIENT_KEY`, `LULU_CLIENT_SECRET`, `LULU_API_BASE` | Phase 4 | Print fulfillment (sandbox first) |

## Project structure

```
src/
  app/
    page.tsx            # Phase 0 smoke test (auth state)
    layout.tsx          # Root layout (Geist fonts)
    actions.ts          # Server actions (sign in, sign out)
    signin/             # Magic-link sign-in form
    auth/callback/      # OAuth/magic-link redirect handler
  components/
    ui/                 # shadcn/ui primitives
  lib/
    supabase/
      client.ts         # Browser Supabase client
      server.ts         # Server Supabase client (cookie-aware)
      middleware.ts     # Session refresh helper
    utils.ts            # cn() helper
  middleware.ts         # Edge middleware (refreshes Supabase session)
reference/              # Vision_3.0.html + Vision_3.0.pdf (design canon)
```

## Smoke test

```bash
pnpm dev
# visit http://localhost:3000
# expected: "Phase 0 smoke test" header, "Not signed in" state, sign-in CTA
# click "Sign in with email" → enter email → check inbox → click magic link
# expected: redirected to / showing "Signed in as <email>"
```

For magic-link emails to actually send, Supabase's "Email" auth provider must be enabled (it is by default on new projects). The redirect URL `http://localhost:3000/auth/callback` must be in Supabase → Authentication → URL Configuration → Redirect URLs.
