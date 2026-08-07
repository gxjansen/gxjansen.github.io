import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * The site runs `trailingSlash: 'always'`. netlify.toml's splat rule redirects
 * `/foo` -> `/foo/`, but it's `force = false`, so it only fires when nothing
 * else claims the path. The Astro Netlify adapter mounts its SSR function at
 * `path: "/*"`, so on-demand (`prerender = false`) pages are claimed by the
 * function, Astro's router rejects the slash-less URL, and the visitor gets a
 * 404 rather than a redirect — which is how /now and /bookshelf broke.
 *
 * Those pages are handled by netlify/edge-functions/trailing-slash.ts, which is
 * scoped to an explicit list. This test fails if an on-demand page is added
 * without being listed there.
 */

// vitest runs from the project root (see robots.test.ts); `import.meta.url`
// resolves through vite's /@fs prefix here, so cwd is the reliable anchor.
const ROOT = process.cwd();
const PAGES = join(ROOT, "src/pages");

/** Route path for a page file: src/pages/now.astro -> /now */
function routeFor(file: string): string {
  return (
    "/" +
    relative(PAGES, file)
      .replace(/\.astro$/, "")
      .replace(/\/index$/, "")
  );
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

/**
 * On-demand .astro pages that a visitor can reach by typing the URL. Excludes
 * /api and /internal (fetched by code, always with an explicit trailing slash)
 * and dynamic `[param]` routes, which can't be expressed as an exact redirect.
 */
function onDemandPages(): string[] {
  return walk(PAGES)
    .filter((f) => f.endsWith(".astro"))
    .filter((f) =>
      /export const prerender = false/.test(readFileSync(f, "utf8")),
    )
    .map(routeFor)
    .filter((route) => !route.startsWith("/api/"))
    .filter((route) => !route.startsWith("/internal/"))
    .filter((route) => !route.includes("["));
}

const EDGE_FUNCTION = "netlify/edge-functions/trailing-slash.ts";

describe("trailing-slash redirects for on-demand pages", () => {
  const edge = readFileSync(join(ROOT, EDGE_FUNCTION), "utf8");
  /** The `path: [...]` array from the edge function's exported config. */
  const scopedPaths = (edge.match(/path:\s*\[([^\]]*)\]/)?.[1] ?? "")
    .split(",")
    .map((entry) => entry.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);

  it("finds the known on-demand pages", () => {
    // Guards the detection itself: if this ever returns nothing, the assertions
    // below would pass vacuously.
    expect(onDemandPages().sort()).toEqual(["/bookshelf", "/now"]);
  });

  it.each(onDemandPages())("%s is in the edge function's scope", (route) => {
    expect(
      scopedPaths,
      `${route} is rendered on demand, so it needs to be listed in the ` +
        `config.path array of ${EDGE_FUNCTION}. Without it, ${route} returns ` +
        `404 instead of redirecting to ${route}/.`,
    ).toContain(route);
  });

  it("passes through paths that already end in a slash", () => {
    // The bug that killed the netlify.toml approach: an exact `from = "/now"`
    // rule also matched /now/ and redirected it to itself, looping. The edge
    // function must inspect the path instead of relying on match semantics.
    expect(edge).toMatch(/pathname\.endsWith\(["']\/["']\)/);
    expect(edge).toMatch(/context\.next\(\)/);
  });

  it("does not redirect methods that carry a body", () => {
    // A 301 lets the client drop the body and downgrade to GET.
    expect(edge).toMatch(/method !== ["']GET["']/);
    expect(edge).toMatch(/method !== ["']HEAD["']/);
  });

  it("no longer carries the looping forced redirects in netlify.toml", () => {
    const toml = readFileSync(join(ROOT, "netlify.toml"), "utf8");
    for (const route of onDemandPages()) {
      expect(
        toml,
        `A forced "${route}" redirect in netlify.toml also matches ${route}/ ` +
          `and redirects it to itself. Netlify normalises the trailing slash ` +
          `when matching \`from\`. Use the edge function instead.`,
      ).not.toMatch(new RegExp(`^\\s*from\\s*=\\s*"${route}"\\s*$`, "m"));
    }
  });
});
