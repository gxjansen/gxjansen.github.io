/**
 * Checks the slash page map in src/data/slashes.ts: every canonical page has a
 * route, slugs don't collide, and every alias anchor exists as an id in the
 * target page's source, so a renamed section can't silently break a deeplink.
 */
import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { slashPages, slashRedirects } from "../slashes";

const PAGES_DIR = path.resolve(__dirname, "../../pages");

/** Source file for a top-level route: pages/<slug>.astro or pages/<slug>/index.astro. */
function pageSource(slug: string): string | undefined {
  const candidates = [
    path.join(PAGES_DIR, `${slug}.astro`),
    path.join(PAGES_DIR, slug, "index.astro"),
  ];
  const file = candidates.find((f) => fs.existsSync(f));
  return file && fs.readFileSync(file, "utf8");
}

describe("slash pages", () => {
  it("every canonical page has a route", () => {
    for (const page of slashPages) {
      expect(pageSource(page.slug), `/${page.slug}/`).toBeDefined();
    }
  });

  it("has no duplicate slugs across pages and aliases", () => {
    const slugs = slashPages.flatMap((p) => [
      p.slug,
      ...(p.aliases ?? []).map((a) => a.slug),
    ]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("aliases don't shadow an existing route", () => {
    for (const page of slashPages) {
      for (const alias of page.aliases ?? []) {
        expect(pageSource(alias.slug), `/${alias.slug}/`).toBeUndefined();
      }
    }
  });

  it("every alias anchor exists as an id on its target page", () => {
    for (const page of slashPages) {
      for (const alias of page.aliases ?? []) {
        if (!alias.anchor) continue;
        expect(
          pageSource(page.slug),
          `#${alias.anchor} on /${page.slug}/`,
        ).toContain(`id="${alias.anchor}"`);
      }
    }
  });

  it("generates a 302 redirect per alias", () => {
    expect(slashRedirects()["/languages"]).toEqual({
      destination: "/cv/#languages",
      status: 302,
    });
    expect(slashRedirects()["/slash"]).toEqual({
      destination: "/slashes/",
      status: 302,
    });
  });
});
