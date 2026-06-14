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

interface Engagement {
  likes: number;
  reposts: number;
  replies: number;
}

/**
 * Real engagement counts for Bluesky posts from the PUBLIC Bluesky AppView
 * (app.bsky.feed.getPosts) — no auth, no API key, batched (max 25 URIs). The
 * Sifa activity feed doesn't carry counts, so we fetch them here. Build-time
 * fresh; never throws.
 */
async function fetchEngagement(
  uris: string[],
): Promise<Map<string, Engagement>> {
  const map = new Map<string, Engagement>();
  if (!uris.length) return map;
  try {
    for (let i = 0; i < uris.length; i += 25) {
      const chunk = uris.slice(i, i + 25);
      const qs = chunk.map((u) => `uris=${encodeURIComponent(u)}`).join("&");
      const res = await fetch(
        `https://public.api.bsky.app/xrpc/app.bsky.feed.getPosts?${qs}`,
      );
      if (!res.ok) continue;
      const data: any = await res.json();
      for (const p of data.posts ?? []) {
        map.set(p.uri, {
          likes: p.likeCount ?? 0,
          reposts: p.repostCount ?? 0,
          replies: p.replyCount ?? 0,
        });
      }
    }
  } catch {
    /* fall back to no counts */
  }
  return map;
}

/** Sort weight — high-engagement posts float up; non-post items keep a modest
 *  baseline so the multi-app variety (reviews, code, events) still shows. */
function interestScore(it: ActivityItem): number {
  if (it.likes != null || it.reposts != null || it.replies != null) {
    return (it.likes ?? 0) + 2 * (it.reposts ?? 0) + (it.replies ?? 0);
  }
  if (it.type === "code" || it.type === "event") return 12;
  if (it.type === "review") return 6;
  return 3;
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

/** Map one raw SDK activity item to the display shape, or null to drop it.
 *  `eng` carries real Bluesky engagement counts when available. */
function mapItem(raw: any, eng?: Engagement): ActivityItem | null {
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
      return {
        ...base,
        type: "post",
        kind: isReply ? "Reply" : "Post",
        text,
        ...eng,
      };
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
const RECENT_DAYS = 7;

export async function getActivity(limit = 10): Promise<ActivityItem[]> {
  try {
    const res = await fetchActivityFeed({ baseUrl: SIFA_BASE }, "gui.do", {
      limit: 40,
    });
    if (!res?.items?.length) return activitySeed;

    // Real engagement counts for Bluesky posts (public AppView, no auth).
    const bskyUris = res.items
      .filter((i: any) => i.collection === "app.bsky.feed.post")
      .map((i: any) => i.uri);
    const eng = await fetchEngagement(bskyUris);

    const cutoff = Date.now() - RECENT_DAYS * 86_400_000;
    const recentEnough = (raw: any) => {
      const t = new Date(raw.indexedAt).getTime();
      return Number.isNaN(t) || t >= cutoff;
    };

    // Posts from the last week, ranked by interactions (best on top).
    const posts = res.items
      .filter(
        (r: any) => r.collection === "app.bsky.feed.post" && recentEnough(r),
      )
      .map((r: any) => mapItem(r, eng.get(r.uri)))
      .filter((x): x is ActivityItem => x !== null)
      .sort((a, b) => interestScore(b) - interestScore(a));

    // The freshest non-post items (reviews, code, events) — kept as variety so
    // those filters always have content, regardless of post engagement.
    const others = res.items
      .filter((r: any) => r.collection !== "app.bsky.feed.post")
      .map((r: any) => mapItem(r))
      .filter((x): x is ActivityItem => x !== null);

    // One most-recent item per non-post category (review / code / event) so each
    // present filter always has content, without burying the top posts.
    const byCategory = new Map<string, ActivityItem>();
    for (const o of others)
      if (!byCategory.has(o.type)) byCategory.set(o.type, o);
    const variety = [...byCategory.values()].slice(0, Math.floor(limit / 3));

    const mapped = [...posts.slice(0, limit - variety.length), ...variety];

    return mapped.length ? mapped : activitySeed;
  } catch {
    return activitySeed;
  }
}
