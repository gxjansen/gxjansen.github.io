import { describe, expect, it } from "vitest";
import {
  activityMarkdown,
  bookshelfMarkdown,
  mdText,
  photosMarkdown,
  readingMarkdown,
} from "../liveMarkdown";
import type { Book } from "../bookhive";

const book = (title: string, extra: Partial<Book> = {}): Book => ({
  title,
  author: "Ann Author",
  accent: "foam" as Book["accent"],
  href: `https://bookhive.buzz/books/${title.toLowerCase()}`,
  ...extra,
});

describe("mdText", () => {
  it("escapes Markdown syntax and flattens whitespace", () => {
    expect(mdText("a *b* [c]\n  _d_")).toBe("a \\*b\\* \\[c\\] \\_d\\_");
  });
});

describe("activityMarkdown", () => {
  it("lists items with app, kind, text and a linked time", () => {
    const md = activityMarkdown([
      {
        type: "post",
        app: "bluesky",
        kind: "Post",
        time: "2h ago",
        text: "Hello\nworld",
        url: "https://bsky.app/profile/gui.do/post/1",
      },
      {
        type: "review",
        app: "popfeed",
        kind: "Reviewed",
        time: "1d ago",
        title: "Dune",
        sub: "2021",
        rating: 9,
      },
    ]);
    expect(md).toContain(
      "* **Bluesky** · Post: Hello world · [2h ago](https://bsky.app/profile/gui.do/post/1)",
    );
    expect(md).toContain(
      "* **Popfeed** · Reviewed: Dune · 2021 (4.5/5) · 1d ago",
    );
  });

  it("caps the list and handles empty input", () => {
    const items = Array.from({ length: 30 }, (_, i) => ({
      type: "post" as const,
      app: "bluesky",
      kind: "Post",
      time: `${i}m`,
      text: `p${i}`,
    }));
    expect(activityMarkdown(items, 5).trim().split("\n")).toHaveLength(5);
    expect(activityMarkdown([])).toBe("No recent activity right now.\n");
  });
});

describe("photosMarkdown", () => {
  it("links galleries with counts", () => {
    const md = photosMarkdown([
      {
        uri: "at://x",
        rkey: "1",
        href: "https://grain.social/profile/gui.do/gallery/1",
        title: "Amsterdam",
        description: "",
        createdAt: "2026-11-01T10:00:00Z",
        count: 12,
        photos: [],
        cover: null,
      },
    ]);
    expect(md).toBe(
      "* [Amsterdam](https://grain.social/profile/gui.do/gallery/1) · 12 photos\n",
    );
  });
});

describe("readingMarkdown", () => {
  it("shows current and recent books, or a fallback", () => {
    const md = readingMarkdown({ active: [book("Dune")], recent: [] });
    expect(md).toContain("### Reading now");
    expect(md).toContain(
      "* [Dune](https://bookhive.buzz/books/dune) by Ann Author",
    );
    expect(readingMarkdown({ active: [], recent: [] })).toContain("breather");
  });
});

describe("bookshelfMarkdown", () => {
  it("renders the three shelves and the total", () => {
    const md = bookshelfMarkdown(
      {
        active: [book("Dune")],
        wantToRead: [book("Emma")],
        finished: [book("Ubik", { rating: 8 })],
        finishedCount: 40,
      },
      "https://bookhive.buzz/profile/gui.do",
    );
    expect(md.indexOf("## Reading now")).toBeLessThan(
      md.indexOf("## Recently read"),
    );
    expect(md).toContain("(4/5)");
    expect(md).toContain("The 1 most recent of the 40 books I've read.");
    expect(md).toContain("## Want to read");
  });

  it("encodes characters that would break a link target", () => {
    const md = bookshelfMarkdown(
      {
        active: [book("X", { href: "https://example.com/a (b)" })],
        wantToRead: [],
        finished: [],
        finishedCount: 0,
      },
      "https://bookhive.buzz/profile/gui.do",
    );
    expect(md).toContain("(https://example.com/a%20%28b%29)");
  });
});
