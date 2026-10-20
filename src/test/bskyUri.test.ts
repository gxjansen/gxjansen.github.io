import { describe, it, expect } from "vitest";
import { normalizeBskyUri } from "../lib/bskyUri";

const DID = "did:plc:45uheisi25szrjvjurfpritx";

describe("normalizeBskyUri", () => {
  it("maps a handle permalink to gui.do's DID", () => {
    expect(
      normalizeBskyUri("https://bsky.app/profile/gui.do/post/3kabc123"),
    ).toEqual({
      atUri: `at://${DID}/app.bsky.feed.post/3kabc123`,
      bskyUrl: "https://bsky.app/profile/gui.do/post/3kabc123",
    });
  });

  it("keeps an explicit DID from a permalink", () => {
    expect(
      normalizeBskyUri("https://bsky.app/profile/did:plc:other/post/3kxyz"),
    ).toEqual({
      atUri: "at://did:plc:other/app.bsky.feed.post/3kxyz",
      bskyUrl: "https://bsky.app/profile/did:plc:other/post/3kxyz",
    });
  });

  it("accepts an at:// URI and builds the permalink", () => {
    expect(normalizeBskyUri(`at://${DID}/app.bsky.feed.post/3kabc123`)).toEqual(
      {
        atUri: `at://${DID}/app.bsky.feed.post/3kabc123`,
        bskyUrl: `https://bsky.app/profile/${DID}/post/3kabc123`,
      },
    );
  });

  it("trims whitespace and ignores query strings and fragments", () => {
    expect(
      normalizeBskyUri(
        "  https://bsky.app/profile/gui.do/post/3kabc?ref=x#top ",
      )?.atUri,
    ).toBe(`at://${DID}/app.bsky.feed.post/3kabc`);
    expect(
      normalizeBskyUri(`at://${DID}/app.bsky.feed.post/3kabc?x=1`)?.atUri,
    ).toBe(`at://${DID}/app.bsky.feed.post/3kabc`);
  });

  it("accepts http permalinks", () => {
    expect(
      normalizeBskyUri("http://bsky.app/profile/gui.do/post/3kabc")?.atUri,
    ).toBe(`at://${DID}/app.bsky.feed.post/3kabc`);
  });

  it.each([
    "",
    "   ",
    "https://bsky.app/profile/gui.do",
    "https://bsky.app/profile/gui.do/post/",
    "https://example.com/profile/gui.do/post/3kabc",
    "at://gui.do/app.bsky.feed.post/3kabc",
    `at://${DID}/app.bsky.feed.like/3kabc`,
    "not a url",
  ])("returns null for %j", (input) => {
    expect(normalizeBskyUri(input)).toBeNull();
  });

  it("returns null for a missing value", () => {
    expect(normalizeBskyUri(undefined as unknown as string)).toBeNull();
  });
});
