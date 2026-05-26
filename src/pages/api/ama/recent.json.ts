/**
 * Proxy endpoint for the AMA archive feed.
 *
 * Bluesky's `app.bsky.feed.searchPosts` is gated at the CDN edge for
 * unauthenticated clients (returns 403 reliably). `getAuthorFeed` is open
 * and gives us all of Guido's posts; we filter for the AMA signal
 * server-side and return a slim shape to the /ama page client.
 *
 * Returns up to 9 most recent answer posts that have at least one image
 * and include `#ama` or `gui.do/ama` in the text.
 */
import type { APIRoute } from "astro";

export const prerender = false;

const BSKY_HANDLE = "gui.do";

type BskyImgView = { thumb: string; fullsize: string; alt?: string };
type BskyPostView = {
  uri: string;
  cid: string;
  record: { text: string; createdAt: string };
  embed?: {
    $type?: string;
    images?: BskyImgView[];
  };
};
type FeedItem = { post: BskyPostView; reply?: unknown; reason?: unknown };

type SlimPost = {
  uri: string;
  bskyUrl: string;
  text: string;
  createdAt: string;
  image: { thumb: string; alt: string };
};

function bskyUrl(uri: string): string {
  const parts = uri.replace("at://", "").split("/");
  return `https://bsky.app/profile/${parts[0]}/post/${parts[2]}`;
}

export const GET: APIRoute = async () => {
  const url =
    "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed" +
    `?actor=${BSKY_HANDLE}&filter=posts_with_media&limit=50`;

  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "gui.do-ama (+https://gui.do/ama)",
      },
    });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: `bluesky ${res.status}` }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }
    const data = (await res.json()) as { feed?: FeedItem[] };
    const items = data.feed ?? [];

    const slim: SlimPost[] = items
      .map((it) => it.post)
      .filter((p) => p.embed?.images && p.embed.images.length > 0)
      .filter((p) => /#ama\b|gui\.do\/ama/i.test(p.record.text))
      .slice(0, 9)
      .map((p) => {
        const img = p.embed!.images![0];
        return {
          uri: p.uri,
          bskyUrl: bskyUrl(p.uri),
          text: p.record.text,
          createdAt: p.record.createdAt,
          image: { thumb: img.thumb, alt: img.alt ?? "" },
        };
      });

    return new Response(JSON.stringify({ posts: slim }), {
      headers: {
        "content-type": "application/json",
        // Cache at the edge for 1 minute, allow stale while revalidating.
        "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
};
