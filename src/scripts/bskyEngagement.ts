/**
 * Shared client-side Bluesky engagement refresh (stale-while-revalidate),
 * mirroring the live-avatar strategy in SiteLogo.astro. Used by BOTH the
 * /post/ index grid and individual article bylines.
 *
 * Strategy:
 *   1. The HTML ships a build-time total baked into each `.bsky-eng[data-bsky-uri]`
 *      element — no-JS-safe, first-paint-correct, CLS-free.
 *   2. On load, apply the cached totals from localStorage instantly.
 *   3. Refresh once per ~2h: ONE batched getPosts call for the at:// URIs in the
 *      DOM, then update the digits in place and write back to cache.
 *   4. On any failure, keep the existing numbers.
 *
 * CRITICAL: this only UPDATES the count of already-rendered elements. It never
 * adds or removes one — the decision to show a count is a build-time concern
 * (the index thresholds; the article page shows any real engagement), so there
 * is no layout shift and never-rendered counts stay absent. It also touches
 * ONLY the `.bsky-eng-n` textContent and the `.bsky-eng` aria-label, so it works
 * for both the index (plain muted span) and the article byline (text inside a
 * foam link) regardless of wrapping or styling.
 */
const KEY = "guido:postEngagement";
const TTL = 2 * 60 * 60 * 1000; // a couple of hours
const ENDPOINT = "https://public.api.bsky.app/xrpc/app.bsky.feed.getPosts";

type Counts = { likes: number; reposts: number; replies: number };
type Cached = { counts: Record<string, Counts>; ts: number };

/** Every `.bsky-eng[data-bsky-uri]` on the page (index grid OR article byline). */
function engElements(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(".bsky-eng[data-bsky-uri]"),
  );
}

/**
 * Update the count of every existing element whose at:// URI we have a count
 * for. Never creates or removes elements; only mutates `.bsky-eng-n` text and
 * the `.bsky-eng` aria-label.
 */
function applyCounts(counts: Record<string, Counts>) {
  engElements().forEach((el) => {
    const uri = el.dataset.bskyUri;
    if (!uri) return;
    const c = counts[uri];
    if (!c) return;
    const total = (c.likes ?? 0) + (c.reposts ?? 0) + (c.replies ?? 0);
    const n = el.querySelector<HTMLElement>(".bsky-eng-n");
    if (n) n.textContent = String(total);
    el.setAttribute("aria-label", `${total} interactions on Bluesky`);
  });
}

function refresh() {
  const els = engElements();
  if (!els.length) return;

  let cached: Cached | null = null;
  try {
    cached = JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    cached = null;
  }

  // Apply last-known-good totals immediately (no flash back to stale build #s).
  if (cached?.counts) applyCounts(cached.counts);

  const fresh = cached && Date.now() - cached.ts < TTL;
  if (fresh) return;

  // One batched getPosts call for exactly the URIs present in the DOM.
  const uris = [
    ...new Set(els.map((s) => s.dataset.bskyUri).filter(Boolean)),
  ] as string[];
  if (!uris.length) return;
  const qs = uris.map((u) => `uris=${encodeURIComponent(u)}`).join("&");

  fetch(`${ENDPOINT}?${qs}`)
    .then((r) =>
      r.ok ? r.json() : Promise.reject(new Error(String(r.status))),
    )
    .then((data: any) => {
      const counts: Record<string, Counts> = {};
      for (const p of data?.posts ?? []) {
        if (!p?.uri) continue;
        counts[p.uri] = {
          likes: p.likeCount ?? 0,
          reposts: p.repostCount ?? 0,
          replies: p.replyCount ?? 0,
        };
      }
      if (!Object.keys(counts).length) return;
      applyCounts(counts);
      try {
        localStorage.setItem(
          KEY,
          JSON.stringify({ counts, ts: Date.now() } satisfies Cached),
        );
      } catch {
        /* storage full / disabled — the in-memory update still applied */
      }
    })
    .catch(() => {
      /* offline / rate-limited / schema change → keep the existing numbers */
    });
}

/**
 * Wire up the engagement refresh: run once now and again after every Astro
 * view-transition swap. Safe to call on any page; it no-ops when no
 * `.bsky-eng` elements are present.
 */
export function initBskyEngagement() {
  refresh();
  document.addEventListener("astro:after-swap", refresh);
}
