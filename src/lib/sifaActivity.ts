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
  isGif?: boolean;
  videoWebm?: string;
  videoMp4?: string;
  poster?: string;
  mediaWidth?: number;
  mediaHeight?: number;
}

/**
 * Klipy serves a tiny WebM/MP4 alongside every animated GIF. Bluesky's GIF
 * composer embeds the URL with the video IDs + dimensions in the query string:
 *   .../ii/{hash}/{a}/{b}/{stem}.gif?ww=498&hh=485&webm={id}&mp4={id}
 * The video lives at the same path with the stem swapped for the id:
 *   .../ii/{hash}/{a}/{b}/{webmId}.webm   (≈68 KB vs ≈2 MB for the .gif)
 * Generic by construction — reads the params off whatever klipy GIF the live
 * feed surfaces. Returns undefined for non-klipy GIFs (e.g. Tenor) so callers
 * fall back to rendering the .gif. */
function klipyVideo(
  gifUrl: string,
):
  | { webm?: string; mp4?: string; width?: number; height?: number }
  | undefined {
  try {
    const u = new URL(gifUrl);
    if (!u.hostname.endsWith("klipy.com")) return undefined;
    const webmId = u.searchParams.get("webm");
    const mp4Id = u.searchParams.get("mp4");
    if (!webmId && !mp4Id) return undefined;
    // Path directory up to (and including) the last slash, dropping `stem.gif`.
    const dir = u.pathname.replace(/[^/]+\.gif$/i, "");
    if (!dir.endsWith("/")) return undefined; // not the expected shape
    const base = `${u.origin}${dir}`;
    const dim = (k: string) => {
      const n = Number(u.searchParams.get(k));
      return Number.isFinite(n) && n > 0 ? n : undefined;
    };
    return {
      webm: webmId ? `${base}${webmId}.webm` : undefined,
      mp4: mp4Id ? `${base}${mp4Id}.mp4` : undefined,
      width: dim("ww"),
      height: dim("hh"),
    };
  } catch {
    return undefined;
  }
}

/** Pull the first image/GIF from a getPosts embed view. Animated GIFs (Klipy)
 *  get their small WebM/MP4 versions so the feed plays a lightweight <video>;
 *  the animated `.gif` URL stays as the fallback. Other externals use the
 *  static thumbnail. */
