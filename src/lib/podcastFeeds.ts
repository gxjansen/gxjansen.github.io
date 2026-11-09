/**
 * Build-time podcast episode fetcher.
 *
 * Runs server-side in Astro frontmatter so the /podcasts episode list is baked
 * into the static HTML (visible to crawlers and no-JS browsers, no client fetch
 * required).
 *
 * Reads the feeds below and returns the latest episodes with their audio file
 * URL (played with a native <audio> element) and, when the feed has them, the
 * episode page link and artwork (episode image, else the show image). Wrapped so a slow or failed feed NEVER breaks the build —
 * on any error it falls back to an empty list and the page renders the static
 * "visit the podcasts directly" block. Never throws.
 */
import { XMLParser } from "fast-xml-parser";

export const PODCAST_FEEDS = [
  "https://media.spryker.com/podcasts/187220417647/rss.xml", // Sheeptank
  "https://podcasts.gui.do/cro-cafe/feed.xml",
  "https://podcasts.gui.do/cro-cafe-nl/feed.xml",
];

const FETCH_TIMEOUT = 5000; // 5s per-feed timeout
const MAX_EPISODES = 20;

export interface PodcastEpisode {
  title: string;
  /** Episode web page, if the feed provides one. */
  link?: string;
  audioUrl: string;
  /** Episode artwork (`itunes:image`), falling back to the show artwork. */
  imageUrl?: string;
  pubDate: string;
  podcastName: string;
}

interface FeedItem {
  title?: unknown;
  link?: unknown;
  pubDate?: unknown;
  enclosure?: { "@_url"?: unknown; "@_type"?: unknown };
  "itunes:image"?: { "@_href"?: unknown };
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

// Only accept absolute https URLs from the feed; anything else is dropped.
const httpsUrl = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Turn the items of one parsed RSS document into episodes. Items without an
 * https audio enclosure are skipped.
 */
export const parseEpisodes = (xml: string): PodcastEpisode[] => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    // Keep titles like "2024" or "#8 - VanMoof" as strings.
    parseTagValue: false,
  });

  const channel = parser.parse(xml)?.rss?.channel;
  if (!channel) return [];

  const rawItems = channel.item;
  const items: FeedItem[] = Array.isArray(rawItems)
    ? rawItems
    : rawItems
      ? [rawItems]
      : [];
  const podcastName = typeof channel.title === "string" ? channel.title : "";
  const showImage =
    httpsUrl(channel["itunes:image"]?.["@_href"]) ??
    httpsUrl(channel.image?.url);

  return items
    .map((item): PodcastEpisode | null => {
      const audioUrl = httpsUrl(item.enclosure?.["@_url"]);
      if (!audioUrl) return null;
      return {
        title:
          typeof item.title === "string" && item.title.trim()
            ? item.title.trim()
            : "Episode",
        link: httpsUrl(item.link),
        audioUrl,
        imageUrl: httpsUrl(item["itunes:image"]?.["@_href"]) ?? showImage,
        pubDate: typeof item.pubDate === "string" ? item.pubDate : "",
        podcastName,
      };
    })
    .filter((item): item is PodcastEpisode => item !== null);
};

// Fetch and parse a single feed. Any failure resolves to [] so one bad feed
// can't break the others (or the build).
const fetchFeed = async (feedUrl: string): Promise<PodcastEpisode[]> => {
  try {
    const response = await fetchWithTimeout(feedUrl, FETCH_TIMEOUT);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return parseEpisodes(await response.text());
  } catch (error) {
    // Swallow and degrade — never let a feed failure escape to the build.
    console.error(
      `[podcastFeeds] Error fetching feed ${feedUrl}:`,
      error instanceof Error ? error.message : error,
    );
    return [];
  }
};

const timestamp = (pubDate: string): number => {
  const time = new Date(pubDate).getTime();
  return Number.isNaN(time) ? 0 : time;
};

/**
 * Fetch + merge all configured feeds, newest first, capped at
 * {@link MAX_EPISODES}. Returns `[]` on total failure — never throws, so the
 * page's static fallback renders instead of breaking the build.
 */
export async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const allEpisodes = (
      await Promise.all(PODCAST_FEEDS.map((url) => fetchFeed(url)))
    ).flat();

    return allEpisodes
      .sort((a, b) => timestamp(b.pubDate) - timestamp(a.pubDate))
      .slice(0, MAX_EPISODES);
  } catch (error) {
    console.error(
      "[podcastFeeds] Unexpected error building episode list:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}
