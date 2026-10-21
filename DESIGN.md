# Design system

The canonical gui.do design system lives **outside this repo**, as a Claude skill:

- **Skill:** `~/.claude/skills/guido-design/` (invoke with `/guido-design`)
- Synced across devices via chezmoi → Codeberg.
- Source: the "gui.do Design System v2" handoff bundle from claude.ai/design.

It holds the tokens (Rosé Pine colours, type, spacing, radii, shadows, motion),
the component specs, brand assets, the avatar studio, and an adherence linter.

## This repo is the *implementation*, not the source of truth

The live tokens are in `src/styles/tailwind.css` (`@theme`) and the component
classes in `src/styles/components/redesign.css` / `home.css`. When a design
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

## Accent text ink (light mode)

Pastel accents fail WCAG AA as small text on the cream background, so card
tags, status labels and "Read" links use a darker "ink" of the same hue in
light mode (`src/lib/accentInk.ts`). Dark mode keeps the Main accent, except
pine, which uses `#54a3c2`.

| Accent | Light-mode ink |
|---|---|
| foam | pine `#31748f` |
| pine | pine Dawn `#286983` |
| love, rose | love Dawn `#a8505d` |
| iris | `--color-iris-ink` `#7a6492` |
| gold | `--color-gold-ink` `#a55d00` |

Iris and gold inks are the Dawn colour darkened in OKLCH with chroma kept, to
at least 4.5:1 on a 12% accent tint. Mirrored in the guido-design skill
(`SKILL.md`, "Accent text ink").

