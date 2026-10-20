import { XMLParser } from "fast-xml-parser";

/**
 * Podcast Feeds API
 *
 * Fetches the Transistor RSS feeds and returns the latest episodes as JSON.
 * The /podcasts page doesn't call this: it bakes the list in at build time via
 * src/lib/podcastFeeds.ts. This endpoint stays for runtime consumers.
 *
 * Timeout (30s) and the external fast-xml-parser module are set in
 * netlify.toml under [functions] / [functions.getPodcastFeeds].
 */

const PODCAST_FEEDS = [
  "https://feeds.transistor.fm/sheeptank",
  "https://feeds.transistor.fm/cro-cafe",
  "https://feeds.transistor.fm/cro-cafe-nl",
];

const FETCH_TIMEOUT = 5000; // 5 second timeout per feed fetch
const MAX_EPISODES = 20;

/** Browser: 1 hour. */
const CACHE_CONTROL = "public, max-age=3600";
/**
 * Netlify CDN: 1 hour fresh, then serve stale for up to 24 hours while it
 * refetches in the background. `durable` shares the cached copy across edge
 * nodes so cold edges don't each re-run the function.
 */
const CDN_CACHE_CONTROL =
  "public, durable, s-maxage=3600, stale-while-revalidate=86400";

export interface PodcastFeedEpisode {
  title: string;
  description: string;
  pubDate: string;
  duration: string;
  link: string;
  podcastName: string;
}

interface FeedItem {
  title?: string;
  description?: string;
  pubDate?: string;
  "itunes:duration"?: string | number;
  enclosure?: { "@_url"?: string };
}

const fetchWithTimeout = async (
  url: string,
  timeout: number,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

// Extract the Transistor episode id from an item's media enclosure URL.
const getEpisodeId = (item: FeedItem): string | null => {
  const url = item.enclosure?.["@_url"];
  if (typeof url !== "string") return null;
  const match = url.match(/https:\/\/media\.transistor\.fm\/([^/]+)/);
  return match ? match[1] : null;
};

// Parse a single feed. Any failure resolves to [] so one bad feed can't take
// down the others.
const parseFeed = async (feedUrl: string): Promise<PodcastFeedEpisode[]> => {
  try {
    const response = await fetchWithTimeout(feedUrl, FETCH_TIMEOUT);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const result = parser.parse(await response.text());
    const channel = result?.rss?.channel;
    if (!channel) throw new Error("Feed has no rss.channel");

    const rawItems = channel.item;
    const items: FeedItem[] = Array.isArray(rawItems)
      ? rawItems
      : rawItems
        ? [rawItems]
        : [];

    return items
      .map((item): PodcastFeedEpisode | null => {
        const episodeId = getEpisodeId(item);
        // Only include episodes that have a valid embed link
        if (!episodeId) return null;
        return {
          title: item.title ?? "",
          description: item.description ?? "",
          pubDate: item.pubDate ?? "",
          duration: String(item["itunes:duration"] ?? ""),
          link: `https://share.transistor.fm/e/${episodeId}`,
          podcastName: channel.title ?? "",
        };
      })
      .filter((item): item is PodcastFeedEpisode => item !== null);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    console.error(
      `Error fetching feed ${feedUrl}:`,
      timedOut ? "timeout" : error instanceof Error ? error.message : error,
    );
    return [];
  }
};

export default async (req: Request): Promise<Response> => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", Allow: "GET, HEAD" },
    });
  }

  try {
    const allEpisodes = (
      await Promise.all(PODCAST_FEEDS.map((url) => parseFeed(url)))
    ).flat();

    const latestEpisodes = allEpisodes
      .sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
      )
      .slice(0, MAX_EPISODES);

    // An empty list means every feed failed: don't pin that outage in a cache.
    const cacheHeaders: Record<string, string> = latestEpisodes.length
      ? {
          "Cache-Control": CACHE_CONTROL,
          "Netlify-CDN-Cache-Control": CDN_CACHE_CONTROL,
        }
      : { "Cache-Control": "no-store" };

    return new Response(JSON.stringify(latestEpisodes), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cacheHeaders },
    });
  } catch (error) {
    // Detail goes to the function log only; clients get a generic message.
    console.error(
      "Error in podcast feed handler:",
      error instanceof Error ? (error.stack ?? error.message) : error,
    );
    return new Response(
      JSON.stringify({ error: "Failed to fetch podcast feeds" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }
};
