import { describe, it, expect } from "vitest";
import type { CollectionEntry } from "astro:content";
import { isPublished } from "../lib/isPublished";

type PostData = CollectionEntry<"post">["data"];
const post = (data: { draft?: boolean; pubDate: Date | string }) =>
  data as unknown as PostData;

const NOW = new Date("2026-10-20T12:00:00Z");

describe("isPublished", () => {
  it("shows a non-draft post whose pubDate has passed", () => {
    expect(isPublished(post({ pubDate: new Date("2026-01-01") }), NOW)).toBe(
      true,
    );
    expect(
      isPublished(post({ draft: false, pubDate: new Date("2026-01-01") }), NOW),
    ).toBe(true);
  });

  it("shows a post exactly at its pubDate", () => {
    expect(isPublished(post({ pubDate: new Date(NOW) }), NOW)).toBe(true);
  });

  it("hides a future-dated post", () => {
    expect(
      isPublished(post({ pubDate: new Date("2026-10-20T12:00:01Z") }), NOW),
    ).toBe(false);
  });

  it("hides drafts even when their pubDate has passed", () => {
    expect(
      isPublished(post({ draft: true, pubDate: new Date("2020-01-01") }), NOW),
    ).toBe(false);
  });

  it("accepts a string pubDate", () => {
    expect(isPublished(post({ pubDate: "2026-10-19" }), NOW)).toBe(true);
    expect(isPublished(post({ pubDate: "2026-10-21" }), NOW)).toBe(false);
  });

  it("defaults to the current time", () => {
    expect(isPublished(post({ pubDate: new Date(Date.now() - 1000) }))).toBe(
      true,
    );
    expect(
      isPublished(post({ pubDate: new Date(Date.now() + 86_400_000) })),
    ).toBe(false);
  });
});
