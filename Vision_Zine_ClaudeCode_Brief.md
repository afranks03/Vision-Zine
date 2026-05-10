# Vision Zine — Claude Code Build Prompt

> Save this as `BRIEF.md` at the root of a new repo and start Claude Code. Claude Code will read it on launch and follow the agentic working principles below. Adjust the **CUSTOMIZE** section first.

---

## CUSTOMIZE BEFORE STARTING

- **Founder:** Adrian "A.d." Franks (Brooklyn × Athens). Treat his Vision 3.0 prototype as the canonical aesthetic reference.
- **Tech stack preference:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase (Postgres + Auth + Storage) + Stripe + Anthropic API + Playwright (PDF gen) + Vercel (host)
- **Design source of truth:** `/reference/Vision_3.0.html` (the working prototype). Pull tokens (color, type, spacing) from this file. If a Figma file URL is provided later, sync to Figma via MCP; otherwise treat the prototype as canon.
- **Print fulfillment partner (TBD):** Lulu xPress API — confirm with founder before integrating
- **Domain:** visionzine.com (assumed; founder to confirm)

---

# MISSION

Build **Vision Zine**, a SaaS web app that turns a person's life data — vision statements, bios, achievements, goals — into a printable, shareable, editorial-quality magazine-style vision board. Users choose a style, choose a format, answer thoughtful prompts (assisted by AI), and receive a downloadable PDF, a shareable web edition, social-ready crops, and an optional print order delivered to their door.

**The output is the hero.** Everything in the codebase serves the quality of the final zine.

---

# AGENTIC WORKING PRINCIPLES

You are operating as a long-horizon agent. Follow these principles for every session.

## 1. Plan before you code
- On first launch, read this entire file, then read `/reference/Vision_3.0.html` and any other reference materials present.
- Write a `PLAN.md` at the repo root. Break the work into **phases** (see "Phased Build Plan" below). For each phase, list concrete deliverables, files to create, and a definition of done.
- Update `PLAN.md` whenever scope shifts. Treat it as a living document.

## 2. Maintain working state across sessions
- Maintain a `PROGRESS.md` log: dated bullet entries of what was completed, what's blocked, what's next.
- Maintain a `DECISIONS.md` for non-obvious choices: library picks, schema designs, API shape decisions. One paragraph per decision, dated, with rationale.
- Maintain an `OPEN_QUESTIONS.md` for things you need the founder to answer before continuing. Reference these in your replies so they don't get lost.

## 3. Use TodoWrite aggressively
- For any task with more than 2 steps, write the todo list first.
- Mark items in-progress and complete in real time as you work — never batch updates.
- One item in-progress at a time.

## 4. Verify your work
- After every code change that touches runnable behavior, run the relevant verification: type-check, lint, unit test, or manual smoke test via the dev server.
- After every PDF-generation change, render a sample PDF and visually inspect the first page (use `pdftoppm` to convert to image, then view).
- Don't claim a feature is "done" without running it end-to-end at least once.

## 5. Commit at every working state
- Use git from the start. Initial commit on first launch.
- Commit after each working feature with a conventional commit message (`feat:`, `fix:`, `chore:`, etc.).
- If something breaks during a session, the previous commit is the recovery point.

## 6. Parallelize independent work
- When you have multiple unrelated tasks (e.g., "set up auth" and "draft schema" and "scaffold marketing site"), launch them as separate subagent tasks rather than serializing.
- Don't parallelize anything that touches the same files or depends on the same upstream state.

## 7. Stop and ask at product decisions, not technical ones
- **Decide alone:** library choice within the stack, file structure, naming, internal API shape, code style, refactor scope.
- **Stop and ask the founder before:** changing the user-visible flow, adding a feature not in the brief, removing a feature in the brief, picking a print fulfillment partner, choosing a pricing model, anything involving a paid third-party signup, anything that costs real money to test.
- Frame asks in `OPEN_QUESTIONS.md` and surface them at the top of your next reply.

