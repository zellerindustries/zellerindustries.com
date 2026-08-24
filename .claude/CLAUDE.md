# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing/landing site for Zeller Industries (zellerindustries.com), an Italian software engineering / IT consulting company. Static HTML/CSS site (Italian content, `lang="it"`), no client-side framework. One page (the contact form) has a TypeScript handler under `src/scripts/`, bundled by minimaz-cli into `dist/scripts.js`; everything else is plain HTML/CSS.

## Commands

```bash
npm run build   # npx mz b — builds src/ into dist/ via minimaz-cli (minimaz.config.json)
npm run start   # build, then serve ./dist locally with `serve`
```

There is no lint or test suite configured. The closest thing to linting is minimaz's own validator, run directly (not wired into package.json):

```bash
npx minimaz validate --path=<file>   # validates a single HTML/CSS/JS/TS/JSON file
```

To build a single page for a quick check, just run `npm run build` — minimaz builds the whole `src/` tree each time (there's no per-page build).

## Architecture

**Build tool**: [minimaz-cli](https://github.com/zeller-dev/minimaz-cli) (`mz`), configured via `minimaz.config.json`. It reads `src/`, flattens `pages/`, `styles/`, `public/` into the output root (per the `input.mapping` in the config — all mapped to `""`), bundles + minifies CSS/HTML/JS, and writes to `dist/`. `bootstrap-icons` fonts are pulled in via `input.externals` and their referenced paths rewritten via `output.replace`.

**Page → CSS wiring**: pages do not import their own stylesheets individually. `src/style.css` is the single bundle entry point, pulled in via `@import` in this fixed order:

```
root.css → bootstrap-icons.css → header.css → prefers.css → hero.css → footer.css
→ bottom-bar.css → buttons.css → tiles.css → cards.css → form.css
```

Every top-level page (`index.html`, `linkinbio.html`, `contact.html`, `form.html`) links only `/style.css`. Sub-section pages under `legal/` and `referral/` link `/style.css` **plus** their own local stylesheet (`legal.css`, `referral.css`) that lives next to them — those are not in the `@import` chain, they're linked directly in each page's `<head>`.

When adding a new component stylesheet, it only takes effect site-wide if you add an `@import` for it in `src/style.css`; page-local CSS (like `legal.css`/`referral.css`) is the pattern for styling scoped to one section instead.

**Design tokens**: all colors, spacing, font sizes, and radii are CSS custom properties defined once in `src/styles/root.css` (`:root`), built on a golden-ratio scale (`--ratio: 1.618`) for both `--fs-*` and `--space-*`. Dark theme only (`color-scheme: dark`). New styles should consume these variables rather than hardcoding values.

**Pages present**:
- `src/pages/index.html` — main landing page (hero, services, portfolio, collaborators, socials, contact — all single-page sections)
- `src/pages/linkinbio.html`
- `src/pages/contact.html` — `/contact`, static contact info (email/WhatsApp/socials), no form
- `src/pages/form.html` — `/form`, the actual contact form; behavior lives in `src/scripts/form.ts`
- `src/pages/legal/{privacy,terms,cookie}.html` + `legal.css`
- `src/pages/referral/{index,terms}.html` + `referral.css`

**Contact form** (`src/pages/form.html` + `src/scripts/form.ts`): client-side only, no server in this repo. Validates fields, applies a honeypot field and a minimum-fill-time check for bot filtering, and rate-limits repeat submissions via a `localStorage` timestamp lock (24h). On submit it POSTs JSON directly to an external AWS Lambda function URL (hardcoded in `form.ts`) — there's no local API route to look for. `contact.html`'s "Contact Us" nav CTA and the form page are separate destinations; don't assume one links to the other beyond what's currently in the markup.

**Assets**: `src/public/` maps straight to the output root (favicons, `robots.txt`, `sitemap.xml`, `llms.txt`, images under `assets/`, fonts). `src/public/llms.txt` is a structured plain-text summary of the company (services, portfolio, contacts) intended for LLM crawlers — keep it in sync with `index.html` content if either changes.

## Skills

- **claude-in-chrome** — before calling any CSS/layout change done, run `npm run start` and drive a real browser against `localhost` to check it, rather than relying on reading the CSS.
- **design-sync** (`/design-sync`, backed by the `DesignSync` tool) — use to push components in `src/styles/` to a claude.ai/design project incrementally, or pull design changes back into these files. Only relevant when the user is actively working component-by-component against a Design System project on claude.ai, not for routine page edits.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: `npm ci --omit=dev` → `npm run build` → verifies `dist/index.html` exists → rsyncs `dist/` over SSH to the production server (self-hosted, not GitHub Pages, despite the repo name). Secrets used: `SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`, `SERVER_USER`, `SERVER_IP`, `SERVER_PATH`.
