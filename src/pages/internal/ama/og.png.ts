import type { APIRoute } from "astro";
import { renderAmaOg } from "../../../lib/ama/render";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const png = await renderAmaOg();
    return new Response(new Uint8Array(png), {
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=3600",
      },
    });
  } catch (e) {
    return new Response(`render failed: ${(e as Error).message}`, {
      status: 500,
    });
  }
};
