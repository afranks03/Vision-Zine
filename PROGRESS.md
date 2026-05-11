# Vision Zine — Progress Log

Dated bullet entries: completed, blocked, next.

---

## 2026-05-10 — Phase 2a shipped: schema + app shell + 3 sections

**Completed**
- Installed Supabase CLI (`pnpm add -D supabase`, v2.98.2). `pnpm exec supabase` now works locally. Added `supabase: true` to `pnpm-workspace.yaml allowBuilds`.
- `supabase init` — scaffolded `supabase/` with `config.toml` and `migrations/`.
- Wrote initial migration `supabase/migrations/20260511014420_initial_schema.sql`:
  - Tables: `zines`, `zine_data`, `zine_assets`, `coauthor_invitations`, `subscriptions`
  - Triggers: `set_updated_at` (generic), `set_zine_issue_number` (auto-increments per user on insert)
  - RLS enabled on every table, owner-only policies. Co-author read policies deferred to Phase 2d. Subscription writes locked to service role only.
  - Indexes on user_id, zine_id, accepted_by, tokens.
- Hand-wrote `src/lib/supabase/types.ts` with row shapes, section content payloads, and a Database type (the Database generic itself is currently disabled in the client because postgrest-js's constraint check requires very specific structural matching; will re-enable via `supabase gen types typescript` once the schema is applied).
- Created `(authenticated)` `/app` route group:
  - `src/app/app/layout.tsx` — auth gate (redirects to `/signin?next=/app`), slim app chrome.
  - `src/app/app/page.tsx` — dashboard listing user's zines, empty state for first-time users, "Start Issue X" CTA.
  - `src/app/app/new/page.tsx` + `new-zine-form.tsx` — style chooser (six color-swatched cards), format chooser (Letter/Tabloid/Pocket), optional title, calls `createZine` server action.
  - `src/app/app/zines/[id]/page.tsx` — studio with two-column layout (left rail of 10 sections + right editor). Section selection via `?section=KEY` query param.
- Built section editor framework:
  - `_sections/section-shell.tsx` — shared form shell with save state and helper components
  - `_sections/personal-section.tsx` — name, display name, pronouns, location, birth year, short intro
  - `_sections/goals-section.tsx` — four clusters (financial, creative, place, body/spirit) as newline-separated text
  - `_sections/tenets-section.tsx` — ten numbered slots
  - `_sections/section-placeholder.tsx` — "coming in Phase 2b/c/d" stub for the seven unbuilt sections
- Server actions in `src/app/app/_actions.ts`: `createZine`, `saveSection` (upserts on `zine_data` with `onConflict: 'zine_id,section_key'`), `deleteZine`.
- `pnpm typecheck`, `pnpm lint`, `pnpm build` all pass. All 12 routes generate.

**Pending in this slice**
- **Adrian to apply the migration** — paste `supabase/migrations/20260511014420_initial_schema.sql` into supabase.com → SQL Editor → New Query → Run. Until applied, the dashboard renders empty state (no crash) but the create-zine flow returns an error.
- After migration applies: end-to-end smoke test — sign in → create zine → fill Personal → save → reload → verify content persisted.

**Coming in Phase 2b/c/d**
- 2b: Anthropic API integration. Vision, Bio, Resume, Achievements sections. Streaming AI suggestions. Needs `ANTHROPIC_API_KEY`.
- 2c: Supabase Storage. File uploads for Documents section. URL metadata fetch for Online Presence.
- 2d: Co-author invitation flow. Needs Adrian to answer the three co-author questions in `OPEN_QUESTIONS.md`.

---

## 2026-05-10 — Phase 1 shipped: design system + marketing site ✅

**Completed**
- Read `Vision_3.0.html` and `Vision_3.0.pdf` carefully. Confirmed the canon: Monocle-class editorial magazine. Yellow `#FFD629` primary, Ink black, cream/paper neutrals, coral accent. DM Serif Display (headlines) + Source Serif 4 (body) + Archivo (UI labels).
- Loaded the three brand fonts via `next/font/google` (replacing scaffolded Geist). CSS variables `--font-display`, `--font-serif`, `--font-sans`.
- Rebuilt `src/app/globals.css` around Vision Zine tokens: 12 brand colors as `--color-vz-*` (Tailwind 4 namespaced utilities), shadcn semantic tokens remapped to the brand, radius set to 0 (sharp editorial corners), editorial utility classes (`.vz-eyebrow`, `.vz-meta`, `.vz-prose`, `.vz-container`, `.vz-section`, `.vz-num-badge`, `.vz-dropcap`).
- Built editorial primitives in `src/components/editorial.tsx`: `Eyebrow`, `Meta`, `BulletDot`, `NumberedBadge`, `SectionHeader`, `HeavyRule`, `HairlineRule`, `MetaRow`.
- Built `MarketingNav` (sticky, ink hairline, sign-in/account aware) and `MarketingFooter` (4-column, ink black background, yellow brand accent).
- Created `(marketing)` route group with shared `layout.tsx` that fetches the Supabase user server-side and passes to the nav.
- Built five marketing pages:
  - `/` — Yellow magazine-cover hero, "Three steps" how-it-works, "Inside an issue" TOC sample, dark Quotes section, yellow CTA
  - `/examples` — Six-style gallery with mood + format tags (Editorial, Lifestyle, Fashion, Art Catalog, Travel, Financial)
  - `/pricing` — Three tiers (Preview, One Issue, Annual). Dollar amounts left as `$—` until Adrian sets them post-prototype
  - `/about` — Coral hero, dropcap editorial body, four principles, founder note signed Brooklyn × Athens
  - `/faq` — Four sections (Product, Privacy, Co-authors, Print) with native `<details>` disclosure
- Restyled `/signin` to match the new design system (cream bg, paper card, ink/yellow CTA)
- Added dynamic OG image at `src/app/opengraph-image.tsx` (1200×630, yellow magazine cover with VISION masthead)
- `pnpm typecheck`, `pnpm lint`, `pnpm build` all pass
- Dev-server smoke test: all 7 marketing routes return 200, key content present (VISION masthead, Issue I, Six Pillars TOC, etc.)

**Quality bar (Phase 1)**
- ✅ Tokens extracted from the prototype canon
- ✅ Component library on shadcn primitives
- ✅ All five marketing routes present and rendering
- ✅ OG image + per-page metadata
- ✅ Sticky responsive nav with auth-aware actions
- ✅ Footer with full link architecture

**Pending**
- Production deploy verification (push will auto-deploy via Vercel)
- Lighthouse ≥ 95 verification once production is live
- Responsive QA at 390px (mobile) — pages use `sm:`/`md:` breakpoints and `clamp()` typography but should be visually confirmed
- Author copy review: all marketing copy is first-draft in the brand voice. Adrian to edit. Notably: hero subhead, examples blurbs, pricing tier descriptions, about page founder note, FAQ answers.

**Next: Phase 2 — Data model + input studio**
- Supabase schema migrations (zines, zine_data, zine_assets, coauthor_invitations, subscriptions)
- `/app` dashboard, `/app/new` creation flow, `/app/zines/[id]` studio
- 10 input sections with thoughtful prompts
- Anthropic API integration (server-side only) for AI-assisted prompts
- Needs: `ANTHROPIC_API_KEY` from Adrian

---

## 2026-05-10 — Phase 0 complete ✅

**Completed**
- Resolved Vercel deploy debugging saga (see entry below for details).
- Root cause: Adrian had one bogus env var `vision_zine` in Vercel instead of the four real Supabase variables. Added all four (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL`) scoped to Production+Preview, redeployed without build cache.
- **Production verified healthy at https://vision-zine.vercel.app/**:
  - `GET /` → HTTP 200, renders "Phase 0 smoke test" header + "Not signed in" state
  - `GET /signin` → HTTP 200, renders magic-link form
- All Phase 0 quality-bar items pass: typecheck, lint, dev server, production build, Vercel deploy, README updated, tracking docs current.

**Still on Adrian (small follow-ups before end-to-end auth works in production)**
- Add `https://vision-zine.vercel.app/auth/callback` to Supabase → Authentication → URL Configuration → Redirect URLs. Otherwise the magic-link email from prod will land users back on the localhost callback. (The localhost callback is already added.)

**Next: Phase 1 — Design system & marketing site**
1. Extract design tokens from `/reference/Vision_3.0.html` (color, type scale, spacing, layout language) into `src/app/globals.css` under `@theme` directives (Tailwind 4 CSS-first config) and a companion `src/styles/tokens.css` for non-Tailwind values.
2. Build the component library on top of shadcn primitives: Nav, Footer, Stepper, Tag, refined Card/Input/Modal/Toast. Editorial type system (serif display, restrained color, generous spacing).
3. Marketing routes: `/`, `/examples`, `/pricing`, `/about`, `/faq`. Placeholder copy in brand voice (flagged in OPEN_QUESTIONS for Adrian to edit).
4. OG image + metadata.
5. Definition of done: marketing site renders at 1440 + 390, Lighthouse ≥ 95, no CLS.

---

## 2026-05-10 — Vercel deploy debugging

**Completed**
- Pushed two commits to GitHub: `feat: phase 0 foundation scaffold` (1879139 → rebased to 2868450) and `chore: apply prettier + tailwind class ordering` (f28d979 → rebased to 3ca1ae1). Remote: `git@github.com:afranks03/Vision-Zine.git`.
- Adrian created Vercel project; first deploy `vision-zine.vercel.app` came up with HTTP 500 `MIDDLEWARE_INVOCATION_FAILED`.
- Diagnosed: middleware was crashing because `NEXT_PUBLIC_*` Supabase env vars were not present at build time (NEXT_PUBLIC vars are inlined at build, not runtime). Pushed `ab4ed5a fix: middleware error surfacing + pre-commit hook PATH issue` to (a) make middleware return 200 with a clear log message when env vars are missing instead of crashing, and (b) switch husky pre-commit from `pnpm exec lint-staged` to `npx lint-staged` so git's restricted PATH can find it.
- The `ab4ed5a` deploy was **blocked** by Vercel's "Git Author Verification" because the commit author email `afranks3@icloud.com` was not yet a verified email on the GitHub account.
- Adrian added and verified `afranks3@icloud.com` on github.com → Settings → Emails. Production stayed on `3ca1ae1` (old code) because verification doesn't retroactively un-block deploys.

**Next**
- Push a fresh commit to trigger a clean auto-deploy with the now-verified email. New build should succeed; defensive middleware will either render the page (if env vars now work) or log the specific missing var to runtime logs.
- Confirm env vars `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL` are set on Vercel for the Production environment and that the new build did NOT use the cached build (NEXT_PUBLIC vars are inlined per-build).

---

## 2026-05-09 (evening) — Phase 0a complete

**Completed**
- Reference files received (`Vision_3.0.html`, `Vision_3.0.pdf`) — staged in `/reference/`
- Installed pnpm 11.0.9 via official standalone installer (modifies `~/.zshrc`)
- `git init` on `main` branch
- Scaffolded Next.js 16.2.6 + React 19 + TypeScript 5 + Tailwind 4 + ESLint 9 (note: Next 16, not 15 per brief — see DECISIONS.md)
- Approved pnpm build scripts for `sharp` and `unrs-resolver`
- Initialized shadcn/ui with **Radix base + Nova preset** (Geist font, Lucide icons)
- Configured Prettier (with `prettier-plugin-tailwindcss`), Husky pre-commit, lint-staged
- Created `.env.example` and `.env.local` with Supabase URL + publishable key (secret key still empty — Adrian to paste in)
- Wired Supabase clients: `src/lib/supabase/{client,server,middleware}.ts` + Next.js `src/middleware.ts`
- Built smoke-test home page at `/` showing auth state
- Built `/signin` route with magic-link form
- Built `/auth/callback` route to handle the link redirect
- Verified `pnpm typecheck`, `pnpm lint`, `pnpm build` all pass
- Verified dev server: `curl http://localhost:3000/` returns 200, page renders correctly

**Self-audit (per brief Phase 0 quality bar)**
- ✅ `tsc --noEmit` passes
- ✅ `pnpm lint` passes
- ✅ `pnpm dev` runs and serves the smoke test
- ⚠️ Vercel deploy not yet done (Phase 0b)
- ✅ README updated
- ✅ PROGRESS.md, DECISIONS.md updated

**Blocked / awaiting (Phase 0b finish)**
- `SUPABASE_SECRET_KEY` — Adrian to paste into `.env.local`. Without it, server-only operations bypassing RLS won't work, but the Phase 0 smoke test (auth via publishable key) does work.
- **Vercel deploy access** — need either: (a) Adrian links the repo via Vercel dashboard after first push, or (b) shares a Vercel CLI token. Brief's Phase 0 "done" requires successful Vercel deploy.
- **End-to-end magic-link test** — needs Adrian to (1) confirm Email auth provider is enabled in Supabase (default-on), (2) add `http://localhost:3000/auth/callback` to Supabase → Authentication → URL Configuration → Redirect URLs.

**Next**
- Once Supabase secret key is in place + Vercel access is sorted: deploy, run end-to-end magic-link test, close Phase 0
- Then Phase 1: extract design tokens from `Vision_3.0.html` into `globals.css` and start the marketing site

---

## 2026-05-09 (afternoon)

**Completed**
- Adrian answered Phase 0 questions
- Decisions recorded in `DECISIONS.md`: stack confirmed, Resend for email, Lulu for print, prototype HTML as canon, domain + pricing deferred until prototype validates

**Blocked / awaiting**
- Reference files (`Vision_3.0.html`, `Vision_3.0.pdf`) — Adrian uploading
- Supabase credentials — needed to complete Phase 0 (auth + DB wiring)
- Vercel deploy access — needed for Phase 0 done state

**Next**
- Local scaffold work I can do without credentials: `git init`, Next.js 15 + TS + Tailwind + shadcn install, ESLint/Prettier/Husky, `.env.example`, base file structure, placeholder smoke-test route. Commit `chore: local scaffold`.
- Then pause for Supabase + Vercel access to finish Phase 0.

---

## 2026-05-09 (morning)

**Completed**
- Read `BRIEF.md`
- Scaffolded `PLAN.md`, `PROGRESS.md`, `DECISIONS.md`, `OPEN_QUESTIONS.md`
- Symlinked `BRIEF.md` → `Vision_Zine_ClaudeCode_Brief.md`
- Created empty `/reference/` directory

**Blocked**
- Reference materials missing
- Phase 0 questions unanswered