## 8. Handle secrets correctly
- Never commit `.env` files. Add `.env.local` to `.gitignore` immediately.
- When you need a new env var, add it to `.env.example` with a placeholder, document it in `README.md`, and tell the founder the exact variable name to set.
- Never put real API keys in code. Use `process.env.X` and `!` only when you've verified the var must exist at runtime.

## 9. Documentation is part of "done"
- Every phase ends with `README.md` updated: what's built, how to run it locally, what env vars are needed, what's next.
- Every API route gets a short comment block: purpose, inputs, outputs, who can call it.
- Every database table gets a comment in the migration: purpose, ownership.

## 10. Self-audit at the end of each phase
- Before declaring a phase complete, run a self-audit: is the brief satisfied? Are the verification gates passing? Is the documentation current? Is there any code that wasn't run end-to-end?
- Write the audit results into `PROGRESS.md` at the close of each phase.

---

# CORE PRINCIPLES (for the product itself)

1. **The output is the hero.** Templates must look like things people put on a coffee table, not "vision boards."
2. **Editorial > Decorative.** Strong typography, restrained color, intentional white space.
3. **Effortless input → high-craft output.** Users answer prompts; the platform composes.
4. **Print is a first-class citizen.** Real, printable artifacts at three sizes (Letter 8.5×11, Tabloid 11×17, Pocket 4.25×5.5).
5. **The brand is calm.** No exclamation points, no confetti. Think Linear or Aesop.

---

# PHASED BUILD PLAN

Each phase ends with something runnable, testable, and demoable. Don't skip phases.

## Phase 0 — Foundation (≈ 1 session)
**Goal:** A deployable empty Next.js app with auth and a database connection.

- Init Next.js 15 + TypeScript + Tailwind + shadcn/ui
- Set up Supabase (auth + Postgres). Create initial migrations.
- Configure environment: `.env.example`, `.env.local`, `.gitignore`
- Set up ESLint, Prettier, lint-staged, Husky pre-commit
- Connect Vercel deploy
- Build one route (`/`) that confirms DB and auth wiring with a "you are signed in as X" page
- Commit: `feat: foundation scaffold`

**Done when:** `pnpm dev` runs, sign-up works, deployed to Vercel.

## Phase 1 — Design system & marketing site (≈ 2 sessions)
**Goal:** The public-facing site exists with the brand fully expressed.

- Pull design tokens from `/reference/Vision_3.0.html` into `tailwind.config.ts` and a shared `tokens.css`
- Build the component library on top of shadcn/ui: Button, Input, Card, Nav, Footer, Modal, Toast, Tag, Stepper. Match the editorial aesthetic — serif display, generous spacing, restrained color.
- Build marketing routes: `/`, `/examples`, `/pricing`, `/about`, `/faq`. Use real copy (founder will provide; in absence, write placeholder copy in the right voice and flag in `OPEN_QUESTIONS.md`).
- Add OG images and metadata
- Commit: `feat: marketing site`

**Done when:** Marketing site renders end-to-end at desktop (1440) and mobile (390), Lighthouse ≥ 95, no layout shifts.

## Phase 2 — Data model & input studio (≈ 3 sessions)
**Goal:** A user can sign in, start a zine, and complete the full data input flow.

**Data model** (Supabase Postgres):
- `users` (managed by Supabase Auth)
- `zines` (id, user_id, style, format, status, created_at, updated_at, title, issue_number)
- `zine_data` (id, zine_id, section_key, content_json) — section_key ∈ {personal, vision, bio, resume, achievements, goals, tenets, online, documents, coauthor}
- `zine_assets` (id, zine_id, type, url, mime_type) — uploaded files
- `coauthor_invitations` (id, zine_id, email, status, token)
- `subscriptions` (Stripe linkage)

