# Screenshots

Auto-captured PNGs of every public route at desktop (1440×900) and mobile
(390×844 — iPhone 14) viewports. Useful as a Figma reference layer.

## How to refresh

```bash
# Make sure the dev server is running on http://localhost:3000
pnpm dev

# In another terminal:
pnpm exec node scripts/screenshot.mjs

# Or against production:
BASE_URL=https://vision-zine.vercel.app pnpm exec node scripts/screenshot.mjs
```

Files write into this directory, overwriting any previous capture.

## How to use in Figma

1. **New Figma file → Page → drag the PNGs in.**
2. Place desktop versions in one column, mobile versions in another, label
   each pair by route.
3. (Optional) lock the layer so you can annotate over them without dragging.

These are flat references — they do **not** sync to live code. The
single-page interactive reference is [`/styleguide`](https://vision-zine.vercel.app/styleguide).
The design tokens that flow into Figma Variables live in
[`design/tokens.json`](../tokens.json).

## What's not captured

`/app`, `/app/new`, `/app/zines/[id]` are auth-gated. Capturing them would
require injecting a Supabase session cookie. Out of scope for the
auto-capture pass — Adrian can screenshot signed-in views manually if a
Figma frame for the app is needed.
