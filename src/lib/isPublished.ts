import type { CollectionEntry } from "astro:content";

/**
 * A post is publicly visible once it is not a draft AND its `pubDate` has
 * passed. Astro builds are static, so this is evaluated at build time: a
 * future-dated post becomes visible on the next site build after its `pubDate`
 * passes. Publishing is manual — commit the episode and trigger a deploy when
 * it's due (or set `pubDate` to now and deploy).
 *
 * Use this in EVERY reader-facing `getCollection("post", ...)` so future-dated
 * episodes stay hidden on the blog index, RSS, category/author pages, OG image
 * generation and at their own URL (`getStaticPaths` skips them → 404 until
 * release).
 *
 * The one deliberate exception is the series landing page (`/series/atproto/`),
 * which renders all episodes — released ones link out, scheduled ones show a
 * non-clickable "Coming {date}" card.
 */
export function isPublished(
  data: CollectionEntry<"post">["data"],
  now: Date = new Date(),
): boolean {
  return !data.draft && new Date(data.pubDate) <= now;
}
