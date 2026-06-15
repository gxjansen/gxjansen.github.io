/**
 * Build-time podcast episode fetcher.
 *
 * Mirrors `netlify/functions/getPodcastFeeds.js` but runs server-side in Astro
 * frontmatter so the /podcasts episode list is baked into the static HTML
 * (visible to crawlers and no-JS browsers, no client fetch required).
 *
 * Same Transistor feed sources, same parsing, same shape: it returns the latest
 * episodes as `{ link, title }`-bearing objects where `link` is always a
 * `https://share.transistor.fm/` embed URL. Wrapped so a slow or failed feed
 * NEVER breaks the build — on any error it falls back to an empty list and the
 * page renders the static "visit the podcasts directly" block. Never throws.
 */
import { XMLParser } from "fast-xml-parser";

const PODCAST_FEEDS = [
  "https://feeds.transistor.fm/sheeptank",
  "https://feeds.transistor.fm/cro-cafe",
  "https://feeds.transistor.fm/cro-cafe-nl",
];

const FETCH_TIMEOUT = 5000; // 5s per-feed timeout, matches the Netlify function
const MAX_EPISODES = 20;
const TRANSISTOR_EMBED_PREFIX = "https://share.transistor.fm/";

export interface PodcastEpisode {
  title: string;
  link: string;
  pubDate: string;
  podcastName: string;
}

interface FeedItem {
  title?: string;
  pubDate?: string;
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
  if (!url) return null;
  const match = url.match(/https:\/\/media\.transistor\.fm\/([^/]+)/);
  return match ? match[1] : null;
};

// Parse a single feed. Any failure resolves to [] so one bad feed can't break
// the others (or the build).
const parseFeed = async (feedUrl: string): Promise<PodcastEpisode[]> => {
  try {
    const response = await fetchWithTimeout(feedUrl, FETCH_TIMEOUT);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    const result = parser.parse(xml);
    const channel = result?.rss?.channel;
    if (!channel) return [];

    const rawItems = channel.item;
    const items: FeedItem[] = Array.isArray(rawItems)
      ? rawItems
      : rawItems
        ? [rawItems]
        : [];
    const podcastName: string = channel.title ?? "";

    return items
      .map((item): PodcastEpisode | null => {
        const episodeId = getEpisodeId(item);
        if (!episodeId) return null; // only episodes with a valid embed link
        return {
          title: typeof item.title === "string" ? item.title : "Episode",
          link: `${TRANSISTOR_EMBED_PREFIX}e/${episodeId}`,
          pubDate: item.pubDate ?? "",
          podcastName,
        };
      })
      .filter((item): item is PodcastEpisode => item !== null);
  } catch (error) {
    // Swallow and degrade — never let a feed failure escape to the build.
    console.error(
      `[podcastFeeds] Error fetching feed ${feedUrl}:`,
      error instanceof Error ? error.message : error,
    );
    return [];
  }
};

/**
 * Fetch + merge all configured Transistor feeds, newest first, capped at
 * {@link MAX_EPISODES}. Returns `[]` on total failure — never throws, so the
 * page's static fallback renders instead of breaking the build.
 */
export async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const allEpisodes = (
      await Promise.all(PODCAST_FEEDS.map((url) => parseFeed(url)))
    ).flat();

    return allEpisodes
      .filter((episode) => episode.link.startsWith(TRANSISTOR_EMBED_PREFIX))
      .sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
      )
      .slice(0, MAX_EPISODES);
  } catch (error) {
    console.error(
      "[podcastFeeds] Unexpected error building episode list:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}
