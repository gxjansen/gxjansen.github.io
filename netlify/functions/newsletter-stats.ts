import { getStore } from "@netlify/blobs";
import { listmonkAuthHeaders, listmonkBaseUrl } from "./_shared/listmonk";

/**
 * Subscriber Stats API
 *
 * Returns a single combined subscriber count for gui.do:
 *   Listmonk newsletter subscribers + standard.site (AT Protocol) subscribers.
 *
 * Each source is refreshed independently on every (uncached) invocation. If a
 * source is unreachable, its previous value is kept — a source outage never
 * zeroes the total. Last-known-good values are persisted in Netlify Blobs.
 *
 * Only the combined total is returned. The per-source breakdown is deliberately
 * not exposed (readers discover the AT Protocol side when they subscribe).
 *
 * Called same-origin from NewsletterForm.astro, so no CORS headers are sent.
 *
 * Env: LISTMONK_API_USER, LISTMONK_API_KEY, (optional) LISTMONK_BASE_URL,
 * CF_BYPASS_TOKEN.
 */

const CONSTELLATION_URL = "https://constellation.microcosm.blue";

// gui.do's canonical standard.site publication ("Guido X Jansen" -> gui.do).
// (A second publication record 3mks6auwo4i2o points at offprint and has no
// followers — readers subscribe to this one.)
const PUBLICATION_URI =
  "at://did:plc:45uheisi25szrjvjurfpritx/site.standard.publication/3mgfeypogdk2r";

const STORE_NAME = "subscriber-stats";
const CACHE_KEY = "counts";

interface CachedCounts {
  listmonk: number | null;
  atproto: number | null;
  listmonkUpdatedAt: string | null;
  atprotoUpdatedAt: string | null;
}

const EMPTY_CACHE: CachedCounts = {
  listmonk: null,
  atproto: null,
  listmonkUpdatedAt: null,
  atprotoUpdatedAt: null,
};

function json(
  status: number,
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

/** Listmonk total subscribers. Returns null when not configured; throws on error. */
async function fetchListmonkCount(): Promise<number | null> {
  const headers = listmonkAuthHeaders();
  if (!headers) return null;

  const response = await fetch(
    `${listmonkBaseUrl()}/subscribers?page=1&per_page=1`,
    { method: "GET", headers },
  );
  if (!response.ok) throw new Error(`Listmonk API returned ${response.status}`);
  const data = (await response.json()) as { data: { total: number } };
  return data.data.total;
}

/** standard.site subscriber count via the constellation backlink index. Throws on error. */
async function fetchAtprotoCount(): Promise<number> {
  const url =
    `${CONSTELLATION_URL}/links/count/distinct-dids` +
    `?target=${encodeURIComponent(PUBLICATION_URI)}` +
    `&collection=site.standard.graph.subscription&path=.publication`;

  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Constellation API returned ${response.status}`);
  const data = (await response.json()) as { total?: number };
  return typeof data.total === "number" ? data.total : 0;
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  // Load last-known-good counts (best effort — never let a blob error break the page).
  let store: ReturnType<typeof getStore> | null = null;
  let cache: CachedCounts = { ...EMPTY_CACHE };
  try {
    store = getStore(STORE_NAME);
    const stored = (await store.get(CACHE_KEY, {
      type: "json",
    })) as CachedCounts | null;
    if (stored) cache = { ...EMPTY_CACHE, ...stored };
  } catch (error) {
    console.warn("Subscriber stats: blob store unavailable", error);
  }

  const now = new Date().toISOString();

  // Refresh both sources independently and in parallel; keep the prior value on failure.
  const [listmonkResult, atprotoResult] = await Promise.allSettled([
    fetchListmonkCount(),
    fetchAtprotoCount(),
  ]);

  if (listmonkResult.status === "fulfilled") {
    if (listmonkResult.value !== null) {
      cache.listmonk = listmonkResult.value;
      cache.listmonkUpdatedAt = now;
    }
  } else {
    console.warn(
      "Subscriber stats: Listmonk fetch failed",
      listmonkResult.reason,
    );
  }

  if (atprotoResult.status === "fulfilled") {
    cache.atproto = atprotoResult.value;
    cache.atprotoUpdatedAt = now;
  } else {
    console.warn(
      "Subscriber stats: constellation fetch failed",
      atprotoResult.reason,
    );
  }

  // Persist refreshed last-known-good values (best effort).
  if (store) {
    try {
      await store.setJSON(CACHE_KEY, cache);
    } catch (error) {
      console.warn("Subscriber stats: could not persist counts", error);
    }
  }

  // Combined total. Null only if we have never successfully read either source.
  const haveAny = cache.listmonk !== null || cache.atproto !== null;
  const subscriberCount = haveAny
    ? (cache.listmonk ?? 0) + (cache.atproto ?? 0)
    : null;

  return json(
    200,
    { success: true, subscriberCount },
    { "Cache-Control": "public, max-age=3600" },
  );
};
