/* APCA (WCAG 3 perceptual contrast) audit for the site's key text/bg token pairs.
   Implements APCA-W3 0.1.9. Lc magnitude interpretation (readability guidance):
     |Lc| >= 75  body text (small, ~16px normal weight)      — strong
     |Lc| >= 60  larger/heavier body & fluent text (~18-24px) — ok
     |Lc| >= 45  large headings (~24px bold)                  — headings only
     |Lc| >= 30  minimum for any text; non-text UI / icons
   Run: node scripts/apca-audit.mjs */

const Rco = 0.2126729, Gco = 0.7151522, Bco = 0.072175;
const normBG = 0.56, normTXT = 0.57, revTXT = 0.62, revBG = 0.65;
const blkThrs = 0.022, blkClmp = 1.414, scale = 1.14;
const loOffset = 0.027, deltaYmin = 0.0005, loClip = 0.1;

const hexToRgb = (h) => {
  const n = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
const sRGBtoY = ([r, g, b]) =>
  Rco * (r / 255) ** 2.4 + Gco * (g / 255) ** 2.4 + Bco * (b / 255) ** 2.4;

function apca(txtHex, bgHex) {
  let txtY = sRGBtoY(hexToRgb(txtHex));
  let bgY = sRGBtoY(hexToRgb(bgHex));
  if (txtY <= blkThrs) txtY += (blkThrs - txtY) ** blkClmp;
  if (bgY <= blkThrs) bgY += (blkThrs - bgY) ** blkClmp;
  if (Math.abs(bgY - txtY) < deltaYmin) return 0;
  let out;
  if (bgY > txtY) {
    const sapc = (bgY ** normBG - txtY ** normTXT) * scale;
    out = sapc < loClip ? 0 : sapc - loOffset;
  } else {
    const sapc = (bgY ** revBG - txtY ** revTXT) * scale;
    out = sapc > -loClip ? 0 : sapc + loOffset;
  }
  return out * 100;
}

const light = "#faf4ed"; // base-100 / --color-background
const lightSurface = "#fffaf3"; // base-50
const dark = "#191724"; // base-950 / background-dark

const pairs = [
  // --- LIGHT MODE (on cream page bg) ---
  ["light body: base-950", "#191724", light],
  ["light muted: base-600 (nav/footer)", "#565270", light],
  ["light subtle: base-500", "#5f5b76", light],
  ["light faint: base-400", "#9893a5", light],
  ["light rp-subtle-light", "#797593", light],
  ["light rp-muted-light", "#9893a5", light],
  ["light link: primary-600", "#286983", light],
  ["light link hover: primary-700", "#1f5a73", light],
  ["light muted on surface: base-600/base-50", "#565270", lightSurface],
  // --- DARK MODE (on Main base bg) ---
  ["dark body: rp-text", "#e0def4", dark],
  ["dark subtle: base-500(dark) NEW #b8b3cd", "#b8b3cd", dark],
  ["dark muted:  base-600(dark) NEW #a5a0bd", "#a5a0bd", dark],
  ["dark link resting: primary-300 NEW #9ccfd8", "#9ccfd8", dark],
  ["dark link hover:   primary-200 NEW #b8d5df", "#b8d5df", dark],
  // Known remaining (shared token, left as-is): nav/footer resting link text
  ["dark nav/footer link: base-400 #9893a5 (unchanged)", "#9893a5", dark],
];

const flag = (lc) => {
  const a = Math.abs(lc);
  if (a >= 75) return "STRONG (body ok)";
  if (a >= 60) return "OK (large/fluent text)";
  if (a >= 45) return "HEADINGS ONLY";
  if (a >= 30) return "WEAK (non-text/icon only)";
  return "FAIL";
};

console.log("APCA Lc — |Lc| and readability tier\n");
for (const [label, txt, bg] of pairs) {
  const lc = apca(txt, bg);
  console.log(
    `${Math.abs(lc).toFixed(1).padStart(6)}  ${flag(lc).padEnd(24)}  ${label}`,
  );
}