function extractImage(embed: any): {
  image?: string;
  imageAlt?: string;
  isGif?: boolean;
  videoWebm?: string;
  videoMp4?: string;
  poster?: string;
  mediaWidth?: number;
  mediaHeight?: number;
} {
  if (!embed) return {};
  const imgs = embed.images ?? embed.media?.images;
  if (imgs?.[0]?.thumb)
    return { image: imgs[0].thumb, imageAlt: imgs[0].alt || undefined };
  const ext = embed.external ?? embed.media?.external;
  if (ext?.uri && /\.gif(\?|$)/i.test(ext.uri)) {
    const vid = klipyVideo(ext.uri);
    return {
      image: ext.uri,
      imageAlt: ext.title || "GIF",
      isGif: true,
      videoWebm: vid?.webm,
      videoMp4: vid?.mp4,
      // Static CDN thumbnail (small) → <video> poster, not the multi-MB .gif.
      poster: typeof ext.thumb === "string" ? ext.thumb : undefined,
      mediaWidth: vid?.width,
      mediaHeight: vid?.height,
    };
  }
  if (ext?.thumb) return { image: ext.thumb, imageAlt: ext.title || undefined };
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

/** Just the engagement counts for a Bluesky post (no embed/image). */
export interface Engagement {
  likes: number;
  reposts: number;
  replies: number;
}

/**
 * Engagement counts for a batch of canonical `at://` Bluesky post URIs, keyed
 * by the canonical URI getPosts echoes back. Thin wrapper over `fetchPostMeta`
 * (one batched public-AppView call, ≤25 per request). Missing/deleted posts are
 * simply absent from the map. Never throws — returns an empty map on failure.
 */
export async function fetchEngagement(
  uris: string[],
): Promise<Map<string, Engagement>> {
  const meta = await fetchPostMeta(uris);
  const out = new Map<string, Engagement>();
  for (const [uri, m] of meta) {
    out.set(uri, { likes: m.likes, reposts: m.reposts, replies: m.replies });
  }
  return out;
}

/**
 * Recent non-post activity, several items per category (Reviews, Code, Events),
 * fetched per-category so each surfaces regardless of post frequency or age,
 * then merged newest-first. Never throws.
 */
async function fetchRecentNonPosts(): Promise<ActivityItem[]> {
  const cats: [string, number][] = [
    ["Reviews", 4],
    ["Code", 2],
    ["Events", 2],
  ];
  const lists = await Promise.all(
    cats.map(async ([category, n]) => {
      try {
        const r = await fetchActivityFeed({ baseUrl: SIFA_BASE }, HANDLE, {
          category,
          limit: n + 2,
        });
        const seen = new Set<string>();
        return (r?.items ?? [])
          .map((raw: any) => ({
            at: new Date(raw.indexedAt).getTime() || 0,
            item: mapItem(raw),
          }))
          .filter((x): x is { at: number; item: ActivityItem } => {
            if (!x.item) return false;
            const key = (x.item.title ?? x.item.text ?? "").toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .slice(0, n);
      } catch {
        return [];
      }
    }),
  );
  return lists
    .flat()
    .sort((a, b) => b.at - a.at)
    .map((x) => x.item as ActivityItem);
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

/** The DID that owns a record, parsed from its at:// URI. */
const didFromUri = (uri?: string): string | undefined =>
  uri?.match(/^at:\/\/(did:[^/]+)/)?.[1];

/** Build a CDN image URL from an atproto image blob, for records that store a
 *  cover blob instead of a ready-made posterUrl (e.g. Bookhive). */
const blobImage = (did?: string, cid?: string): string | undefined =>
  did && cid
    ? `https://cdn.bsky.app/img/feed_thumbnail/plain/${did}/${cid}@jpeg`
    : undefined;

/** Deep link a review to the actual book/film on its source app, instead of
 *  the generic profile card the SDK resolver returns. */
function reviewItemUrl(
  raw: any,
  record: Record<string, unknown>,
): string | undefined {
  const coll = str(raw?.collection) ?? "";
  const ids = (record.identifiers ?? {}) as Record<string, unknown>;
  if (coll.includes("bookhive")) {
    const hiveId = str(record.hiveId) ?? str(ids.hiveId);
    return hiveId ? `https://bookhive.buzz/books/${hiveId}` : undefined;
  }
  if (coll.includes("popfeed")) {
    const tmdbId = str(ids.tmdbId);
    if (!tmdbId) return undefined;
    const type = str(record.creativeWorkType)?.toLowerCase();
    return `https://popfeed.social/${type === "tv" ? "tv" : "movie"}/${tmdbId}`;
  }
  return undefined;
}

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
        videoWebm: meta?.videoWebm,
        videoMp4: meta?.videoMp4,
        mediaPoster: meta?.poster,
        mediaWidth: meta?.mediaWidth,
        mediaHeight: meta?.mediaHeight,
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
      const did = didFromUri(str(raw?.uri));
      const coverCid = (record.cover as any)?.ref?.["$link"];
      return {
        ...base,
        // Link straight to the book / film, not the profile card.
        url: reviewItemUrl(raw, record) ?? base.url,
        type: "review",
        kind: "Reviewed",
        title,
        sub: subParts.join(" · ") || undefined,
        rating,
        // posterUrl (Popfeed) is ready to use; Bookhive only stores a cover
        // blob, so build its CDN URL from the DID + blob CID.
        imageUrl:
          str(record.posterUrl) ??
          str(record.backdropUrl) ??
          blobImage(did, str(coverCid)),
      };
    }
    case "Code": {
      // record.name is often absent for repo pushes; the rkey is the repo
      // slug (e.g. "bsky-avatar"), so use it before the generic fallback.
      const title =
        str(record.name) ??
        str(record.title) ??
        str(raw?.rkey) ??
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
      // Smoke Signal RSVPs: the event name lives on record.eventMeta.name and
      // the attendance status on record.status (#going / #interested / #notgoing).
      const meta = (record.eventMeta ?? {}) as Record<string, unknown>;
      const title =
        str(meta.name) ?? str(record.name) ?? str(record.title) ?? "Event";
      const status = (str(record.status) ?? "").toLowerCase();
      const kind = status.includes("notgoing")
        ? "Not going"
        : status.includes("going")
          ? "Going"
          : status.includes("interested")
            ? "Interested"
            : "RSVP";
      const starts = str(meta.startsAt);
      const sub = starts
        ? new Date(starts).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : (str(meta.location) ?? undefined);
      return { ...base, type: "event", kind, title, sub };
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
const POST_HIGHLIGHTS = 6; // top posts by engagement, then the non-post tail

export async function getActivity(): Promise<ActivityItem[]> {
  try {
    // Highlight posts (main feed + engagement) and the recent non-post activity
    // (per-category) in parallel.
    const [res, nonPosts] = await Promise.all([
      fetchActivityFeed({ baseUrl: SIFA_BASE }, HANDLE, { limit: 40 }),
      fetchRecentNonPosts(),
    ]);
    const items = res?.items ?? [];
    if (!items.length && !nonPosts.length) return activitySeed;

    // Engagement counts + image thumbnails for Bluesky posts (public AppView).
    const bskyUris = items
      .filter((i: any) => i.collection === "app.bsky.feed.post")
      .map((i: any) => i.uri);
    const meta = await fetchPostMeta(bskyUris);

    // The 7-day window applies ONLY to posts (frequent). Rank them by interactions.
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
      .sort((a, b) => interestScore(b) - interestScore(a))
      .slice(0, POST_HIGHLIGHTS);

    // Top posts first, then the recent multi-app activity (reviews/code/events).
    const mapped = [...posts, ...nonPosts];
    return mapped.length ? mapped : activitySeed;
  } catch {
    return activitySeed;
  }
}
