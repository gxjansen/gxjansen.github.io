# gui.do (gxjansen.github.io)

Guido X Jansen's personal site. Astro 7, Tailwind v4 (Vite plugin), MDX, React islands, Netlify. Static output plus a few on-demand routes (`prerender = false`: `/now`, `/bookshelf`, `/ama/q/[id]`, `/api/*`, `/internal/*`). Default branch is `master`.

## Workflow

- Work in a worktree off `origin/master`. Never edit the main checkout.
- Node 24 (`.nvmrc`). Install with `npm ci`.
- Squash-merge PRs after the required checks pass: Build, Test, Format, Type Check, axe.
- Commit messages and PR text are plain and neutral. No AI attribution, no Co-Authored-By.
- `.gitignore` ignores `AGENTS.md`; this file (`CLAUDE.md`) is the committed agent guidance.

## Commands

- `npx astro check` (type check, must be 0 errors)
- `npx vitest run` (unit tests; `npm test` is watch mode)
- `npm run format:check` / `npm run format` (Prettier over `src/`; the pre-commit hook formats staged files)
- Build: `flock /tmp/guido-astro-build.lock npx astro build` (the lock stops parallel sessions building at once). `npm run build` also runs the Standard.site publish and robots test.
- `npm run test:a11y` runs Playwright axe against the built site.
- `npm run test:urls` hits external sites; opt-in only.

## Where things live

- Posts: `src/content/post/<slug>/index.mdx`. Other collections: `src/content/{authors,countries,otherPages,presentations,services}`.
- Structured site data: `src/data/` (`events.snapshot.json`, `events-overrides.json`, `homeContent.ts`, `press-coverage.ts`, `socialLinks.ts`, `training.ts`, ...).
- Pages: `src/pages/`. Files prefixed `_` (`_retainer.astro`, `_training*`) are not routed.
- Styles: `src/styles/` (`tailwind.css` has the `@theme` tokens). Design notes: `DESIGN.md`.
- Netlify Functions: `netlify/functions/` (newsletter via Listmonk, ALTCHA challenge).
- Redirects and headers: `netlify.toml`, `public/_redirects`.

## Known traps

- No `@apply` in `.scss`: the Tailwind Vite plugin skips `.scss`. Use plain CSS or utility classes.
- `compressHTML: true` in `astro.config.mjs` is intentional. Astro 7's default (`'jsx'`) strips whitespace between inline elements.
- Netlify Functions are v2: `export default async (req: Request): Promise<Response>` plus `export const config`. No custom `path`; they stay under `/.netlify/functions/<name>`.
- `src/data/__tests__/validateUrls.test.ts` needs the network and only runs with `RUN_URL_TESTS=1`.
- Testimonials on `/` and `/about/` are randomized per build, so those pages differ between builds.
- `scripts/standard-site-publish.mjs` runs inside `npm run build` but only publishes on Netlify production builds (`CONTEXT=production`) or local manual runs. Previews and branch deploys skip it before reading credentials.
- `src/icons/` holds only the icons the site uses. astro-icon loads and optimizes every file in it on each build, which is why the full Tabler set was removed. To add an icon, copy its SVG from https://tabler.io/icons into `src/icons/tabler/...` (or use one from the `tabler` iconify set listed in `astro.config.mjs`). A missing icon name fails the build.
- `src/data/events.snapshot.json` is generated. Edit `events-overrides.json` for manual corrections, not the snapshot.

## Events snapshot

`.github/workflows/events-snapshot.yml` runs daily (05:17 UTC), runs `npm run events:snapshot` to refresh the snapshot from Guido's AT Protocol records, and opens a data-only PR that auto-merges after checks. It needs the `EVENTS_SNAPSHOT_TOKEN` secret.

## CI

- `ci.yml`: build, test, format, typecheck. `a11y.yml`: axe. `lighthouse.yml`: Lighthouse CI. `codeql.yml`: CodeQL.
- `links.yml`: lychee on `dist/`, weekly. Never blocks. Opens or updates one issue when links break. False positives go in `.lycheeignore` with a comment.
- `pages-redirect.yml`: manual. Replaces the GitHub Pages copy (dev.gui.do, gxjansen.github.io) with a redirect to gui.do.
