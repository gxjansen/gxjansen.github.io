/**
 * Rules for the next-step paths in src/data/paths.ts: every target and page
 * exists, no page sends visitors straight back to itself or to an earlier
 * stage, every chain ends in an Act step, and every slashpage and post gets a
 * NextStep (except the pages that are the action themselves).
 */
import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  ACT_TARGETS,
  clusters,
  pages,
  pathFor,
  postCluster,
  stepsForPage,
  stepsForPost,
  targetStage,
  targets,
  type Stage,
  type TargetKey,
} from "../paths";
import { slashPages, pageHref } from "../slashes";

const SRC = path.resolve(__dirname, "../..");
const PAGES_DIR = path.join(SRC, "pages");
const POSTS_DIR = path.join(SRC, "content/post");
const ORDER: Record<Stage, number> = { discover: 0, know: 1, trust: 2, act: 3 };

/** Pages that are the action themselves, or keep their own CTAs. */
const NO_NEXT_STEP = new Set(["/", "/follow/", "/contact/", "/retainer/"]);

/** True when a route exists: a page file, or a post folder. */
function routeExists(href: string): boolean {
  const p = href.replace(/^\/|\/$/g, "");
  const post = p.match(/^post\/(.+)$/);
  if (post) return fs.existsSync(path.join(POSTS_DIR, post[1]));
  if (p.endsWith("*"))
    return fs.existsSync(path.join(PAGES_DIR, p.slice(0, -2)));
  return [`${p}.astro`, `${p}/index.astro`].some((f) =>
    fs.existsSync(path.join(PAGES_DIR, f)),
  );
}

const keys = Object.keys(targets) as TargetKey[];

describe("paths: targets", () => {
  it.each(keys)("%s points at an existing route", (key) => {
    expect(routeExists(targets[key].href), targets[key].href).toBe(true);
  });

  it.each(keys)("%s has copy within the limits", (key) => {
    const words = (s: string) => s.trim().split(/\s+/).length;
    const t = targets[key];
    expect(words(t.heading), "heading").toBeLessThanOrEqual(8);
    expect(words(t.body), "body").toBeLessThanOrEqual(30);
    expect(words(t.button), "button").toBeLessThanOrEqual(4);
  });
});

describe("paths: pages", () => {
  const entries = Object.entries(pages);

  it.each(entries)("%s exists as a route", (route) => {
    expect(routeExists(route)).toBe(true);
  });

  it.each(entries)(
    "%s: first step is not itself or an earlier stage",
    (route, p) => {
      const first = p.next[0];
      expect(first).toBeDefined();
      expect(targets[first].href).not.toBe(route);
      const stage = targetStage(first);
      if (stage) expect(ORDER[stage]).toBeGreaterThanOrEqual(ORDER[p.stage]);
    },
  );

  it.each(entries)("%s: chain ends in an Act step", (_route, p) => {
    expect(ACT_TARGETS).toContain(p.next.at(-1));
  });

  it.each(entries)(
    "%s: overrides only target its own candidates",
    (_route, p) => {
      for (const key of Object.keys(p.overrides ?? {})) {
        expect(p.next).toContain(key);
      }
    },
  );

  it("no two pages send each other back and forth as first step", () => {
    for (const [route, p] of entries) {
      const back = pages[targets[p.next[0]].href];
      if (back) expect(targets[back.next[0]].href, route).not.toBe(route);
    }
  });

  it("every slashpage with its own route gets a NextStep, except the act pages", () => {
    for (const page of slashPages) {
      const href = pageHref(page);
      if (page.redirectTo || NO_NEXT_STEP.has(href)) continue;
      expect(pathFor(href), href).toBeDefined();
    }
  });

  it("matches wildcard routes and resolves placeholders", () => {
    expect(pathFor("/events/some-event-id/")).toBe(pages["/events/*"]);
    expect(pathFor("/events")).toBe(pages["/events/"]);
    const where = stepsForPage("/where/")[0];
    expect(where.heading).toBe("Most flags are from talks");
    expect(where.body).not.toMatch(/\{\w+\}/);
  });

  it("gives no NextStep on pages that are the action", () => {
    for (const route of NO_NEXT_STEP) expect(stepsForPage(route)).toEqual([]);
  });
});

describe("paths: posts", () => {
  const slugs = fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  it.each(Object.entries(clusters))(
    "cluster %s ends in an Act step",
    (_c, chain) => {
      expect(ACT_TARGETS).toContain(chain.at(-1));
    },
  );

  it("every post gets at least one step and never itself", () => {
    for (const slug of slugs) {
      const steps = stepsForPost(slug);
      expect(steps.length, slug).toBeGreaterThan(0);
      expect(
        steps.map((s) => s.href),
        slug,
      ).not.toContain(`/post/${slug}/`);
    }
  });

  it("legacy CRO posts may show CRO.CAFE, current posts never do", () => {
    expect(postCluster("the-cro-process", ["Experimentation"])).toBe(
      "legacyCro",
    );
    expect(postCluster("optimize-magento-for-speed", ["Magento"])).toBe(
      "legacy",
    );
    expect(postCluster("ai-slop-reputation")).toBe("community");
  });

  it("frontmatter next overrides the cluster and rejects unknown keys", () => {
    expect(
      stepsForPost("ai-slop-reputation", [], ["uses"]).map((s) => s.key),
    ).toEqual(["uses"]);
    expect(() => stepsForPost("x", [], ["nope"])).toThrow(
      /Unknown next target/,
    );
  });
});
