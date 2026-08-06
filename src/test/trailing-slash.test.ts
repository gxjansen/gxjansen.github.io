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
 * Each on-demand page therefore needs its own forced redirect. This test fails
 * if one is added without it.
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

describe("trailing-slash redirects for on-demand pages", () => {
  const toml = readFileSync(join(ROOT, "netlify.toml"), "utf8");

  it("finds the known on-demand pages", () => {
    // Guards the detection itself: if this ever returns nothing, the assertions
    // below would pass vacuously.
    expect(onDemandPages().sort()).toEqual(["/bookshelf", "/now"]);
  });

  it.each(onDemandPages())(
    "%s has a forced trailing-slash redirect in netlify.toml",
    (route) => {
      // Match the from/to/status/force block for this exact route.
      const block = new RegExp(
        `from\\s*=\\s*"${route}"\\s*\\n\\s*to\\s*=\\s*"${route}/"\\s*\\n\\s*status\\s*=\\s*301\\s*\\n\\s*force\\s*=\\s*true`,
      );
      expect(
        block.test(toml),
        `${route} is rendered on demand, so netlify.toml needs:\n\n` +
          `[[redirects]]\n  from = "${route}"\n  to = "${route}/"\n` +
          `  status = 301\n  force = true\n\n` +
          `Without it ${route} returns 404 instead of redirecting to ${route}/.`,
      ).toBe(true);
    },
  );

  it("keeps the forced rules ahead of the non-forced splat", () => {
    // Netlify evaluates top-down, first match wins. Anchor to real TOML lines —
    // the surrounding comments quote these same keys.
    const lineIndex = (value: string) =>
      toml.search(new RegExp(`^\\s*from\\s*=\\s*"${value}"\\s*$`, "m"));
    const firstForced = lineIndex("/now");
    const splat = lineIndex("/\\*");
    expect(firstForced).toBeGreaterThan(-1);
    expect(splat).toBeGreaterThan(-1);
    expect(firstForced).toBeLessThan(splat);
  });
});
