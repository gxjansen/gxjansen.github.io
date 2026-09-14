/**
 * Grain photo galleries for the homepage "Right now" feed (a Photos pill) and
 * the /now photos card.
 *
 * Reads Guido's `social.grain.gallery` records from his PDS (read-only, no auth),
 * newest first by the record's own `createdAt` (galleries are backdated to their
 * original Instagram post date), then resolves each gallery's photos via the
 * Grain AppView's getGallery. Photo images are re-pointed at Bluesky's image CDN
 * using the blob CID + Guido's DID, so they load straight from his own PDS blobs
 * rather than depending on Grain's CDN (with a graceful fallback to Grain's URL).
 *
 * Unlike Bookhive (an ingested signal), photos are content Guido authored — this
 * renders them on his own domain. Wrapped so any network failure yields an empty
 * fallback rather than breaking the render.
 */

import type { ActivityItem } from "@data/homeContent";

const GUIDO_DID = "did:plc:45uheisi25szrjvjurfpritx";
const PDS = "https://chaga.us-west.host.bsky.network";
const APPVIEW = "https://grain.social";
const PROFILE = "https://grain.social/profile/gui.do";
const GALLERY_COLLECTION = "social.grain.gallery";

export interface GrainPhoto {
  thumb: string;
  fullsize: string;
  alt: string;
  width: number;
  height: number;
}

export interface PhotoGallery {
  uri: string;
  rkey: string;
  /** Public Grain page for the gallery. */
  href: string;
  title: string;
  description: string;
  createdAt: string;
  count: number;
  photos: GrainPhoto[];
  cover: GrainPhoto | null;
}

interface RawGalleryRecord {
  uri: string;
  value?: { title?: string; description?: string; createdAt?: string };
}

// Serve a blob straight from Guido's PDS via Bluesky's image CDN (his PDS is on
// bsky.network, so this works and keeps images "owned"). The blob CID is the
// last path segment of Grain's CDN URL; fall back to Grain's URL if it isn't
// parseable.
const bskyCdn = (cid: string, size: "feed_thumbnail" | "feed_fullsize") =>
  `https://cdn.bsky.app/img/${size}/plain/${GUIDO_DID}/${cid}@jpeg`;

function ownedImage(
  grainUrl: string | undefined,
  size: "feed_thumbnail" | "feed_fullsize",
): string {
  if (!grainUrl) return "";
  const cid = grainUrl.match(/\/(baf[a-z0-9]+)(?:@[a-z]+)?\/?$/i)?.[1];
  return cid ? bskyCdn(cid, size) : grainUrl;
}

// Every gallery ref (uri + createdAt) from the PDS, following the cursor.
// listRecords pages at 100; capped so a huge archive can't run away (~2100
// galleries ≈ 21 pages).
async function listGalleryRefs(): Promise<
  { uri: string; createdAt: string }[]
> {
  const all: { uri: string; createdAt: string }[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 25; page++) {
    const url =
      `${PDS}/xrpc/com.atproto.repo.listRecords` +
      `?repo=${GUIDO_DID}&collection=${GALLERY_COLLECTION}&limit=100` +
      (cursor ? `&cursor=${encodeURIComponent(cursor)}` : "");
    const res = await fetch(url);
    if (!res.ok) throw new Error(`listRecords ${res.status}`);
    const data = (await res.json()) as {
      records?: RawGalleryRecord[];
      cursor?: string;
    };
    for (const r of data.records ?? []) {
      all.push({ uri: r.uri, createdAt: r.value?.createdAt ?? "" });
    }
    cursor = data.cursor;
    if (!cursor || !data.records?.length) break;
  }
  return all;
}

// Resolve one gallery's photos + metadata via the Grain AppView. Null on any
// failure or an empty gallery, so callers just filter it out.
async function fetchGallery(uri: string): Promise<PhotoGallery | null> {
  try {
    const res = await fetch(
      `${APPVIEW}/xrpc/social.grain.unspecced.getGallery?gallery=${encodeURIComponent(uri)}`,
    );
    if (!res.ok) return null;
    const g = ((await res.json()) as { gallery?: any }).gallery;
    if (!g) return null;

    const photos: GrainPhoto[] = ((g.items ?? []) as any[])
      .map((it) => ({
        thumb: ownedImage(it.thumb, "feed_thumbnail"),
        fullsize: ownedImage(it.fullsize, "feed_fullsize"),
        alt: typeof it.alt === "string" ? it.alt : "",
        width: it.aspectRatio?.width ?? 0,
        height: it.aspectRatio?.height ?? 0,
        position: it.gallery?.itemPosition ?? 0,
      }))
      .filter((p) => p.thumb)
      .sort((a, b) => a.position - b.position)
      .map(({ position, ...p }) => p);

    if (!photos.length) return null;
    const rkey = uri.split("/").pop() ?? "";
    return {
      uri,
      rkey,
      href: `${PROFILE}/gallery/${rkey}`,
      title: typeof g.title === "string" ? g.title : "",
      description: typeof g.description === "string" ? g.description : "",
      createdAt: typeof g.createdAt === "string" ? g.createdAt : "",
      count: photos.length,
      photos,
      cover: photos[0] ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * The newest `limit` galleries (by original post date), fully resolved. Empty on
 * any failure. Used by the /now photos card.
 */
export async function getPhotoGalleries(limit = 12): Promise<PhotoGallery[]> {
  try {
    const refs = (await listGalleryRefs())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
    const galleries = await Promise.all(refs.map((r) => fetchGallery(r.uri)));
    return galleries.filter((g): g is PhotoGallery => g !== null);
  } catch {
    return [];
  }
}

const monthYear = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const truncate = (s: string, n: number): string =>
  s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;

/**
 * The newest galleries mapped to homepage activity-feed rows (one row per
 * gallery, using its cover). Never throws — returns [] on failure.
 */
export async function getPhotoActivity(limit = 8): Promise<ActivityItem[]> {
  const galleries = await getPhotoGalleries(limit);
  return galleries.map((g) => ({
    type: "photo",
    app: "grain",
    time: monthYear(g.createdAt),
    kind: g.count > 1 ? `Gallery · ${g.count} photos` : "Photo",
    title: truncate(g.title || g.description, 90) || undefined,
    url: g.href,
    imageUrl: g.cover?.thumb,
    imageAlt: g.cover?.alt || g.title || "Photo",
    mediaWidth: g.cover?.width || undefined,
    mediaHeight: g.cover?.height || undefined,
  }));
}
