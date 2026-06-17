/* =====================================================================
   renderOgCard — Satori JSX → SVG → PNG (via @resvg/resvg-js).
   ---------------------------------------------------------------------
   Mirrors src/lib/ama/render.ts: font TTFs are read from disk once at
   module init, satori renders at 1200×630, Resvg rasterizes to PNG at a
   fixed width of 1200. Node-only.

   Fonts (registered exactly as the handoff specifies):
   - Schibsted Grotesk Black  → "Schibsted Grotesk" 900   (display)
   - Atkinson Hyperlegible Next Regular → 400             (body / lead)
   - Atkinson Hyperlegible Next Bold    → 700             (chips, pills)
   - LiebeHeide Fineliner Regular → "LiebeHeide" 400      (hand-notes)
   ===================================================================== */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as React from "react";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { loadAdditionalAsset } from "./assets";

const fontDir = join(process.cwd(), "src/lib/og/fonts");

const fonts = [
  {
    name: "Schibsted Grotesk",
    data: readFileSync(join(fontDir, "SchibstedGrotesk-Black.ttf")),
    weight: 900 as const,
    style: "normal" as const,
  },
  {
    name: "Atkinson Hyperlegible Next",
    data: readFileSync(join(fontDir, "AtkinsonHyperlegibleNext-Regular.ttf")),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Atkinson Hyperlegible Next",
    data: readFileSync(join(fontDir, "AtkinsonHyperlegibleNext-Bold.ttf")),
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    name: "LiebeHeide",
    data: readFileSync(join(fontDir, "LiebeHeideFineliner-Regular.ttf")),
    weight: 400 as const,
    style: "normal" as const,
  },
];

export async function renderOgCard(
  element: React.ReactElement,
): Promise<Buffer> {
  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts,
    loadAdditionalAsset,
    embedFont: true,
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng();
  return Buffer.from(png);
}
