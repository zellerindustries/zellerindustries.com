# 60/30/10 Color Rebalance — Design

## Goal

Rework the main site's color usage (root.css tokens + the components that consume them) so it reads as a clean 60/30/10 palette: one dominant neutral, one secondary neutral, and a single accent color used sparingly for high-impact moments only.

## Scope

Main site only: `root.css`, `header.css`, `hero.css`, `buttons.css`, `cards.css`, `tiles.css`, `footer.css`, `bottom-bar.css`, `form.css`, `prefers.css`.

Out of scope: `legal.css` and `referral.css`, which intentionally use their own separate palettes already (legal.css documents this explicitly). Not touched by this change.

## Color roles

- **60% Dominant — `--clr-bg-main` (`#041e2f`)**: page background. Already the largest surface on every page (body, hero, section backgrounds). No change.
- **30% Secondary — `--clr-surface` (`#1f1f1f`)**: all component/panel backgrounds — buttons, cards, header, footer, bottom bar, tiles, form fields. `cards.css` currently uses a separate near-duplicate token, `--card-bg` (`#16161a`), instead of `--clr-surface`. This gets folded into `--clr-surface` so there's one consistent secondary tone instead of two barely-different near-blacks. `--card-bg` is removed from `root.css`.
- **10% Accent — `--clr-primary` (`#cc6600`, orange)**: reserved for:
  - Primary buttons (`.btn.primary`, header nav CTA)
  - Active/current-page states (`aria-current="page"` styling, focus-visible rings)
  - The hero `ZELLER INDUSTRIES` wordmark — kept as the one flagship, non-repeated brand moment (unlike h2 section titles, which appear 5+ times per page and are moving to neutral)
  - Small icon glyphs (e.g. `.tile.base` icon color) — a glyph carries negligible visual area even when it recurs, so this doesn't work against the 10% budget the way large text blocks or filled surfaces would

## What moves off orange

`h2` section titles (`Servizi`, `Portfolio`, `Contatti`, etc.) switch from `var(--clr-primary)` to `var(--clr-text-main)` (neutral). This is the single biggest change in visual weight — headings recur on every page and were the largest source of orange "ink" beyond a true accent role.

## Blue's new role

`--clr-accent` (`#006699`, blue) stops appearing on any filled surface and is kept only as a sparing tertiary touch:

- Link hover/focus color (`root.css`'s existing `a:hover, a:focus-visible { color: var(--clr-accent-hover) }` — unchanged, this is already sparing)
- Everywhere else blue currently fills a surface, it's removed:
  - `.btn.secondary` (`buttons.css`): stops being blue-filled. Becomes a neutral outline/ghost button — transparent background, `var(--clr-border)`-toned border, `var(--clr-text-main)` text. On hover, the border and text pick up `var(--clr-primary)` as a small interactive-only accent touch (not a permanent second fill color).
  - Header nav CTA button (`header.css`, `#main-nav a.btn.cta`): currently a **hardcoded** `#006eb3`/`#005b94` blue, not even tied to the `--clr-accent` token. Becomes orange-filled using the real `--clr-primary`/`--clr-primary-hover` tokens, since it's literally the header's primary call-to-action and should read as the accent, not a second brand color.

## Non-goals / things intentionally left alone

- `--clr-accent`'s hex value itself is not changed, only where it's used. Light-mode overrides in `prefers.css` need no structural change since token names are stable.
- The scrollbar thumb (`::-webkit-scrollbar-thumb { background: var(--clr-primary) }`) stays orange — a tiny, functional UI element, not a layout color area.
- `legal.css` / `referral.css` palettes are untouched (see Scope).

## Files touched

| File | Change |
|---|---|
| `root.css` | `h2` color → `var(--clr-text-main)`; remove `--card-bg` custom property |
| `cards.css` | `.card` background → `var(--clr-surface)` (was `var(--card-bg)`) |
| `buttons.css` | `.btn.secondary` restyled from blue-filled to neutral outline/ghost with orange hover accent |
| `header.css` | `#main-nav a.btn.cta` background/border/hover from hardcoded blue hex → `var(--clr-primary)` / `var(--clr-primary-hover)` |

No changes needed to `hero.css`, `tiles.css`, `footer.css`, `bottom-bar.css`, `form.css`, or `prefers.css` — their existing color usage already fits the roles above once the four files above change.

## Testing / verification

Static site, no test suite. Verification is: `npm run build` succeeds, `npx minimaz validate` passes on all changed files, and a manual visual check (via `npm run start` + browser, or screenshots if browser tooling is unavailable) confirming:
- No blue fill remains on any button or surface
- Section headings read as neutral text, not orange
- Orange still clearly reads as "the" accent on primary CTAs and active states
