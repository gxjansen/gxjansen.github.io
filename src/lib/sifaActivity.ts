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

interface PostMeta {
  likes: number;
  reposts: number;
  replies: number;
  image?: string;
  imageAlt?: string;
}

/** Pull the first image thumbnail (if any) from a getPosts embed view. */
function extractImage(embed: any): { image?: string; imageAlt?: string } {
  if (!embed) return {};
  const imgs = embed.images ?? embed.media?.images;
  if (imgs?.[0]?.thumb)
    return { image: imgs[0].thumb, imageAlt: imgs[0].alt || undefined };
  if (embed.external?.thumb)
    return {
      image: embed.external.thumb,
      imageAlt: embed.external.title || undefined,
    };
  return {};
}

/**
 * Engagement counts + image thumbnails for Bluesky posts from the PUBLIC
 * Bluesky AppView (app.bsky.feed.getPosts) — no auth, no key, batched (max 25
 * URIs). The Sifa feed carries neither, so we fetch them here. Never throws.
 */
async function fetchPostMeta(uris: string[]): Promise<Map<string, PostMeta>> {
  const map = new Map<string, PostMeta>();
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
          ...extractImage(p.embed),
        });
      }
    }
  } catch {
    /* fall back to no counts / images */
  }
  return map;
}

/**
 * The single most-recent item for each non-post category (Reviews, Code,
 * Events) — fetched per-category so these rarer types always surface, however
 * old, independent of how frequently Guido posts. Never throws.
 */
async function fetchVariety(): Promise<ActivityItem[]> {
  const cats = ["Reviews", "Code", "Events"];
  const lists = await Promise.all(
    cats.map(async (category) => {
      try {
        const r = await fetchActivityFeed({ baseUrl: SIFA_BASE }, HANDLE, {
          category,
          limit: 3,
        });
        for (const raw of r?.items ?? []) {
          const m = mapItem(raw);
          if (m) return m;
        }
      } catch {
        /* skip this category */
      }
      return null;
    }),
  );
  return lists.filter((x): x is ActivityItem => x !== null);
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
function mapItem(raw: any, meta?: PostMeta): ActivityItem | null {
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
        likes: meta?.likes,
        reposts: meta?.reposts,
        replies: meta?.replies,
        hasImage: !!meta?.image,
        imageUrl: meta?.image,
        imageAlt: meta?.imageAlt,
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
      const title =
        str(record.name) ??
        str(record.title) ??
        str(record.text) ??
        "Community event";
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
    // Main feed (posts + engagement) and the per-category variety in parallel.
    const [res, variety] = await Promise.all([
      fetchActivityFeed({ baseUrl: SIFA_BASE }, HANDLE, { limit: 40 }),
      fetchVariety(),
    ]);
    const items = res?.items ?? [];
    if (!items.length && !variety.length) return activitySeed;

    // Engagement counts + image thumbnails for Bluesky posts (public AppView).
    const bskyUris = items
      .filter((i: any) => i.collection === "app.bsky.feed.post")
      .map((i: any) => i.uri);
    const meta = await fetchPostMeta(bskyUris);

    // The 7-day window applies ONLY to posts (frequent); non-post categories
    // surface their latest item regardless of age (via fetchVariety).
    const cutoff = Date.now() - RECENT_DAYS * 86_400_000;
    const recentEnough = (raw: any) => {
      const t = new Date(raw.indexedAt).getTime();
      return Number.isNaN(t) || t >= cutoff;
    };

    const posts = items
      .filter(
        (r: any) => r.collection === "app.bsky.feed.post" && recentEnough(r),
      )
      .map((r: any) => mapItem(r, meta.get(r.uri)))
      .filter((x): x is ActivityItem => x !== null)
      .sort((a, b) => interestScore(b) - interestScore(a));

    const varietyN = Math.min(variety.length, Math.floor(limit / 3));
    const mapped = [
      ...posts.slice(0, limit - varietyN),
      ...variety.slice(0, varietyN),
    ];

    return mapped.length ? mapped : activitySeed;
  } catch {
    return activitySeed;
  }
}
