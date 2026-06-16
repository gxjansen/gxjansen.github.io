/* =====================================================================
   Static assets embedded into the OG cards.
   ---------------------------------------------------------------------
   Read once at module init (Node only). The avatar becomes an inline
   base64 data URI so Satori can rasterize it without a network/file
   lookup; the emoji SVG is returned by satori's loadAdditionalAsset so
   "👋" renders as a local Twemoji glyph (offline-safe, no per-build fetch).
   ===================================================================== */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ogDir = join(process.cwd(), "src/lib/og");

/** Caricature avatar as a data URI (gold ring is applied via boxShadow). */
export const AVATAR_DATA_URI = `data:image/png;base64,${readFileSync(
  join(ogDir, "avatar.png"),
).toString("base64")}`;

/** Waving-hand Twemoji SVG (👋, U+1F44B), inlined for loadAdditionalAsset. */
const WAVE_SVG = readFileSync(join(ogDir, "emoji/1f44b.svg"), "utf-8");

/** Codepoint → local SVG map. Only the glyphs we actually use. */
const EMOJI_SVG: Record<string, string> = {
  "1f44b": WAVE_SVG,
};

/** Convert a grapheme to its lowercase hex codepoint(s) joined by '-'. */
function toCodePoint(text: string): string {
  const points: string[] = [];
  for (const ch of text) {
    points.push(ch.codePointAt(0)!.toString(16));
  }
  // Drop a trailing variation selector (FE0F) — Twemoji filenames omit it.
  return points.filter((p) => p !== "fe0f").join("-");
}

/**
 * satori loadAdditionalAsset handler. For `code === "emoji"` satori passes
 * the emoji grapheme as `text`; return a data-URI SVG so it embeds inline.
 * Anything else returns "" (let satori fall through to fonts).
 */
export async function loadAdditionalAsset(
  code: string,
  text: string,
): Promise<string> {
  if (code !== "emoji") return "";
  const key = toCodePoint(text);
  const svg = EMOJI_SVG[key];
  if (!svg) return "";
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
