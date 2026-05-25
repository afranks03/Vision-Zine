# Vision Zine — Open Questions

Questions for the founder. Answered items move to `DECISIONS.md`.

---

## Adrian review needed (Phase 1 ship-related)

### A. Marketing copy review
All marketing copy is first-draft in the brand voice. Pages and what to look at:
- **`/`** — Hero subhead ("Your year, printed like it matters."), the three step descriptions, the "Inside an issue" TOC items, the dark quote section, the CTA copy
- **`/examples`** — Six style names + blurbs + "mood" lines. Consider whether the styles map to what you actually want to build
- **`/pricing`** — Tier names (Preview / One Issue / Annual), tier descriptions, feature lists, the three "Common questions" at the bottom. Dollar amounts are `$—` until you set them
- **`/about`** — The founder essay (first 3 paragraphs use your dropcap; the four principles are pulled from the brief's voice). Email shown is `hello@visionzine.com` (placeholder)
- **`/faq`** — Four sections, 12 Q+A's total

Edit anything; the design system stays consistent regardless of word changes.

### B. Production callback URL in Supabase
Add `https://vision-zine.vercel.app/auth/callback` to Supabase → Authentication → URL Configuration → Redirect URLs. The localhost callback is already added; this lets magic-link sign-in work when users hit the production URL.

## Deferred — needed by later phases

### C. API keys (Phase 2+)
- Anthropic API key (Phase 2) — coming up next
- Stripe test keys (Phase 4)
- Resend API key (Phase 5)
- Lulu xPress sandbox credentials (Phase 4)

Will surface again when each phase begins.

### D. Co-author flow specifics (Phase 2)
Decisions needed before building co-author invitations:
- Should an invited co-author need to create their own account, or magic-link only? (Probably magic-link to match existing flow)
- What sections of the zine are visible to a co-author vs. owner-only?
- Can a co-author edit the owner's sections, or only their own?

### E. Issue numbering (Phase 2)
Each zine has an `issue_number`. Per-user (Adrian's Issues I, II, III) or global? When does it increment — on first publish, on reissue, on duplicate?

### F. Free tier limits (Phase 4)
The Preview tier — what exactly can a free user generate? Preview only? Watermarked PDF? Web edition without download?

### G. Layout preview before format selection (UX, Phase 3+ enhancement)
Adrian noted (2026-05-11) that the create-new-zine flow asks users to pick a format (Letter / Tabloid / Pocket) before they see what the magazine actually looks like. A nicer UX would let them see a sample composed layout — possibly with their first-draft data — at each format before committing. Captured for later: probably belongs in a Phase 3c slice (live split-view preview) where format is a toggle on the preview rather than a one-time decision.

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
