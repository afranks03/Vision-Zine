# Vision Zine — Build Plan

**Status:** Scaffolded. Phase 0 blocked pending founder answers in `OPEN_QUESTIONS.md`.
**Last updated:** 2026-05-09

This plan mirrors the phased structure in `BRIEF.md`. Each phase ends with something runnable, testable, and demoable. Update this file whenever scope shifts.

---

## Phase 0 — Foundation
**Goal:** Deployable empty Next.js app with auth + database wired.

**Deliverables**
- [ ] `package.json` with Next.js 15 + TypeScript + Tailwind + shadcn/ui installed
- [ ] Supabase project provisioned, auth + Postgres connected
- [ ] `.env.example`, `.env.local`, `.gitignore` in place
- [ ] ESLint, Prettier, lint-staged, Husky pre-commit configured
- [ ] Vercel project linked, `main` deploys
- [ ] `/` route shows "Signed in as X" smoke test
- [ ] Initial commit `feat: foundation scaffold`

**Definition of done:** `pnpm dev` runs locally, sign-up flow works end-to-end, deployed build is reachable on Vercel.

---

## Phase 1 — Design system & marketing site
**Goal:** Public-facing site exists with the brand fully expressed.

**Deliverables**
- [ ] Design tokens extracted from `/reference/Vision_3.0.html` into `tailwind.config.ts` + `tokens.css`
- [ ] Component library on shadcn/ui base: Button, Input, Card, Nav, Footer, Modal, Toast, Tag, Stepper
- [ ] Marketing routes: `/`, `/examples`, `/pricing`, `/about`, `/faq`
- [ ] OG images + metadata
- [ ] Commit: `feat: marketing site`

**Definition of done:** Marketing site renders end-to-end at 1440 + 390, Lighthouse ≥ 95, no CLS.

---

## Phase 2 — Data model & input studio
**Goal:** A user can sign in, start a zine, and complete the full data input flow.

**Schema (Supabase Postgres)**
- `users` (Supabase Auth)
- `zines` (id, user_id, style, format, status, created_at, updated_at, title, issue_number)
- `zine_data` (id, zine_id, section_key, content_json)
- `zine_assets` (id, zine_id, type, url, mime_type)
- `coauthor_invitations` (id, zine_id, email, status, token)
- `subscriptions` (Stripe linkage)

**Routes**
- `/app` — dashboard
- `/app/new` — style → format → create
- `/app/zines/[id]` — studio (left rail nav, right editor)

**Sections (in order):** Personal, Vision Statement, Bio, Resume, Achievements, Goals, Tenets, Online presence, Documents, Co-author.

**AI integration**
- Server-side route handlers only
- One endpoint per AI action under `/api/ai/*`
- Default model: Claude Sonnet 4.6
- Prompts in `/lib/ai/prompts/`
- Stream where it improves UX

**Definition of done:** Test user can complete every section, data persists, AI suggestions work, file uploads work, co-author invitation sends email + renders partner's reduced view.

---

## Phase 3 — Zine renderer & live preview
**Goal:** Real, editorial-quality zines render from user data.

**Deliverables**
- [ ] Port `/reference/Vision_3.0.html` into a React component tree parameterized by `zine_data`
- [ ] Six style templates: Editorial, Lifestyle, Fashion, Art Catalog, Travel, Financial
- [ ] Three format containers: Letter (8.5×11), Tabloid (11×17), Pocket (4.25×5.5)
- [ ] `/app/zines/[id]/preview` — split view, page navigator
- [ ] "Try a different style" instant swap
- [ ] 3–4 color theme variants per style

**Definition of done:** Each style at each format renders correctly, preview updates within 500ms of input change, pages match prototype quality.

---

## Phase 4 — Output, PDF, and payment
**Goal:** Users can pay, get their files, and order a print.

**Deliverables**
- [ ] Server-side Playwright PDF generation (or `@sparticuz/chromium` on Vercel) — three sizes
- [ ] Public web edition at `/z/[slug]` with sharing metadata
- [ ] Social crops: 1080×1080, 1080×1920, 1200×630, generated on demand, cached to Storage
- [ ] Output chooser screen with free-tier limits
- [ ] Stripe Checkout, three tiers (TBD)
- [ ] Print fulfillment integration (Lulu xPress TBD)
- [ ] Stripe webhook → `zines.status = 'paid'` → kick PDF job → email user

**Definition of done:** End-to-end purchase from a test card. PDF matches prototype. Web edition shareable with OG. Print order submits to fulfillment sandbox.

---

## Phase 5 — Polish, dashboard, lifecycle
**Goal:** Returning users have a real product experience.

**Deliverables**
- [ ] Dashboard with status pills, edit/duplicate/share/download/archive
- [ ] Annual reminder cron — emails one year after first publish, duplicates structure pre-filled
- [ ] Co-author dashboard
- [ ] Email templates (welcome, ready, shipped, invitation, reminder, receipt)
- [ ] Empty/loading/error states, 404, 500
- [ ] Analytics (Plausible or PostHog — TBD)
- [ ] Privacy policy + terms

**Definition of done:** Land → sign up → build → pay → receive → return six months later → reissue. All flows have appropriate states.

---

## Phase 6 — Hardening
- [ ] Rate limit AI endpoints
- [ ] Zod validation on every route
- [ ] RLS audit on all Supabase tables
- [ ] Sentry for error monitoring
- [ ] Uptime monitoring
- [ ] `/docs/RUNBOOK.md` deployment guide
