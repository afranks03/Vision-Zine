# Vision Zine — design system bridge to Figma

The build itself is the source of truth. `tokens.json` mirrors the values in
`src/app/globals.css` so Figma can stay in sync without anyone having to copy
hex codes by hand.

## Setup (one-time, ~5 min)

1. Open the Figma file you want to design in.
2. **Plugins → Find more plugins → "Tokens Studio for Figma"** → Install.
3. Run the plugin. It opens a panel on the right.
4. In the plugin: **Settings → Tools → Sync providers → Add new → File** →
   point it at `design/tokens.json` in this repo. (Or use the GitHub provider
   and point at `afranks03/Vision-Zine` → `main` → `design/tokens.json` for
   automatic pulls.)
5. **Pull** — the plugin imports every brand color, font family, type ramp,
   spacing value, and composite typography style into Figma Variables and
   Styles.

## What you get

After the first sync, Figma will have:

- **Color variables** — both the raw brand palette (`color.brand.yellow`,
  `color.brand.coral`, …) and the semantic aliases (`color.semantic.primary`,
  `color.semantic.surface`, …) that reference the brand colors. Change
  `brand.yellow` once; every semantic alias updates.
- **Font family / weight / size / line-height / letter-spacing scales** as
  individual tokens.
- **Composite typography styles** — `typography.masthead`, `typography.h1`,
  `typography.h2`, `typography.h3`, `typography.h4`, `typography.prose`,
  `typography.body`, `typography.eyebrow`, `typography.meta`. Apply these as
  text styles in Figma; they bundle family + weight + size + line-height +
  letter-spacing in a single click.
- **Spacing scale** matching the Tailwind values used in the build
  (`spacing.6` = 24, `spacing.section` = 140, etc.).
- **Border radius** (always 0 for editorial, `full` for badges) and
  **borderWidth** (hairline = 1, heavy = 2).

## When the build changes

Anyone with edit access to the Figma file:

1. Pull the latest `tokens.json` (Tokens Studio plugin → Sync providers → Pull).
2. Tokens Studio offers a diff; apply the changes.
3. Figma updates everywhere those tokens are used.

When **Figma** is the source of truth for a change (rare — only when a
designer is iterating on tokens), the workflow runs in reverse: edit in
Tokens Studio → Push → opens a PR that updates `tokens.json` here → merge
→ I update `globals.css` to match.

## Why static font sizes (not `clamp()`)?

The actual production CSS uses `clamp(min, fluid, max)` for headlines so they
scale gracefully on mobile. Figma doesn't have a fluid type concept, so
`tokens.json` ships **desktop-max values**. When designing for mobile in
Figma, eyeball-divide by ~2 for the biggest displays (the masthead clamps
from 240px down to 72px, for example) — or design at both breakpoints if you
want to be precise.

## What's NOT in tokens.json (yet)

- Page-level layouts (those live in the build, not in tokens)
- Shadow tokens (the editorial system uses none — sharp corners and hairline
  rules, no shadows)
- Animation tokens (only one keyframe — `fadeUp` on display headlines)

## Files

| File | Purpose |
|------|---------|
| `tokens.json` | The brand tokens themselves, in Tokens Studio JSON v2 schema |
| `README.md` | This file |

## Related

- `src/app/globals.css` — the production-side source of truth for every token here
- `src/components/editorial.tsx` — the typed primitives that compose tokens into components
- `reference/Vision_3.0.html` — the original prototype these tokens were extracted from
