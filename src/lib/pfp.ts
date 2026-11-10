/**
 * /pfp: Guido's profile pictures, all hosted on Grain (social.grain.photo in
 * his PDS) and served from the Bluesky CDN.
 *
 * Two sources:
 * - src/data/pfp.ts: the fixed list picked in November 2026. Static, so the
 *   build never scans the thousands of older Grain records.
 * - Galleries created after PFP_SINCE whose description carries #pfp: every
 *   photo in such a gallery is added. Only records newer than the cutoff are
 *   read (TID rkeys, newest first), so this stays a request or two per build.
 *
 * Both are merged, deduplicated on the photo record key and sorted newest
 * first.
 */
import { z } from "astro/zod";
import { fixedPfps } from "@data/pfp";
import photosWithGuido from "@data/grain-photos-with-guido.json";
import { GUIDO_DID, loadCollection } from "./pds/loader";

export const PFP_SINCE = "2026-11-10T00:00:00Z";
export const GRAIN_GALLERY_COLLECTION = "social.grain.gallery";
const ITEM_COLLECTION = "social.grain.gallery.item";
const PHOTO_COLLECTION = "social.grain.photo";

export interface PfpEntry {
  /** Record key of the social.grain.photo record. */
  rkey: string;
  /** CID of the image blob. */
  cid: string;
  /** Date taken, YYYY-MM-DD. */
  date: string;
  width: number;
  height: number;
  alt: string;
  /** CSS object-position for the round crop (face centre when known). */
  focus: string;
  /** Record key of the Grain gallery the photo is in. */
  gallery: string;
  /** Locality from the gallery's address. */
  place?: string;
  /** ISO 3166 country code from the gallery's address. */
  country?: string;
}

const facetSchema = z.looseObject({
  features: z.array(
    z.looseObject({ $type: z.string(), tag: z.string().optional() }),
  ),
});

