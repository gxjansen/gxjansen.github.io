import { defineMiddleware } from "astro:middleware";
import { markExternalLinks } from "./lib/externalLinks";

const siteHost = new URL(import.meta.env.SITE).hostname;
const SITE_HOSTS = [siteHost, `www.${siteHost}`];

/**
 * Opens off-site links in a new tab on every HTML page. Runs at build time
 * for prerendered pages and per request for on-demand ones.
 */
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get("content-type")?.includes("text/html"))
    return response;

  const html = await response.text();
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(markExternalLinks(html, SITE_HOSTS), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
