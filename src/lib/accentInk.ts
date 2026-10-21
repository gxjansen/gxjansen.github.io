import type { Accent } from "../data/homeContent";

/**
 * Text colour ("ink") for a card accent, per theme.
 *
 * Cards are tinted with the Rosé Pine Main accent (`--ac`, e.g. foam #9ccfd8).
 * Those pastels read well as text on the dark base, but on the cream light-mode
 * cards they only reach 1.5–2.8:1, and even the Dawn `-light` variants of foam,
 * iris, rose and gold stay under the WCAG AA 4.5:1 needed for the small tag,
 * status and "Read" labels. So text uses a separate ink that is the nearest
 * passing shade of the same hue:
 *
 * - foam: pine (#31748f), the next teal down the Rosé Pine scale.
 * - pine: pine Dawn (#286983); pine Main on its own tint is 4.25:1.
 * - love: love Dawn (#a8505d).
 * - rose: love Dawn as well; a darkened rose Dawn that clears AA lands on
 *   practically the same colour (#a25250).
 * - iris, gold: no palette token is dark enough, so they get their own ink
 *   tokens (`--color-iris-ink` #7a6492, `--color-gold-ink` #a55d00): the Dawn
 *   colour darkened in OKLCH with its chroma kept, just far enough to clear
 *   AA. Mixing toward the dark base instead greyed gold out into brown.
 *
 * Dark mode keeps the Main accent, except pine (2.8:1 on the dark card), which
 * moves to the dark-mode brand teal step `--color-primary-400` (#54a3c2).
 *
 * The tint behind the text keeps using `--ac`, so the cards look the same.
 * Consumed by `.art .tg`, `.art .read`, `.proj .nm` and `.proj .st` in
 * src/styles/components/home.css.
 */
const LIGHT_INK: Record<Accent, string> = {
  foam: "var(--color-pine)",
  pine: "var(--color-pine-light)",
  love: "var(--color-love-light)",
  rose: "var(--color-love-light)",
  iris: "var(--color-iris-ink)",
  gold: "var(--color-gold-ink)",
};

const DARK_INK: Record<Accent, string> = {
  foam: "var(--color-foam)",
  pine: "var(--color-primary-400)",
  love: "var(--color-love)",
  rose: "var(--color-rose)",
  iris: "var(--color-iris)",
  gold: "var(--color-gold)",
};

/** Inline-style custom properties for an accent's light and dark text ink. */
export const accentInk = (accent: Accent): string =>
  `--ac-ink:${LIGHT_INK[accent]};--ac-ink-dark:${DARK_INK[accent]}`;
