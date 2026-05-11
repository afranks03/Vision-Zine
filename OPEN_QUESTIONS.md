# Vision Zine — Open Questions

Questions for the founder. Answered items move to `DECISIONS.md`.

---

## Small follow-up before Phase 1 auth works in production

### A. Production callback URL in Supabase
Add `https://vision-zine.vercel.app/auth/callback` to Supabase → Authentication → URL Configuration → Redirect URLs. The localhost callback is already added; this lets magic-link sign-in work when users hit the production URL.

## Deferred — needed by later phases

### D. API keys (Phase 2+)
- Anthropic API key (Phase 2)
- Stripe test keys (Phase 4)
- Resend API key (Phase 5)
- Lulu xPress sandbox credentials (Phase 4)

Will surface again when each phase begins.

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
