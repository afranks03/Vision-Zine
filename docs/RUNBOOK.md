# Vision Zine — Operations Runbook

Last updated: 2026-05-19. Phase 6 deliverable. The "what do I do when X
breaks" doc. Read top to bottom on a calm day so the urgent reads later
are faster.

---

## 1. Architecture at a glance

| Layer | Vendor | What lives there |
|---|---|---|
| Hosting | **Vercel** (production: `vision-zine.vercel.app`) | Next.js app, API routes, cron, PDF rendering |
| Database & Auth | **Supabase** (project `bjitcukkltmspcibnygq`) | Postgres + auth + RLS, storage buckets `zine-pdfs` and `zine-covers` |
| Payments | **Stripe** (test + live) | Checkout, webhook → mark paid + kick print pipeline |
| Print | **Lulu xPress** (sandbox + production) | OAuth client-credentials, `/print-jobs/` submission |
| AI | **Anthropic** | Claude Sonnet 4.6 via streaming API, prompt-cached system blocks |
| Email | **Resend** (`onboarding@resend.dev` default) | Welcome, receipt, print confirmation, co-author invite, annual reminder |
| Analytics | **Plausible** (optional) | Page views, no cookies |
| Rate limit | **Upstash Redis** (optional, free tier) | AI request gating |

---

## 2. Environment variables

| Var | Where to find | Required? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | ✅ |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API | ✅ |
| `SUPABASE_SECRET_KEY` | Supabase → Settings → API → Service role | ✅ |
| `NEXT_PUBLIC_SITE_URL` | Hostname (no trailing slash) | ✅ |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys | ✅ |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Workbench → Webhook destination | ✅ |
| `RESEND_API_KEY` | resend.com → API Keys | ✅ |
| `EMAIL_FROM` | A verified sending identity or `onboarding@resend.dev` | ✅ |
| `EMAIL_BCC` | (optional paper trail) | ⚪ |
| `LULU_CLIENT_KEY` | developers.sandbox.lulu.com → API Keys | ✅ |
| `LULU_CLIENT_SECRET` | Same | ✅ |
| `LULU_API_BASE` | `https://api.sandbox.lulu.com` or `https://api.lulu.com` | ✅ |
| `CRON_SECRET` | `openssl rand -hex 32` | ✅ for production |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible site domain | ⚪ |
| `UPSTASH_REDIS_REST_URL` | console.upstash.com → Redis | ⚪ for production |
| `UPSTASH_REDIS_REST_TOKEN` | Same | ⚪ for production |

To sync from Vercel to local: `pnpm exec vercel env pull .env.local`.

---

## 3. Deploy workflow

1. Commit to `main` (we work direct-to-main; no PR ceremony).
2. Vercel auto-deploys on push.
3. Watch the build in Vercel → Deployments. Build usually completes in ~90s.
4. Smoke-test on the prod URL.
5. If a migration was added under `supabase/migrations/`, apply it in Supabase → SQL Editor before the new code is used in anger.

### Rollback

Vercel → Deployments → previous green deployment → ⋮ → **Promote to Production**.
Faster than a `git revert` for stopping bleeding. After rolling back, fix the broken commit on `main` and push again.

---

## 4. When X breaks — fast paths

### A user can't sign in

- Check Supabase status: https://status.supabase.com
- Check that the magic-link email is arriving (Resend dashboard → Logs)
- The auth-callback route is `/auth/callback`. If it 500s, the user lands on `/signin?error=...` with a description — look there first.
- Magic-link tokens expire after ~1 hour by default. Tell the user to request a new one.

### Stripe webhook isn't firing print pipelines

1. Stripe → Workbench → Webhook destination → Event deliveries. Are recent events 2xx?
2. If yes but `print_orders` empty: check Vercel logs filtered to `/api/webhooks/stripe`. Look for `[stripe webhook] print pipeline crashed`.
3. If webhooks deliver but no events show: confirm the destination is in the same **mode** (Test/Live) as the checkout sessions.
4. Confirm `STRIPE_WEBHOOK_SECRET` matches the destination's signing secret. Rotating the destination requires updating this env var.

### Print order failed (status='failed' in `print_orders`)

1. Run `select status_detail from print_orders where id = '...'` and click into the cell to see the full Lulu error.
2. Common failure modes:
   - `Invalid pod_package_id` → Lulu doesn't carry that SKU. Update `src/lib/print/lulu.ts` `POD_PACKAGE_BY_FORMAT`. Use `scripts/lulu-probe.mjs` to find valid alternatives.
   - `Lulu token exchange failed (401)` → Sandbox vs production key mismatch with `LULU_API_BASE`.
   - `title is required` → Title field missing on line items (regression — `submitPrintJob` should always pass `title`).
3. To retry: delete the failed row from `print_orders` and have the user re-run checkout. There's no auto-retry yet.

### AI request returns 429

User hit the per-account rate limit (30 requests/hour). They should wait the time on `Retry-After` (max ~1 hour). If we see a wave of legitimate 429s, raise the limit in `src/lib/ratelimit/index.ts` (`buildLimiter(30, 3600, …)`).

### Annual reissue cron didn't fire

1. Vercel → Project → Settings → Cron Jobs. Check the cron is listed and shows recent runs.
2. Vercel logs → filter to `/api/cron/annual-reissue`. The endpoint logs `[annual-reissue]` with a summary every run.
3. Common: `CRON_SECRET` wasn't set in Vercel env → endpoint returns 500 with a clear setup error. Set the var and trigger the cron manually from Vercel (cron details panel → "Run").

### Cover photo upload returns "Unexpected token 'R'..."

