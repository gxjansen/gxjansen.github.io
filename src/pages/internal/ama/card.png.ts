import type { APIRoute } from "astro";
import { renderAmaCard } from "../../../lib/ama/render";
import { variants, personas } from "../../../lib/ama/card";

export const prerender = false;

const DEFAULT_Q =
  "I'm a solo founder trying to grow a developer tool. Should I start a Discord, a forum, or just be active on Bluesky in the first 90 days?";

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get("q") ?? DEFAULT_Q;
  const variantId = url.searchParams.get("variant");
  const personaName = url.searchParams.get("persona");
  const adjectiveOverride = url.searchParams.get("adjective");

  if (q.length > 500) {
    return new Response("question too long (max 500 chars)", { status: 400 });
  }

  const overrides: Parameters<typeof renderAmaCard>[1] = {};
  if (variantId) {
    const v = variants.find((x) => x.id === variantId);
    if (v) overrides.variant = v;
  }
  if (personaName) {
    const p = personas.find(
      (x) => x.name.toLowerCase() === personaName.toLowerCase(),
    );
    if (p) overrides.persona = p;
  }
  if (adjectiveOverride && overrides.persona) {
    // Only honor an adjective override that actually belongs to the
    // chosen persona — keeps the alliteration invariant.
    if (overrides.persona.adjectives.includes(adjectiveOverride)) {
      overrides.adjective = adjectiveOverride;
    }
  }

  try {
    const png = await renderAmaCard(q, overrides);
    return new Response(new Uint8Array(png), {
      headers: {
        "content-type": "image/png",
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    return new Response(`render failed: ${(e as Error).message}`, {
      status: 500,
    });
  }
};
