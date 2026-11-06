/**
 * `storyUrl` on /uses items drives the "Tools in this post" block on posts,
 * so every on-site story must be an existing post.
 */
import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { items, itemsForPost } from "../uses";

const POSTS = path.resolve(__dirname, "../../content/post");

describe("uses stories", () => {
  const onSite = items
    .map((i) => i.storyUrl)
    .filter((u): u is string => !!u?.startsWith("https://gui.do/post/"));

  it("every on-site storyUrl is an existing post", () => {
    for (const url of onSite) {
      const id = url.replace(/\/$/, "").split("/").pop()!;
      expect(fs.existsSync(path.join(POSTS, id)), url).toBe(true);
    }
  });

  it("itemsForPost finds the items that cite a post", () => {
    const id = onSite[0].replace(/\/$/, "").split("/").pop()!;
    expect(itemsForPost(id).length).toBeGreaterThan(0);
    expect(itemsForPost("no-such-post")).toEqual([]);
  });
});
