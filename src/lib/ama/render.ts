/* =====================================================================
   renderAmaCard — Satori JSX → SVG → PNG (via @resvg/resvg-js).
   Node-only. Reads font TTFs from disk at module init so subsequent
   renders don't re-read them.
   ===================================================================== */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { AmaCard, type Persona, type Variant } from "./card";
import { OgFeedStack } from "./og";

// import.meta.url points at the bundled chunk path on Netlify (e.g.
// .netlify/build/chunks/render_XXX.mjs), not at src/lib/ama/render.ts.
// Resolve from the function's working directory instead — the adapter
// sets includedFiles:['**/*'] so the project tree is present at runtime.
const fontDir = join(process.cwd(), "src/lib/ama/fonts");

const fonts = [
  {
    name: "Poppins",
    data: readFileSync(join(fontDir, "Poppins-Medium.ttf")),
    weight: 500 as const,
    style: "normal" as const,
  },
  {
    name: "Poppins",
    data: readFileSync(join(fontDir, "Poppins-SemiBold.ttf")),
    weight: 600 as const,
    style: "normal" as const,
  },
  {
    name: "Poppins",
    data: readFileSync(join(fontDir, "Poppins-Bold.ttf")),
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    name: "JetBrains Mono",
    data: readFileSync(join(fontDir, "JetBrainsMono-SemiBold.ttf")),
    weight: 600 as const,
    style: "normal" as const,
  },
  // Source Serif 4 Bold, used only for the opening quote glyph.
  // Poppins' " is flat; a serif gives the typographic curl Satori
  // would otherwise have to fake (badly).
  {
    name: "Source Serif",
    data: readFileSync(join(fontDir, "SourceSerif4-Bold.ttf")),
    weight: 700 as const,
    style: "normal" as const,
  },
];

export type RenderOverrides = { variant?: Variant; persona?: Persona };

export async function renderAmaCard(
  question: string,
  overrides: RenderOverrides = {},
): Promise<Buffer> {
  const svg = await satori(AmaCard({ question, ...overrides }) as any, {
    width: 1200,
    height: 630,
    fonts,
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng();
  return Buffer.from(png);
}

export async function renderAmaOg(): Promise<Buffer> {
  const svg = await satori(OgFeedStack() as any, {
    width: 1200,
    height: 630,
    fonts,
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng();
  return Buffer.from(png);
}
