/**
 * Live AT Protocol activity for the homepage "Right now" feed.
 *
 * Fetches gui.do's aggregated activity from the Sifa AppView via
 * @singi-labs/sifa-sdk (server-side; the `query/fetchers` entry is
 * framework-agnostic and pulls no React). Maps the raw lexicon records to the
 * display shape used by ActivityFeed, and falls back to the seeded static set
 * (`activitySeed`) on any error / empty response so the feed never blank-renders.
 *
 * Runs at render time: on a static build it's fresh per deploy; set
 * `prerender = false` on the homepage to make it live per request.
 */
import { fetchActivityFeed } from "@singi-labs/sifa-sdk/query/fetchers";
import { formatRelativeTime, resolveCardUrl } from "@singi-labs/sifa-sdk";
import { activitySeed, type ActivityItem } from "@data/homeContent";

const SIFA_BASE = "https://sifa.id";
const HANDLE = "gui.do";

/** Source URL for an item via the SDK's resolver. Feed shows a single
 *  profile, so the author is always gui.do (the feed item itself doesn't
 *  carry author identity — see sdk DX notes). Null-safe. */
function cardUrl(raw: any): string | undefined {
  try {
    return (
      resolveCardUrl({
        collection: raw.collection,
        record: raw.record ?? {},
        uri: raw.uri,
        rkey: raw.rkey,
        authorDid: raw.authorDid ?? "",
        authorHandle: HANDLE,
      }) ?? undefined
    );
  } catch {
    return undefined;
  }
}

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;

const WORK_TYPE_LABEL: Record<string, string> = {
  movie: "Film",
  film: "Film",
  tv: "TV",
  tvshow: "TV",
  show: "TV",
  book: "Book",
  game: "Game",
  album: "Album",
};

/** Map one raw SDK activity item to the display shape, or null to drop it. */
function mapItem(raw: any): ActivityItem | null {
  const record = (raw?.record ?? {}) as Record<string, unknown>;
  const app = str(raw?.appId) ?? "fallback";
  const time = formatRelativeTime(str(raw?.indexedAt) ?? "");
  const url = cardUrl(raw);
  const category = str(raw?.category) ?? "";
  const base = { app, time, url };

  switch (category) {
    case "Posts": {
      const text = str(record.text);
      if (!text) return null;
      const isReply = !!record.reply;
      return { ...base, type: "post", kind: isReply ? "Reply" : "Post", text };
    }
    case "Reviews": {
      const title = str(record.title);
      if (!title) return null;
      const workType = str(record.creativeWorkType)?.toLowerCase() ?? "";
      const credit = str(record.mainCredit);
      const subParts = [
        WORK_TYPE_LABEL[workType] ?? str(record.creativeWorkType),
        credit,
      ].filter(Boolean);
      const rating =
        typeof record.rating === "number"
          ? (record.rating as number)
          : undefined;
      return {
        ...base,
        type: "review",
        kind: "Reviewed",
        title,
        sub: subParts.join(" · ") || undefined,
        rating,
      };
    }
    case "Code": {
      const title =
        str(record.name) ??
        str(record.title) ??
        str(raw?.appName) ??
        "Repository";
      return {
        ...base,
        type: "code",
        kind: "Pushed code",
        title,
        sub: str(record.description),
      };
    }
    case "Events": {
      const title = str(record.name) ?? str(record.title);
      if (!title) return null;
      return {
        ...base,
        type: "event",
        kind: "Event",
        title,
        sub: str(record.location) ?? str(record.subtitle),
      };
    }
    case "Articles": {
      const title = str(record.title) ?? str(record.text);
      if (!title) return null;
      return { ...base, type: "post", kind: "Published", title };
    }
    default:
      return null; // skip "Other" and unknown categories
  }
}

/**
 * Live activity for gui.do, newest first. Returns the seeded fallback on any
 * failure or empty result. Never throws.
 */
export async function getActivity(limit = 10): Promise<ActivityItem[]> {
  try {
    const res = await fetchActivityFeed({ baseUrl: SIFA_BASE }, "gui.do", {
      limit: limit * 3,
    });
    if (!res?.items?.length) return activitySeed;
    const mapped = res.items
      .map(mapItem)
      .filter((x): x is ActivityItem => x !== null)
      .slice(0, limit);
    return mapped.length ? mapped : activitySeed;
  } catch {
    return activitySeed;
  }
}
