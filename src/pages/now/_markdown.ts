// Markdown version of /now, served on demand at /now.md and /now/index.md (the
// path the markdown-negotiation edge function fetches for Accept:
// text/markdown). The hand-written intro is prerendered by the
// markdown-endpoints integration as /now/intro.md; the live half is rendered
// here from the same data as the NowLive server island.
import type { APIRoute } from "astro";
import { getActivity } from "../../lib/sifaActivity";
import { getReading } from "../../lib/bookhive";
import { getPhotoGalleries } from "../../lib/grainPhotos";
import { bookhiveHref } from "@data/bookshelf";
import {
  LIVE_MD_HEADERS,
  activityMarkdown,
  photosMarkdown,
  readingMarkdown,
} from "../../lib/liveMarkdown";

async function intro(origin: string): Promise<string> {
  try {
    const res = await fetch(new URL("/now/intro.md", origin));
    if (res.ok) return (await res.text()).trim();
  } catch {
    // Fall through to the bare heading
  }
  return "# Now";
}

export const GET: APIRoute = async ({ url }) => {
  const [head, activity, reading, photos] = await Promise.all([
    intro(url.origin),
    getActivity(),
    getReading(),
    getPhotoGalleries(15),
  ]);

  const body = [
    head,
    `_Live data as of ${new Date().toISOString()}._`,
    `## Recent activity\n\n${activityMarkdown(activity)}`,
    `## Latest photos\n\nOn [Grain](https://grain.social/profile/gui.do).\n\n${photosMarkdown(photos)}`,
    `## Reading\n\nFrom [Bookhive](${bookhiveHref}). The full shelf is at [/bookshelf](https://gui.do/bookshelf/).\n\n${readingMarkdown(reading)}`,
  ]
    .map((section) => section.trim())
    .join("\n\n");

  return new Response(`${body}\n`, { headers: LIVE_MD_HEADERS });
};