**Input studio routes:**
- `/app` — dashboard (lists user's zines, "create new" CTA)
- `/app/new` — style chooser → format chooser → confirms → creates zine → redirects to studio
- `/app/zines/[id]` — studio with left-rail section navigation, right-side editor

**Sections to build (in order):**
1. Personal (form)
2. Vision Statement (long-form prompt + AI-suggest button using Anthropic API)
3. Bio (paste/upload + AI summarize)
4. Resume / Career (paste, upload, or LinkedIn import)
5. Achievements (free entry + AI extract from uploaded docs)
6. Goals (clusters: financial, creative, place, body/spirit)
7. Tenets / Daily Code (10 prompts)
8. Online presence (URL inputs, fetch metadata via web search)
9. Documents (file upload to Supabase Storage)
10. Co-author (email invitation, separate prompts for invited partner)

**AI integration (Anthropic API):**
- Server-side route handlers only. Never expose API key to client.
- One endpoint per AI action: `/api/ai/suggest-vision`, `/api/ai/summarize-bio`, `/api/ai/extract-achievements`, etc.
- Use Claude Sonnet 4.6 by default. Prompts live in `/lib/ai/prompts/`.
- Stream responses to the client where it improves UX.

**Done when:** A test user can complete every section, data persists across sessions, AI suggestions work, file uploads work, co-author invitation sends an email and renders the partner's reduced view.

## Phase 3 — Zine renderer & live preview (≈ 3 sessions)
**Goal:** Real, editorial-quality zines render from the user's data.

- Port `/reference/Vision_3.0.html` into a React component tree, parameterized by `zine_data`
- Build six style templates: Editorial (the prototype), Lifestyle, Fashion, Art Catalog, Travel, Financial. Each template is a set of page components composed by a `Zine` component that takes data + style + format.
- Build three format containers (Letter, Tabloid, Pocket) — same content, different page sizing/composition.
- `/app/zines/[id]/preview` — live preview route. Split view by default: input on the left, rendered zine on the right, page-by-page navigator below.
- "Try a different style" — instant swap with current data
- "Color theme variant" — 3–4 alternates per style

**Done when:** Each style at each format renders correctly with sample data, live preview updates within 500ms of input change, pages match the prototype quality bar.

## Phase 4 — Output, PDF, and payment (≈ 3 sessions)
**Goal:** Users can pay, get their files, and order a print.

- **PDF generation:** Server-side Playwright (or `@sparticuz/chromium` on Vercel) renders the zine to a print-ready PDF. Match the quality of `/reference/Vision_3.0.pdf`. Three size outputs.
- **Web edition:** Public route `/z/[slug]` that renders the zine on the web with sharing metadata
- **Social crops:** Auto-generated 1080×1080 (Instagram), 1080×1920 (Stories), 1200×630 (OG) crops of the cover and key spreads. Generate on demand, cache to Supabase Storage.
- **Output chooser screen:** Multi-select cards for which outputs to generate. Show free-tier limits.
- **Stripe checkout:** Use Stripe Checkout. Three pricing tiers (confirm with founder): Free preview / One zine ($X) / Annual subscription ($Y).
- **Print fulfillment:** Wire Lulu xPress API (or equivalent — confirm before signing up). On successful payment, ship the PDF + format + shipping address to the print partner.
- **Webhook:** Stripe webhook to mark `zines.status = 'paid'`, kick off PDF generation job, email user when ready.

**Done when:** End-to-end purchase works from a test card. PDFs match prototype quality. Web edition is shareable with proper OG metadata. Print order successfully submits to fulfillment partner sandbox.

## Phase 5 — Polish, dashboard, lifecycle (≈ 2 sessions)
**Goal:** Returning users have a real product experience.

- User dashboard with all zines, status pills, quick actions (edit, duplicate, share, download, archive)
- Annual reminder system: cron or scheduled function that emails users one year after first publish, prompting "Time for Issue II?" — duplicates the zine structure and pre-fills with last year's data for editing.
- Co-author dashboard (shared zines section)
- Email templates (welcome, ready, shipped, invitation, reminder, receipt) — match brand voice
- Empty states, loading states, error boundaries, 404, 500
- Analytics (Plausible or PostHog)
- Privacy policy + terms (founder to provide; placeholder otherwise)

**Done when:** A first-time user can land, sign up, build, pay, receive, return six months later, and reissue. All flows have appropriate empty/error states.

## Phase 6 — Hardening (≈ 1 session)
- Rate limit AI endpoints
- Add request validation everywhere (Zod)
- Audit RLS policies on all Supabase tables
- Set up error monitoring (Sentry)
- Set up uptime monitoring
- Write deployment runbook in `/docs/RUNBOOK.md`

---

# TOOLS YOU SHOULD USE

You have access to and should actively use:

- **Bash / shell** — for everything you'd do in a terminal: install, lint, test, run, git
- **File editing** — read, write, search across the repo
- **Web search** — when you need current API docs, library versions, or best practices. Don't rely on training data for fast-moving libraries.
- **Anthropic API** — for the user-facing AI features (server-side only)
- **Supabase MCP server** (if connected) — to run migrations and inspect schema directly
- **Stripe MCP server** (if connected) — to set up products, prices, and inspect webhook payloads
- **Figma MCP server** (if connected) — if a Figma file URL is provided in `OPEN_QUESTIONS.md` answers, pull tokens, components, and screen specs from there as the design source of truth
- **Playwright** — both for PDF generation in production *and* for end-to-end tests in CI

If a tool you need isn't connected, write the request into `OPEN_QUESTIONS.md` rather than working around it.

---

# REFERENCE MATERIALS (place these in `/reference/`)

- `Vision_3.0.html` — the canonical screen-version prototype. Pull color, type, spacing, illustration style, layout language from here.
- `Vision_3.0.pdf` — the print-ready prototype output. The PDF generation pipeline must produce comparable quality at all three sizes.
- `BRIEF.md` — this file.

The Editorial template should match these references closely. The other five templates (Lifestyle, Fashion, Art Catalog, Travel, Financial) should feel as finished but visually distinct — *not* recolored variants.

---

# DON'T

- Don't build a Canva clone with stickers and templates
- Don't put the Vision Zine logo on the user's zine output (their name is the brand)
- Don't make data input feel like a form factory; it should feel like answering thoughtful questions
- Don't use stock illustration mascots, emoji-heavy UI, or rounded "fun" SaaS chrome
- Don't ship AI suggestions that sound like AI ("Based on your input, here are some thoughts!" — no)
- Don't paginate in the input studio; one section at a time, but the whole studio is one app
- Don't store API keys in code, ever
- Don't claim work is done without running it

---

# FIRST ACTIONS ON LAUNCH

When Claude Code first starts in this repo, do these in order:

1. **Read** this file, plus any files in `/reference/`.
2. **Confirm** the working directory, the founder's name, and which phase to start with. If unclear, default to Phase 0.
3. **Write** `PLAN.md`, `PROGRESS.md`, `DECISIONS.md`, `OPEN_QUESTIONS.md` if they don't exist.
4. **Ask** the founder these questions before writing any production code (put them in `OPEN_QUESTIONS.md` and surface in your reply):
   - Confirm tech stack (or propose alternatives with rationale)
   - Confirm domain name
   - Confirm pricing tiers and amounts
   - Confirm print fulfillment partner (Lulu, Blurb, MagCloud, other)
   - Confirm preferred email provider (Resend, Postmark, Loops)
   - Provide Supabase project URL and anon key, or authorize you to create the project
   - Provide Anthropic API key, Stripe keys (test mode is fine to start)
   - Provide Figma file URL if one exists; otherwise confirm prototype-as-canon
5. Once Phase 0 questions are answered, **begin Phase 0** and don't stop until it's deployed and the smoke test passes.

---

# QUALITY BAR

Every phase ships with:
- Passing type-check (`tsc --noEmit`)
- Passing lint (`pnpm lint`)
- Working dev server (`pnpm dev`)
- Successful Vercel deploy on the `main` branch
- Updated `README.md`, `PROGRESS.md`, and `PLAN.md`
- A self-audit entry confirming the above

Anything less is "in progress," not "done."

---

# WHEN IN DOUBT

- Choose the option that protects the founder's time over your own
- Choose the option that produces a more beautiful zine over a faster build
- Choose the option that's easier to undo over the one that's faster to ship
- Ask before assuming; default to the brief

You're building this for someone who has already shown what excellence looks like. Match that bar.
