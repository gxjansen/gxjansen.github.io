/**
 * Shared Listmonk config for the newsletter functions.
 *
 * Lives in an underscore-prefixed subdirectory so Netlify doesn't treat it as
 * a function: only top-level files, or a subdirectory's index/same-named
 * file, are deployed as functions. esbuild inlines it into each importer.
 */

const DEFAULT_LISTMONK_BASE_URL = "https://n.a11y.nl/api";

/** Listmonk API base URL, overridable with LISTMONK_BASE_URL. No trailing slash. */
export function listmonkBaseUrl(): string {
  const configured = process.env.LISTMONK_BASE_URL?.trim();
  return (configured || DEFAULT_LISTMONK_BASE_URL).replace(/\/+$/, "");
}

/**
 * Auth headers for the Listmonk API, or null when the API credentials aren't
 * configured. X-Bypass-Token gets requests past Cloudflare in front of
 * Listmonk (empty when CF_BYPASS_TOKEN is unset).
 */
export function listmonkAuthHeaders(): Record<string, string> | null {
  const apiUser = process.env.LISTMONK_API_USER;
  const apiKey = process.env.LISTMONK_API_KEY;
  if (!apiUser || !apiKey) return null;

  return {
    Authorization: `Basic ${Buffer.from(`${apiUser}:${apiKey}`).toString("base64")}`,
    "X-Bypass-Token": process.env.CF_BYPASS_TOKEN || "",
  };
}
