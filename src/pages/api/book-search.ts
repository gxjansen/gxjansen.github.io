// Same-origin proxy for Bookhive's book search, used by the /bookshelf
// "suggest a book" typeahead. Bookhive's `searchBooks` XRPC works but sends no
// CORS header, so the browser can't call it from gui.do directly — this endpoint
// fetches it server-side and returns a trimmed, stable shape. Read-only, no auth.
import type { APIRoute } from "astro";

export const prerender = false;

const BOOKHIVE_SEARCH = "https://bookhive.buzz/xrpc/buzz.bookhive.searchBooks";
const MAX_RESULTS = 8;

interface HiveBook {
  id?: string;
  title?: string;
  authors?: string;
  thumbnail?: string;
  cover?: string;
}

export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get("q") ?? "").trim();

  // Too short to be a meaningful search — return empty rather than hammering
  // Bookhive on every keystroke.
  if (q.length < 2) {
    return json({ books: [] });
  }

  try {
    const res = await fetch(`${BOOKHIVE_SEARCH}?q=${encodeURIComponent(q)}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return json({ books: [] });

    const data = (await res.json()) as { books?: HiveBook[] };
    const books = (data.books ?? [])
      .filter((b) => b.id && b.title)
      .slice(0, MAX_RESULTS)
      .map((b) => ({
        id: b.id,
        title: b.title,
        author: b.authors ?? "",
        thumbnail: b.thumbnail ?? b.cover ?? "",
      }));

    return json({ books });
  } catch {
    // Network/timeout — the client falls back to a plain suggest link.
    return json({ books: [] });
  }
};

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      // Short edge cache: identical queries are cheap to reuse, but the shelf
      // stays fresh as Bookhive's catalog grows.
      "Netlify-CDN-Cache-Control":
        "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
