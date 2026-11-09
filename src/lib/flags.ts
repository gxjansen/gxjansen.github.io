/**
 * Flags: the one place that maps a country (or region) code to its SVG in
 * src/assets/flags and to an English name. Used by /where, events, the
 * homepage flags marquee and <Flag>/<FlagText>.
 *
 * Flag emoji are not used for display: Windows has no flag emoji and shows
 * letter pairs ("NL") instead. Text from outside (Grain, Bluesky) goes through
 * splitFlagEmoji() so its flags render as these SVGs too.
 */
import type { ImageMetadata } from "astro";
import { countryName } from "./where";

const flags = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/flags/*.svg",
  { eager: true },
);

/** Normalises "NL" / "nl" / "GB-SCT" to the asset file name ("nl", "gb-sct"). */
const key = (code: string) => code.trim().toLowerCase();

/** Image metadata for astro:assets <Image>, or null when there is no flag. */
export function flagImage(code: string): ImageMetadata | null {
  return flags[`/src/assets/flags/${key(code)}.svg`]?.default ?? null;
}

/** URL of the flag SVG, or null when there is no flag. */
export function flagSrc(code: string): string | null {
  return flagImage(code)?.src ?? null;
}

// Subdivision flags have no ISO 3166-1 region name in Intl.
const SUBDIVISION_NAMES: Record<string, string> = {
  "gb-eng": "England",
  "gb-sct": "Scotland",
  "gb-wls": "Wales",
  "gb-nir": "Northern Ireland",
};

/** English name for a flag code ("NL" -> "Netherlands", "gb-sct" -> "Scotland"). */
export function flagName(code: string): string {
  const k = key(code);
  return SUBDIVISION_NAMES[k] ?? countryName(k.toUpperCase());
}

/**
 * Flag emoji: a pair of regional indicators (🇳🇱), or a black flag followed by
 * tag characters and a cancel tag (🏴 + "gbsct" = Scotland).
 */
const FLAG_EMOJI =
  /([\u{1F1E6}-\u{1F1FF}]{2})|\u{1F3F4}([\u{E0061}-\u{E007A}]+)\u{E007F}/gu;

const REGIONAL_A = 0x1f1e6;
const TAG_A = 0xe0061;

/** Flag code for one flag emoji ("🇳🇱" -> "nl", Scotland's -> "gb-sct"). */
export function flagCodeFromEmoji(emoji: string): string | null {
  const m = new RegExp(FLAG_EMOJI.source, "u").exec(emoji);
  if (!m) return null;
  if (m[1]) {
    return [...m[1]]
      .map((c) => String.fromCharCode(97 + c.codePointAt(0)! - REGIONAL_A))
      .join("");
  }
  const tag = [...m[2]]
    .map((c) => String.fromCharCode(97 + c.codePointAt(0)! - TAG_A))
    .join("");
  return `${tag.slice(0, 2)}-${tag.slice(2)}`;
}

export type FlagTextPart =
  | { type: "text"; value: string }
  | { type: "flag"; code: string; emoji: string };

/**
 * Splits text into plain parts and flag emoji. Flags without an SVG stay as
 * text, so nothing is lost.
 */
export function splitFlagEmoji(text: string): FlagTextPart[] {
  const parts: FlagTextPart[] = [];
  let last = 0;
  for (const m of text.matchAll(FLAG_EMOJI)) {
    const code = flagCodeFromEmoji(m[0]);
    if (!code || !flagImage(code)) continue;
    if (m.index > last) {
      parts.push({ type: "text", value: text.slice(last, m.index) });
    }
    parts.push({ type: "flag", code, emoji: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
}
