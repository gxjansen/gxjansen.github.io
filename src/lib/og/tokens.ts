/* =====================================================================
   Flat design tokens for the OpenGraph cards (Rosé Pine Main / dark).
   ---------------------------------------------------------------------
   Satori does NOT support color-mix(), CSS custom properties or oklch,
   so every value here is a flat hex / rgba string. Mirrors the README
   "Design tokens" table verbatim.
   ===================================================================== */

export const COLORS = {
  bg: "#191724", // canvas base
  surface: "#1f1d2e",
  overlay: "#26233a",
  fg: "#e0def4", // body / lead text
  fgStrong: "#f3f1ff", // headlines
  fgSubtle: "#908caa", // leads
  fgMuted: "#6e6a86", // byline meta, read-time
  border: "rgba(224,222,244,0.10)",
  goldRing: "#f6c177", // avatar ring
} as const;

/** The six accents. */
export const ACCENTS = {
  pine: "#3e8fb0",
  foam: "#9ccfd8",
  iris: "#c4a7e7",
  gold: "#f6c177",
  love: "#eb6f92",
  rose: "#ebbcba",
} as const;

export type AccentName = keyof typeof ACCENTS;

/** wordmark dot = pine */
export const BRAND = ACCENTS.pine;

/** Ordered list used to rotate per-article accents by index. */
export const ACCENT_ROTATION: AccentName[] = [
  "pine",
  "foam",
  "iris",
  "gold",
  "love",
  "rose",
];

/**
 * hex (#rrggbb) → rgba(r,g,b,alpha). Used to precompute the
 * color-mix(<ac> N%, transparent) chip/pill/bloom fills that Satori
 * can't evaluate. color-mix toward transparent in oklab ≈ straight
 * alpha at OG scale — close enough and visually faithful.
 */
export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Per-accent chip / pill palette (fill 13%, border 28%, text = accent). */
export function chipColors(accent: string) {
  return {
    fill: hexToRgba(accent, 0.13),
    border: hexToRgba(accent, 0.28),
    text: accent,
  };
}

/** The pine→rose corner-wash, identical on every card (README §wash). */
export const WASH_GRADIENT =
  "radial-gradient(58% 60% at 0% 0%, rgba(62,143,176,0.20) 0%, rgba(62,143,176,0.07) 42%, transparent 72%), " +
  "radial-gradient(60% 64% at 100% 100%, rgba(235,188,186,0.11) 0%, transparent 62%)";

/** Per-card accent bloom behind the headline (README §bloom, flattened). */
export function bloomGradient(accent: string): string {
  return `radial-gradient(46% 52% at 12% 46%, ${hexToRgba(accent, 0.16)} 0%, transparent 70%)`;
}

/** Font family names — must match the registrations in render.ts. */
export const FONTS = {
  display: "Schibsted Grotesk",
  body: "Atkinson Hyperlegible Next",
  hand: "LiebeHeide",
} as const;
