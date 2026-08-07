import type { Config, Context } from "@netlify/edge-functions";

/**
 * 301s slash-less URLs for on-demand rendered pages.
 *
 * The site runs `trailingSlash: 'always'`. netlify.toml's splat rule handles
 * prerendered pages, but it's `force = false`, so it only fires when nothing
 * else claims the path. On-demand (`prerender = false`) pages are claimed by
 * the Astro Netlify adapter's SSR function, which mounts at `path: "/*"`;
 * Astro's router then rejects the slash-less URL and returns a 404. So /about
 * redirected while /now and /bookshelf 404'd.
 *
 * Two approaches were tried and rejected, both worth recording:
 *
 * 1. Astro middleware. Never runs — Astro rejects the unmatched URL before the
 *    middleware chain. Confirmed by tracing the built SSR handler: `/now/`
 *    enters middleware, `/now` never does.
 *
 * 2. Forced exact-path redirects in netlify.toml (`from = "/now"`). Netlify
 *    normalises the trailing slash when matching `from`, so the rule matched
 *    `/now/` as well and redirected it to itself. Verified on a deploy
 *    preview: `/now/` returned 301 -> /now/ and looped until curl gave up.
 *
 * An edge function runs ahead of both redirects and the SSR function, and gets
 * the unnormalised URL — so the "does this path already end in a slash?"
 * decision is made here, in code, rather than inferred from a match pattern.
 * That's what makes it loop-proof: `/now/` is inspected and passed through.
 */
export default async (request: Request, context: Context) => {
  const url = new URL(request.url);

  // Already canonical. This is the branch that a netlify.toml `from` rule
  // cannot express, and the reason that approach looped.
  if (url.pathname.endsWith("/")) return context.next();

  // Only GET/HEAD. A 301 lets the client drop the body and downgrade the
  // method, which would silently break a POST to an API route.
  if (request.method !== "GET" && request.method !== "HEAD")
    return context.next();

  url.pathname += "/";
  // url carries the query string, so ?q=... survives the redirect.
  return Response.redirect(url, 301);
};

/**
 * Scoped to the on-demand pages rather than "/*", so static assets and API
 * routes never pay an edge invocation. src/test/trailing-slash.test.ts fails
 * if a `prerender = false` page is added without being listed here.
 */
export const config: Config = {
  path: ["/now", "/bookshelf"],
};
