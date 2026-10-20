# gui.do website

The source of [gui.do](https://gui.do), the personal site of Guido X Jansen: blog posts, talks, podcasts, press, events, CV and a newsletter signup. It replaced a Webflow site; [this article](https://gui.do/post/website-moved-to-astro/) explains the move.

### Status

[![Netlify Status](https://api.netlify.com/api/v1/badges/b6ca57ea-33ef-4185-a64e-a6b040a64805/deploy-status)](https://app.netlify.com/sites/gxjansen/deploys)
[![CodeQL](https://github.com/gxjansen/gxjansen.github.io/actions/workflows/codeql.yml/badge.svg)](https://github.com/gxjansen/gxjansen.github.io/actions/workflows/codeql.yml "Code quality workflow status")
[![PageSpeed](https://img.shields.io/badge/PageSpeed-View%20Report-4285F4?logo=pagespeedinsights)](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fgui.do)

## Stack

- [Astro 7](https://astro.build/): static pages plus a few on-demand routes (`/now`, `/bookshelf`, `/ama/q/[id]`, `/api/*`).
- [Tailwind CSS v4](https://tailwindcss.com/) through the `@tailwindcss/vite` plugin, with plain CSS partials in `src/styles/`.
- [MDX](https://mdxjs.com/) content collections for posts, presentations, services and authors; [React](https://react.dev/) for interactive islands.
- [Netlify](https://www.netlify.com/) hosting with Netlify Functions v2 (`netlify/functions/`).
- A self-hosted [Listmonk](https://listmonk.app/) instance for the newsletter, behind an ALTCHA proof-of-work challenge.
- AT Protocol: Bluesky links and profile data, and [Standard.site](https://standard.site/) publication records for each post.

## Setup

Node 24 is required (`.nvmrc`).

```bash
nvm use
npm ci
npm run dev        # http://localhost:4321
```

`npm run dev:netlify` runs the site through the Netlify CLI so the functions work locally.

## Scripts

Development and build

| Script                | Purpose                                                                               |
| --------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`         | Astro dev server.                                                                     |
| `npm run dev:netlify` | Dev server through `netlify dev`, including functions.                                |
| `npm run build`       | Standard.site publish, `astro build`, then the robots test. This is the deploy build. |
| `npm run preview`     | Build in preview mode.                                                                |
| `npm run production`  | Build in production mode.                                                             |
| `npm run astro`       | Run the Astro CLI directly.                                                           |

Quality

| Script                           | Purpose                                                                     |
| -------------------------------- | --------------------------------------------------------------------------- |
| `npm test`                       | Vitest in watch mode (2 workers). Use `npx vitest run` once.                |
| `npm run test:urls`              | Opt-in network check of URLs in the data files.                             |
| `npm run test:a11y`              | Playwright plus axe against the built site.                                 |
| `npm run test:a11y:inventory`    | Same run, collecting all violations into a JSON summary instead of failing. |
| `npm run test:robots`            | Check the generated `robots.txt`.                                           |
| `npm run typecheck`              | `astro check`.                                                              |
| `npm run format:check`           | Prettier check over `src/`.                                                 |
| `npm run format`                 | Prettier write over `src/`.                                                 |
| `npm run validate-content`       | Validate external press coverage entries and save a report.                 |
| `npm run check:trailing-slashes` | Find internal links without a trailing slash.                               |
| `npm run check-dark-mode`        | Report text classes that lack dark-mode variants.                           |
| `npm run fix-dark-mode`          | Apply the dark-mode fixes (`fix-dark-mode:dry` previews).                   |

Content and data

| Script                          | Purpose                                                           |
| ------------------------------- | ----------------------------------------------------------------- |
| `npm run events:snapshot`       | Refresh `src/data/events.snapshot.json` from AT Protocol records. |
| `npm run optimize-images`       | Re-encode source images in place within size and quality budgets. |
| `npm run bluesky:link`          | Link a post to its Bluesky thread (needs `.env.local`).           |
| `npm run standard-site:setup`   | One-time Standard.site publication setup.                         |
| `npm run standard-site:publish` | Sync post records to the PDS (skips without credentials).         |

## Testing

- Vitest (`npx vitest run`): unit and component tests under `src/**/__tests__`. Runs in CI.
- `npm run test:urls`: checks external URLs listed in the data files. It uses the network, so it is opt-in and not part of CI. Run it before publishing new posts.
- Playwright and axe (`tests/a11y`): WCAG 2 A/AA in light and dark mode. Required check on every PR.
- Lighthouse CI (`lighthouserc.json`): scores a few built pages on every PR. Accessibility below 0.9 fails; the other categories warn.
- Links workflow (`.github/workflows/links.yml`): lychee over the built site every Monday, and on PRs that touch content, pages or data. It never blocks a merge. On the weekly run it opens or updates a single "Link check: broken links found" issue. Known false positives (bot-blocking sites, on-demand routes) are listed with comments in `.lycheeignore`.

## Deploy

Merging to `master` deploys to Netlify. Every pull request also gets a deploy preview at `https://deploy-preview-<n>--gxjansen.netlify.app`. Redirects and headers live in `netlify.toml` and `public/_redirects`.

The repository is named `gxjansen.github.io`, so GitHub Pages cannot be switched off. The manual `Pages redirect` workflow publishes a page that sends `dev.gui.do` and `gxjansen.github.io` to the same path on gui.do.

Daily, the `Events snapshot` workflow refreshes `/events` data and opens an auto-merging PR.

## Environment variables

See `.env.example` for local variables (Bluesky credentials for the scripts). Copy it to `.env.local`. Function secrets such as the Listmonk API credentials are set in Netlify and documented in `netlify/functions/README.md`.

## Design

`DESIGN.md` explains where the design system lives and how this repo implements it.
