import type { Config, Context } from "@netlify/edge-functions";

/**
 * Content negotiation: a request whose Accept header prefers text/markdown
 * gets the page's pre-built Markdown (written by
 * src/integrations/markdown-endpoints.ts as dist/<route>/index.md) instead of
 * the HTML, at the same URL.
 *
 * This replaces `[[redirects]]` rules with `conditions = {Header = ...}` in
 * netlify.toml. Netlify redirect conditions only support Language, Country,
 * Role and Cookie, so those rules never fired and every page returned HTML.
 *
 * The `header` matcher in the config below means the function only runs when
 * Accept mentions text/markdown. Browsers never send that, so regular page
 * views don't pay an edge invocation.
 */

/** q-value of a media type in an Accept header; 0 when absent. */
function qualityOf(accept: string, type: string): number {
  let best = 0;
  for (const part of accept.split(",")) {
    const [range, ...params] = part.trim().toLowerCase().split(";");
    if (range.trim() !== type) continue;
    const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    const value = q ? Number(q.slice(2)) : 1;
    if (Number.isFinite(value)) best = Math.max(best, value);
  }
  return best;
}

/**
 * True when the client asks for Markdown at least as strongly as HTML.
 * `text/markdown, text/html;q=0.9` -> true; `text/html, text/markdown;q=0.5`
 * -> false; `text/markdown;q=0` -> false.
 */
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const md = qualityOf(accept, "text/markdown");
  return md > 0 && md >= qualityOf(accept, "text/html");
}

/**
 * Path of the pre-built Markdown for a page URL, or null for URLs that can't
 * be a page (files with an extension, such as /feed.xml or /about.md).
 * `/` -> `/index.md`, `/about/` -> `/about/index.md`, `/about` -> the same.
 */
export function markdownPathFor(pathname: string): string | null {
  const last = pathname.split("/").pop() ?? "";
  if (last.includes(".")) return null;
  return pathname.endsWith("/")
    ? `${pathname}index.md`
    : `${pathname}/index.md`;
}

export default async (request: Request, context: Context) => {
  if (request.method !== "GET" && request.method !== "HEAD")
    return context.next();
  if (!prefersMarkdown(request.headers.get("accept"))) return context.next();

  const url = new URL(request.url);
  const mdPath = markdownPathFor(url.pathname);
  if (!mdPath) return context.next();

  const md = await fetch(new URL(mdPath, url), { method: request.method });
  // Pages without a Markdown version (the AMA, newsletter, ...) fall back to
  // their HTML.
  if (!md.ok) return context.next();

  const headers = new Headers(md.headers);
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("Content-Location", mdPath);
  headers.set("Vary", "Accept");
  return new Response(md.body, { status: 200, headers });
};

export const config: Config = {
  path: "/*",
  excludedPath: [
    "/*.md",
    "/_astro/*",
    "/_server-islands/*",
    "/api/*",
    "/.netlify/*",
  ],
  header: { accept: "text/markdown" },
};
