/**
 * Markdown for the live pages (/now, /bookshelf). The build-time integration
 * (src/integrations/markdown-endpoints.ts) only sees prerendered HTML, so the
 * on-demand `.md` endpoints render these sections straight from the same data
 * functions the pages use: getActivity, getPhotoGalleries, getReading and
 * getBookshelf.
 */
import { APP_REGISTRY, type ActivityItem } from "@data/homeContent";
import type { Book, BookshelfData, ReadingData } from "./bookhive";
import type { PhotoGallery } from "./grainPhotos";

/** CDN caching shared with the HTML versions of the live pages. */
export const LIVE_MD_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Netlify-CDN-Cache-Control":
    "public, durable, s-maxage=300, stale-while-revalidate=3600",
  "Cache-Control": "no-cache",
};

/** Escapes characters that would turn plain text into Markdown syntax. */
export function mdText(s: string): string {
  return s
    .replace(/\s+/g, " ")
    .trim()
    .replace(/([\\`*_[\]<>])/g, "\\$1");
}

/** Percent-encodes the characters that would end a Markdown link target. */
function mdUrl(href: string): string {
  return href.replace(
    /[\s()]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`,
  );
}

function link(text: string, href?: string): string {
  return href ? `[${mdText(text)}](${mdUrl(href)})` : mdText(text);
}

function appLabel(key: string): string {
  return APP_REGISTRY[key]?.label ?? key;
}

/** Bookhive rates 0–10; the site shows five stars, to the nearest half. */
function stars(rating: number): string {
  return `${Math.round((rating / 10) * 5 * 2) / 2}/5`;
}

export function activityMarkdown(items: ActivityItem[], limit = 20): string {
  if (items.length === 0) return "No recent activity right now.\n";
  return (
    items
      .slice(0, limit)
      .map((it) => {
        const head = `**${mdText(appLabel(it.app))}** · ${mdText(it.kind)}`;
        const body = it.text
          ? mdText(it.text)
          : [it.title, it.sub]
              .filter((p): p is string => Boolean(p))
              .map(mdText)
              .join(" · ");
        const rating =
          typeof it.rating === "number" ? ` (${stars(it.rating)})` : "";
        const when = it.url
          ? `[${mdText(it.time)}](${mdUrl(it.url)})`
          : mdText(it.time);
        return `* ${head}${body ? `: ${body}` : ""}${rating} · ${when}`;
      })
      .join("\n") + "\n"
  );
}

export function photosMarkdown(galleries: PhotoGallery[]): string {
  if (galleries.length === 0) return "No recent photos right now.\n";
  return (
    galleries
      .map((g) => {
        const title = g.title || g.createdAt.slice(0, 10) || "Photo gallery";
        const count = g.count > 1 ? ` · ${g.count} photos` : "";
        const desc = g.description ? `: ${mdText(g.description)}` : "";
        return `* ${link(title, g.href)}${count}${desc}`;
      })
      .join("\n") + "\n"
  );
}

function bookLine(b: Book): string {
  const by = b.author ? ` by ${mdText(b.author)}` : "";
  const rating = typeof b.rating === "number" ? ` (${stars(b.rating)})` : "";
  return `* ${link(b.title, b.href)}${by}${rating}`;
}

function bookList(books: Book[]): string {
  return books.map(bookLine).join("\n") + "\n";
}

export function readingMarkdown(data: ReadingData): string {
  const parts: string[] = [];
  if (data.active.length > 0) {
    parts.push(`### Reading now\n\n${bookList(data.active)}`);
  }
  if (data.recent.length > 0) {
    parts.push(`### Recently read\n\n${bookList(data.recent)}`);
  }
  return parts.length > 0
    ? parts.join("\n")
    : "Reading list is taking a breather.\n";
}

export function bookshelfMarkdown(
  data: BookshelfData,
  bookhiveHref: string,
): string {
  const { active, wantToRead, finished, finishedCount } = data;
  if (active.length + wantToRead.length + finished.length === 0) {
    return "The shelf is taking a breather. Check back soon.\n";
  }
  const parts: string[] = [];
  if (active.length > 0) parts.push(`## Reading now\n\n${bookList(active)}`);
  if (finished.length > 0) {
    const caption =
      finishedCount > finished.length
        ? `The ${finished.length} most recent of the ${finishedCount} books I've read.`
        : `All ${finishedCount} books I've read.`;
    parts.push(
      `## Recently read\n\n${bookList(finished)}\n${caption} ` +
        `View them all on my [Bookhive profile](${mdUrl(bookhiveHref)}).\n`,
    );
  }
  if (wantToRead.length > 0) {
    parts.push(`## Want to read\n\n${bookList(wantToRead)}`);
  }
  return parts.join("\n");
}
