import { describe, it, expect } from "vitest";
import {
  prefersMarkdown,
  markdownPathFor,
} from "../../netlify/edge-functions/markdown-negotiation";

describe("prefersMarkdown", () => {
  it.each([
    ["text/markdown", true],
    ["text/markdown, text/html;q=0.9", true],
    ["text/html;q=0.5, text/markdown", true],
    ["text/markdown;q=0.8, text/html;q=0.8", true],
    ["TEXT/MARKDOWN", true],
    ["text/html, text/markdown;q=0.5", false],
    ["text/markdown;q=0", false],
    ["text/html,application/xhtml+xml,*/*;q=0.8", false],
    ["text/markdownish", false],
    ["", false],
  ])("%j -> %s", (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });

  it("is false without an Accept header", () => {
    expect(prefersMarkdown(null)).toBe(false);
  });
});

describe("markdownPathFor", () => {
  it.each([
    ["/", "/index.md"],
    ["/about/", "/about/index.md"],
    ["/about", "/about/index.md"],
    ["/post/some-slug/", "/post/some-slug/index.md"],
  ])("%s -> %s", (pathname, expected) => {
    expect(markdownPathFor(pathname)).toBe(expected);
  });

  it.each(["/feed.xml", "/about.md", "/og.png"])(
    "%s has no Markdown version",
    (pathname) => {
      expect(markdownPathFor(pathname)).toBeNull();
    },
  );
});
