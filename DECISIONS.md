# Vision Zine — Decisions Log

One paragraph per non-obvious decision. Date, rationale, alternatives considered.

---

## 2026-05-09 — Scaffold tracking docs before Phase 0
Created `PLAN.md`, `PROGRESS.md`, `DECISIONS.md`, `OPEN_QUESTIONS.md` ahead of `git init`. Rationale: the brief explicitly requires founder confirmation on stack, domain, pricing, fulfillment, and credentials before Phase 0 production code begins. Initializing the repo now would commit a stack we may not use. Tracking docs are stack-agnostic and useful immediately.

## 2026-05-09 — Tech stack confirmed as proposed
Adrian confirmed Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase + Stripe + Anthropic API + Playwright + Vercel. Package manager: `pnpm`. No substitutions requested.

## 2026-05-09 — Email provider: Resend
Chosen over Postmark and Loops. Rationale: best developer experience for Next.js (React Email integration for branded templates), generous free tier (3K/month, 100/day) covers the prototype phase at zero cost, modern API ergonomics, and the team ships fast. Postmark has stronger deliverability reputation but the API is older and template tooling is weaker. Loops is marketing-first; we need transactional. We can swap to Postmark in Phase 5 if deliverability becomes a concern (small abstraction layer makes this easy).

## 2026-05-09 — Print fulfillment: Lulu xPress
Adrian's preference. Confirmed for Phase 4. Lulu has the most robust public API for magazine-format print-on-demand. Pricing per unit is moderate, no minimums, ships globally. Alternatives ruled out: Blurb (limited API), MagCloud (acquisition uncertainty), Mixam (no production API), Peecho (smaller catalog).

## 2026-05-09 — Domain deferred until prototype validates
Adrian doesn't want to buy `visionzine.com` until the concept proves out. Phase 0 will deploy to a Vercel preview URL (`vision-zine-*.vercel.app`). Domain purchase moved to a Phase 4 prerequisite. No code impact — Next.js metadata reads `NEXT_PUBLIC_SITE_URL` from env.

## 2026-05-09 — Pricing deferred until prototype is visible
Adrian wants to see the working prototype before committing to dollar amounts. Phase 4 (Stripe integration) is unblocked technically but the actual price configuration in Stripe waits until we can show end-to-end output quality. Schema and code will support N tiers via env-driven Stripe price IDs.

## 2026-05-09 — Figma not used; prototype HTML is canon
Per brief default. All design tokens (color, type, spacing, layout) extracted directly from `/reference/Vision_3.0.html` once Adrian uploads it.

## 2026-05-09 — Next.js 16 (not 15)
`create-next-app@latest` installed Next.js 16.2.6, which shipped recently. The brief specifies Next 15 but Next 16 is now the current stable and is backward-compatible with App Router patterns. Going with 16 to avoid downgrading and to get the Turbopack-by-default dev experience. Watch the [middleware → proxy](https://nextjs.org/docs/messages/middleware-to-proxy) deprecation — Next 16 renamed `middleware.ts` to `proxy.ts`. Current code still uses `middleware.ts` (works with deprecation warning); migration to `proxy.ts` is a Phase 6 hardening task.

## 2026-05-09 — Tailwind 4 (CSS-first, no `tailwind.config.ts`)
Tailwind 4 ships with shadcn's Nova preset. There is no `tailwind.config.ts` — theming lives entirely in `src/app/globals.css` via `@theme` and CSS custom properties. The brief's "design tokens in tailwind.config.ts" language is outdated; in Phase 1, tokens from `Vision_3.0.html` will be extracted into `globals.css` (under `@theme`) and a companion `tokens.css` for non-Tailwind values.

## 2026-05-09 — shadcn/ui: Radix base + Nova preset
The shadcn CLI now offers Radix or Base UI as the underlying primitive library, with named presets (Nova, Vega, Maia, Lyra, Mira, Luma, Sera, Custom). Picked **Radix + Nova** because Radix is the mature default with better ecosystem support, and Nova (Geist + Lucide) is the cleanest baseline before we override with editorial typography. Fonts will be swapped to a serif display in Phase 1 once tokens are extracted from the prototype.

## 2026-05-09 — pnpm 11 build script approval (`allowBuilds`)
pnpm 11's strict default refuses to run install scripts for any package unless explicitly approved in `pnpm-workspace.yaml`. We approved `sharp` (Next.js image optimization, requires native build) and `unrs-resolver` (Rust-based module resolver, transitive dep of ESLint plugins). Denied `msw` (Mock Service Worker — pulled in transitively but we don't use it; no need to run its install scripts).

## 2026-05-09 — Supabase: new key naming convention
Supabase introduced `sb_publishable_*` and `sb_secret_*` key formats (replacing the legacy JWT `anon` and `service_role` keys). Both formats work with `@supabase/ssr` v0.10+. Named env vars `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY` to match the new naming, rather than the legacy `_ANON_KEY` / `_SERVICE_ROLE_KEY` names — clearer for anyone joining the project after the rename.

## 2026-05-09 — Auth UX: passwordless magic link
Phase 0 sign-in uses Supabase's `signInWithOtp` (magic link) rather than email/password. Rationale: aligns with the brand (calm, no friction), no password reset flow to build, no password storage concerns, and Supabase handles the email send in the auth layer (no Resend dependency for Phase 0). Will add OAuth providers (Google, Apple) in Phase 2 if Adrian wants them.
