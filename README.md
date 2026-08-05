# Zeller Industries — Website

Source for [zellerindustries.com](https://zellerindustries.com), the marketing site for Zeller Industries (software engineering / IT consulting, Italy). Static HTML/CSS, no client-side framework.

## Stack

Built with [minimaz-cli](https://github.com/zeller-dev/minimaz-cli), a minimal static site builder. No JS framework, no client-side bundler beyond minimaz's own CSS/HTML bundling.

## Commands

```bash
npm run build   # build src/ into dist/ via minimaz-cli (minimaz.config.json)
npm run start   # build, then serve ./dist locally
```

There's no lint or test suite. The closest thing to linting is minimaz's own validator:

```bash
npx minimaz validate --path=<file>   # validates a single HTML/CSS/JS/TS/JSON file
```

## Structure

```
src/
├── pages/            # one HTML file/folder per route
│   ├── index.html          → /
│   ├── contact.html        → /contact
│   ├── linkinbio.html      → /linkinbio
│   ├── form.html           → /form (in progress)
│   ├── legal/               → /legal/{privacy,terms,cookie}
│   └── referral/             → /referral, /referral/terms
├── styles/           # modular CSS, bundled via src/style.css's @import chain
├── style.css         # bundle entry point — @imports everything in styles/
└── public/           # assets, fonts, favicon, robots.txt, sitemap.xml, llms.txt
```

Design tokens (colors, spacing, type scale) live in `src/styles/root.css` as CSS custom properties, on a golden-ratio scale. The color system follows a 60/30/10 split: dark navy dominant, dark surface secondary, orange as the sole accent color used sparingly for CTAs and active states.

`legal/legal.css` and `referral/referral.css` are page-local stylesheets, not part of the main `@import` bundle — linked directly in those pages' `<head>`.

## Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and rsyncs `dist/` to the production server over SSH — not GitHub Pages, despite the repo name.

## More detail

See `.claude/CLAUDE.md` for the fuller build/architecture rundown aimed at AI coding assistants working in this repo.
