# Vision Zine — Open Questions

Questions for the founder. Answered items move to `DECISIONS.md`.

---

## Still blocking Phase 0 close-out

### A. Supabase secret key
Adrian to paste the `sb_secret_*` value into `.env.local` on the `SUPABASE_SECRET_KEY=` line. Find it at:
**supabase.com → project → Settings → API → "Project API keys" → secret key (formerly service role)**

The Phase 0 smoke test (auth via magic link) works without it, but any server-only operation that bypasses RLS will fail until it's set.

### B. Supabase auth configuration
In supabase.com → project → Authentication → URL Configuration:
- Add `http://localhost:3000/auth/callback` to **Redirect URLs**
- (Phase 4) Add the production Vercel URL once known

This is required for the magic-link sign-in to redirect back to the app.

### C. Vercel deploy access
Brief's Phase 0 "done" requires a successful Vercel deploy. Need either:
- Adrian links the repo to a Vercel project after first push (preferred — Vercel auto-imports from GitHub), or
- Vercel CLI token shared so I can `vercel deploy` directly

### D. API keys (deferred — needed by Phase 2+)
- Anthropic API key (Phase 2)
- Stripe test keys (Phase 4)
- Resend API key (Phase 5)
- Lulu xPress sandbox credentials (Phase 4)

Not blocking Phase 0 or Phase 1. Will surface again when each phase begins.

---

## Non-blocking — answer when convenient

### E. Marketing copy
Brief allows me to write placeholder copy in the right voice. Do you have copy drafted for `/`, `/examples`, `/pricing`, `/about`, `/faq`? Or should I draft and you'll edit?

### F. Analytics provider (Phase 5)
Plausible (privacy-first, simple, $9/mo) or PostHog (free tier with funnels + feature flags, more complex)?

### G. Co-author flow specifics
- Should an invited co-author need to create their own account, or magic-link only?
- What sections of the zine are visible to a co-author vs. owner-only?
- Can a co-author edit the owner's sections, or only their own?

### H. Issue numbering
Each zine has an `issue_number`. Per-user (Adrian's Issues I, II, III) or global? When does it increment — on first publish, on reissue, on duplicate?

### I. Free tier limits
The output chooser shows "free-tier limits." What can a free user generate — preview only? Watermarked PDF? Web edition without download?

---

## Resolved (moved to DECISIONS.md on 2026-05-09)

- ~~Tech stack confirmation~~
- ~~Domain name~~
- ~~Pricing tiers (deferred until prototype works)~~
- ~~Print fulfillment partner (Lulu)~~
- ~~Email provider (Resend)~~
- ~~Figma vs. prototype canon~~
