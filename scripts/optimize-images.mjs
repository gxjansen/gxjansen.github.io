#!/usr/bin/env node
/**
 * Re-encode source images in place with sane size + quality budgets.
 * Astro generates WebP/AVIF variants at build time — this script just
 * keeps the source assets from becoming multi-MB git blobs.
 *
 * Usage:
 *   node scripts/optimize-images.mjs <path-or-glob>...
 *   node scripts/optimize-images.mjs --dry-run <path>
 *   node scripts/optimize-images.mjs --max-width 2400 <path>
 */
import { readFile, writeFile, stat } from "node:fs/promises";
import { extname, basename } from "node:path";
import { glob } from "node:fs/promises";
import sharp from "sharp";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const maxWidthIdx = args.indexOf("--max-width");
const MAX_WIDTH = maxWidthIdx !== -1 ? Number(args[maxWidthIdx + 1]) : 2000;
const JPEG_Q = 82;
const PNG_EFFORT = 9;
const WEBP_Q = 82;

const patterns = args.filter(
  (a, i) =>
    !a.startsWith("--") &&
    args[i - 1] !== "--max-width",
);

if (patterns.length === 0) {
  console.error("usage: optimize-images.mjs [--dry-run] [--max-width N] <path|glob>...");
  process.exit(1);
}

const files = [];
for (const p of patterns) {
  if (p.includes("*")) {
    for await (const f of glob(p)) files.push(f);
  } else {
    files.push(p);
  }
}

const fmt = (n) =>
  n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${(n / 1024).toFixed(0)} KB`;

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    console.log(`skip ${file} (unsupported ${ext})`);
    continue;
  }

  const before = (await stat(file)).size;
  totalBefore += before;

  const input = await readFile(file);
  let pipeline = sharp(input).rotate().resize({
    width: MAX_WIDTH,
    withoutEnlargement: true,
    fit: "inside",
  });

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: PNG_EFFORT, palette: true });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: WEBP_Q });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_Q, mozjpeg: true });
  }

  const out = await pipeline.toBuffer();
  const after = out.length;
  totalAfter += after;

  const pct = ((1 - after / before) * 100).toFixed(0);
  const tag = dryRun ? "[dry]" : "wrote";
  console.log(`${tag} ${basename(file)}  ${fmt(before)} → ${fmt(after)}  (-${pct}%)`);

  if (!dryRun && after < before) {
    await writeFile(file, out);
  } else if (!dryRun) {
    console.log(`  skipped write (would have grown)`);
  }
}

console.log(
  `\ntotal: ${fmt(totalBefore)} → ${fmt(totalAfter)} (-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}%)`,
);