const gallerySchema = z.looseObject({
  title: z.string().optional(),
  description: z.string().optional(),
  facets: z.array(facetSchema).optional(),
  address: z
    .looseObject({
      locality: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  createdAt: z.string(),
});

const itemSchema = z.looseObject({
  gallery: z.string(),
  item: z.string(),
  position: z.number().optional(),
});

const photoSchema = z.looseObject({
  photo: z.looseObject({ ref: z.looseObject({ $link: z.string() }) }),
  alt: z.string().optional(),
  aspectRatio: z
    .looseObject({ width: z.number(), height: z.number() })
    .optional(),
  createdAt: z.string(),
});

type Gallery = z.output<typeof gallerySchema>;

/** True when a gallery is tagged #pfp (tag facet, or the plain text). */
export function hasPfpTag(g: Gallery): boolean {
  const facetTag = g.facets?.some((f) =>
    f.features.some(
      (ft) => ft.$type.endsWith("#tag") && ft.tag?.toLowerCase() === "pfp",
    ),
  );
  return Boolean(facetTag) || /(^|\s)#pfp\b/i.test(g.description ?? "");
}

/** Photos from #pfp galleries created after PFP_SINCE. */
async function loadTaggedPfps(): Promise<PfpEntry[]> {
  const opts = { since: PFP_SINCE };
  const [galleries, items, photos] = await Promise.all([
    loadCollection({
      collection: GRAIN_GALLERY_COLLECTION,
      schema: gallerySchema,
      ...opts,
    }),
    loadCollection({
      collection: ITEM_COLLECTION,
      schema: itemSchema,
      ...opts,
    }),
    loadCollection({
      collection: PHOTO_COLLECTION,
      schema: photoSchema,
      ...opts,
    }),
  ]);
  const tagged = new Map(
    galleries.records.filter((g) => hasPfpTag(g.value)).map((g) => [g.uri, g]),
  );
  const photoByUri = new Map(photos.records.map((p) => [p.uri, p]));
  const out: PfpEntry[] = [];
  for (const { value: item } of items.records) {
    const gallery = tagged.get(item.gallery);
    const photo = photoByUri.get(item.item);
    if (!gallery || !photo) continue;
    out.push({
      rkey: photo.rkey,
      cid: photo.value.photo.ref.$link,
      date: photo.value.createdAt.slice(0, 10),
      width: photo.value.aspectRatio?.width ?? 1,
      height: photo.value.aspectRatio?.height ?? 1,
      alt: photo.value.alt ?? "",
      focus: "50% 40%",
      gallery: gallery.rkey,
      place: gallery.value.address?.locality,
      country: gallery.value.address?.country,
    });
  }
  return out;
}

export interface GrainPhoto {
  rkey: string;
  cid: string;
  alt: string;
  gallery: string;
}

/**
 * The most recently uploaded Grain photos that are not on /pfp, one per
 * gallery, for the "more photos" grid. Reads only the newest records of
 * each collection.
 */
export async function loadRecentPhotos(count = 12): Promise<GrainPhoto[]> {
  const opts = { limit: 400 };
  const [galleries, items, photos] = await Promise.all([
    loadCollection({
      collection: GRAIN_GALLERY_COLLECTION,
      schema: gallerySchema,
      ...opts,
    }),
    loadCollection({
      collection: ITEM_COLLECTION,
      schema: itemSchema,
      ...opts,
    }),
    loadCollection({
      collection: PHOTO_COLLECTION,
      schema: photoSchema,
      ...opts,
    }),
  ]);
  const pfpGalleries = new Set(
    galleries.records.filter((g) => hasPfpTag(g.value)).map((g) => g.uri),
  );
  const galleryOf = new Map(
    items.records.map((i) => [i.value.item, i.value.gallery]),
  );
  // Not on /pfp, and no other photos of Guido either: the grid is for
  // everything else. grain-photos-with-guido.json lists the Grain photos
  // where a local face match found him (November 2026, not updated by CI).
  const pfpPhotos = new Set([
    ...fixedPfps.map((p) => p.rkey),
    ...photosWithGuido,
  ]);
  const pfpGalleryKeys = new Set(fixedPfps.map((p) => p.gallery));
  const out: GrainPhoto[] = [];
  for (const p of photos.records) {
    const galleryUri = galleryOf.get(p.uri);
    if (!galleryUri || pfpGalleries.has(galleryUri) || pfpPhotos.has(p.rkey))
      continue;
    // Skip galleries that hold a pfp, and take one photo per gallery so a
    // big upload doesn't fill the whole grid.
    const gallery = galleryUri.split("/").pop() ?? "";
    if (pfpGalleryKeys.has(gallery) || out.some((o) => o.gallery === gallery))
      continue;
    out.push({
      rkey: p.rkey,
      cid: p.value.photo.ref.$link,
      alt: p.value.alt ?? "",
      gallery,
    });
    if (out.length >= count) break;
  }
  return out;
}

/** Fixed list plus tagged additions, newest first. */
export async function loadPfps(): Promise<PfpEntry[]> {
  const seen = new Set(fixedPfps.map((p) => p.rkey));
  const extra = (await loadTaggedPfps()).filter((p) => !seen.has(p.rkey));
  return [...fixedPfps, ...extra].sort((a, b) => b.date.localeCompare(a.date));
}

/** [year, photos] pairs, newest year first; order within a year is kept. */
export function groupByYear(pfps: PfpEntry[]): [string, PfpEntry[]][] {
  const groups = new Map<string, PfpEntry[]>();
  for (const p of pfps) {
    const year = p.date.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), p]);
  }
  return [...groups];
}

const cdn = (size: string, cid: string) =>
  `https://cdn.bsky.app/img/${size}/plain/${GUIDO_DID}/${cid}@jpeg`;
/** Up to about 1000px: enough for the round crops. */
export const thumbUrl = (p: { cid: string }) => cdn("feed_thumbnail", p.cid);
export const galleryUrl = (p: { gallery: string }) =>
  `https://grain.social/profile/gui.do/gallery/${p.gallery}`;