Vercel's 4.5 MB serverless body limit rejected the upload. The client should resize automatically (see `cover-section.tsx → resizeImage`). If a user reports this:
- Confirm they're on a recent deploy (the resize logic landed in commit `dd926f0`).
- Their original file might have a corrupt header that broke the resize → fall back to manual export at lower resolution.

---

## 5. Vendor accounts

Keep account ownership consolidated; passwords + 2FA recovery codes stored in a shared password manager.

| Vendor | Login | Plan |
|---|---|---|
| Vercel | `afranks3@gmail.com` | Pro Trial (upgrade before launch) |
| Supabase | `afranks3@gmail.com` | Free tier (upgrade before launch — Pro for daily backups) |
| Stripe | `afranks3@gmail.com` | Standard |
| Anthropic | `afranks3@gmail.com` | Pay-as-you-go |
| Resend | `afranks3@gmail.com` | Free (3k/month; upgrade for volume) |
| Lulu xPress | `afranks3@gmail.com` (sandbox account; separate production account needed) | Free sandbox |
| Plausible | (not yet set up) | Optional |
| Upstash | (not yet set up) | Optional, free tier covers our scale |

---

## 6. Database operations

### Apply a new migration

1. Migration files live in `supabase/migrations/{timestamp}_{description}.sql`.
2. Open Supabase → SQL Editor → New query.
3. Paste the file's contents and Run.
4. Verify with the script's own verification query (each migration file documents what to check).

### RLS audit

Run `supabase/audit/rls-check.sql` quarterly or whenever a new table is added. Output is human-review only; the script doesn't enforce anything.

Critical things to confirm:
- Every public table has `rowsecurity = true`
- No table has zero policies (denies all)
- No storage bucket is `public = true`

### Backups

Supabase Free tier: 7 days of point-in-time backups. Pro tier: 30 days + daily downloadable.

**Manual backup before risky migrations:**
```bash
pg_dump -h db.bjitcukkltmspcibnygq.supabase.co -U postgres -d postgres > backup-$(date +%Y%m%d).sql
```

### Restoring from accidental deletion

A user's data was deleted by mistake:
1. Supabase → Database → Backups → Point in time → pick a moment before the deletion
2. Restore to a new database, then `pg_dump`+`pg_restore` the affected rows back into production
3. Document what happened in `DECISIONS.md`

---

## 7. Cron jobs

| Cron | When | What |
|---|---|---|
| `annual-reissue` | Daily 09:00 UTC | Emails users whose oldest non-archived zine was created exactly one year ago, suggesting they start Issue II. Stamps `zines.last_reminder_sent_at` so reminders only fire once per issue. |

Vercel cron configuration lives in `vercel.json`. Authorization is via `CRON_SECRET` Bearer header (Vercel injects automatically when calling cron endpoints).

---

## 8. Pre-launch checklist (Phase 6 → public launch)

Things flagged as "before public launch" across the build:

- [ ] **Sentry** — install `@sentry/nextjs`, wire into `app/error.tsx` + `app/global-error.tsx` `useEffect` log call, configure alerts on the cron + print pipeline. Phase 6 deferred this in favor of the error UI; the SDK install is the gap.
- [ ] **Counsel review** — Privacy + Terms placeholders flagged in their own footer notes.
- [ ] **Verified Resend domain** — switch `EMAIL_FROM` from `onboarding@resend.dev` to `Vision Zine <hello@visionzine.com>` (or your domain). Resend → Domains → Add → DNS setup → wait for verification.
- [ ] **Production Stripe + Lulu** — flip from sandbox keys to live keys. Two destinations needed on Stripe (test + live both still listening for `checkout.session.completed`).
- [ ] **Upstash Redis** — sign up at console.upstash.com, create a database, copy the REST URL + token into Vercel env. Without these, the AI rate limit fails open (no protection).
- [ ] **Plausible account** — sign up, add the prod hostname, set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
- [ ] **Uptime monitor** — sign up at betterstack.com (or uptimerobot.com), point at `/api/health`. Expect 200 every check.
- [ ] **Supabase Pro upgrade** — for daily backups + ability to restore single rows.
- [ ] **Custom domain** — Vercel → Settings → Domains → add `visionzine.com`. Update `NEXT_PUBLIC_SITE_URL` in env.

---

## 9. Useful one-liners

```bash
# Pull all prod env vars to local .env.local
pnpm exec vercel env pull .env.local

# Trigger the annual-reissue cron manually
curl -X GET https://vision-zine.vercel.app/api/cron/annual-reissue \
  -H "Authorization: Bearer $CRON_SECRET"

# Check production health
curl https://vision-zine.vercel.app/api/health | jq

# Probe Lulu's catalog for a valid SKU
node scripts/lulu-probe.mjs

# Find which user owns a zine (for support requests)
# In Supabase SQL Editor:
select z.id, z.title, z.created_at, u.email
from zines z
join auth.users u on u.id = z.user_id
where z.id = '...';
```

---

## 10. Phase status

| Phase | Status |
|---|---|
| 0 Foundation | ✅ |
| 1 Marketing site | ✅ |
| 2 Studio + AI | ✅ |
| 3 Renderer + 6 styles | ✅ |
| 3d Design refresh (covers, typography, chrome, signature spreads) | ✅ |
| 4 PDF + payment + print | ✅ |
| 5a Dashboard | ✅ |
| 5b Resend lifecycle | ✅ |
| 5c Co-author flow | ✅ |
| 5d Annual reissue cron | ✅ |
| 5e Edge states + legal + analytics | ✅ |
| 6 Hardening (Zod, rate limit, RLS audit, health endpoint, this doc) | ✅ |

Build phase complete. Remaining work is pre-launch checklist + counsel review + Sentry.

---

## 11. Contact

The only person who has root on every system: Adrian Franks. Document a second human before launch.
