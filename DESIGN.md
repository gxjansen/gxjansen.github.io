# Design system

The canonical gui.do design system lives **outside this repo**, as a Claude skill:

- **Skill:** `~/.claude/skills/guido-design/` (invoke with `/guido-design`)
- Synced across devices via chezmoi → Codeberg.
- Source: the "gui.do Design System v2" handoff bundle from claude.ai/design.

It holds the tokens (Rosé Pine colours, type, spacing, radii, shadows, motion),
the component specs, brand assets, the avatar studio, and an adherence linter.

## This repo is the *implementation*, not the source of truth

The live tokens are in `src/styles/tailwind.css` (`@theme`) and the component
classes in `src/styles/components/_redesign.scss` / `_home.scss`. When a design
token changes, change it in the skill first, then mirror it here, so the two
don't drift.

## Known drift vs the v2 system (as of the redesign)

- Dark-mode brand teal: site uses `#31748f` (`--color-primary-500`); v2 uses a
  brighter `#3e8fb0`.
- Dark page background: site `--color-background-dark` is `#1a1825` (and is
  internally inconsistent with `--color-base-950` `#191724`); v2 uses `#191724`.
- Signature background: v2 specifies a fixed pine/rose corner-wash; the site
  currently uses an animated noise overlay.
- Minor: `base-300` (`#dfdad3` vs `#dfdad9`), `base-700` (`#393552` vs
  `#403d52`/`#524f67`).

Fonts, accent colours (love/gold/rose/foam/iris) and the atproto app-source
accents all match.
