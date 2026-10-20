import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { default: handler } =
  await import("../../netlify/functions/getPodcastFeeds");

const ENDPOINT = "https://gui.do/.netlify/functions/getPodcastFeeds";
const get = () => new Request(ENDPOINT, { method: "GET" });

interface TestItem {
  title: string;
  pubDate: string;
  enclosure?: string;
  duration?: string;
}

function rss(channelTitle: string, items: TestItem[]): string {
  const xmlItems = items
    .map(
      (i) => `<item>
        <title>${i.title}</title>
        <description>About ${i.title}</description>
        <pubDate>${i.pubDate}</pubDate>
        ${i.duration ? `<itunes:duration>${i.duration}</itunes:duration>` : ""}
        ${i.enclosure ? `<enclosure url="${i.enclosure}" type="audio/mpeg"/>` : ""}
      </item>`,
    )
    .join("");
  return `<?xml version="1.0"?><rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"><channel><title>${channelTitle}</title>${xmlItems}</channel></rss>`;
}

const episode = (n: number, day: number, show = "a"): TestItem => ({
  title: `${show} ${n}`,
  pubDate: new Date(Date.UTC(2026, 0, day)).toUTCString(),
  enclosure: `https://media.transistor.fm/${show}${n}/audio.mp3`,
  duration: "1234",
});

function mockFeeds(feeds: Record<string, string | number | Error>) {
  return vi.fn(async (url: string) => {
    const name = url.split("/").pop()!;
    const feed = feeds[name];
    if (feed instanceof Error) throw feed;
    if (typeof feed === "number") return new Response("", { status: feed });
    if (feed === undefined) return new Response("", { status: 404 });
    return new Response(feed, { status: 200 });
  });
}

describe("getPodcastFeeds", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("merges all feeds newest first in the existing response shape", async () => {
    vi.stubGlobal(
      "fetch",
      mockFeeds({
        sheeptank: rss("Sheeptank", [episode(1, 1, "s"), episode(2, 10, "s")]),
        "cro-cafe": rss("CRO.CAFE", [episode(1, 5, "c")]),
        "cro-cafe-nl": rss("CRO.CAFE NL", [episode(1, 7, "n")]),
      }),
    );
    const res = await handler(get());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.map((e: { title: string }) => e.title)).toEqual([
      "s 2",
      "n 1",
      "c 1",
      "s 1",
    ]);
    expect(body[0]).toEqual({
      title: "s 2",
      description: "About s 2",
      pubDate: episode(2, 10).pubDate,
      duration: "1234",
      link: "https://share.transistor.fm/e/s2",
      podcastName: "Sheeptank",
    });
  });

  it("caps the list at 20 episodes", async () => {
    const many = Array.from({ length: 15 }, (_, i) => episode(i, i + 1));
    vi.stubGlobal(
      "fetch",
      mockFeeds({
        sheeptank: rss("A", many),
        "cro-cafe": rss(
          "B",
          many.map((e) => ({ ...e, title: `b${e.title}` })),
        ),
      }),
    );
    expect(await (await handler(get())).json()).toHaveLength(20);
  });

  it("drops items without a Transistor media enclosure", async () => {
    vi.stubGlobal(
      "fetch",
      mockFeeds({
        sheeptank: rss("A", [
          episode(1, 1),
          { title: "no enclosure", pubDate: episode(2, 2).pubDate },
          {
            title: "elsewhere",
            pubDate: episode(3, 3).pubDate,
            enclosure: "https://cdn.example.com/x.mp3",
          },
        ]),
      }),
    );
    const body = await (await handler(get())).json();
    expect(body.map((e: { title: string }) => e.title)).toEqual(["a 1"]);
    expect(body[0].duration).toBe("1234");
  });

  it("handles a feed with a single episode", async () => {
    vi.stubGlobal("fetch", mockFeeds({ sheeptank: rss("A", [episode(1, 1)]) }));
    expect(await (await handler(get())).json()).toHaveLength(1);
  });

  it("keeps serving the healthy feeds when one fails", async () => {
    vi.stubGlobal(
      "fetch",
      mockFeeds({
        sheeptank: new Error("ECONNRESET"),
        "cro-cafe": 500,
        "cro-cafe-nl": rss("NL", [episode(1, 1, "n")]),
      }),
    );
    const res = await handler(get());
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(1);
    expect(errorSpy).toHaveBeenCalled();
  });

  it("aborts a feed that takes longer than 5 seconds", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (url: string, init?: RequestInit) =>
          new Promise<Response>((resolve, reject) => {
            if (url.endsWith("/sheeptank")) {
              resolve(new Response(rss("A", [episode(1, 1)])));
              return;
            }
            init?.signal?.addEventListener("abort", () => {
              const err = new Error("aborted");
              err.name = "AbortError";
              reject(err);
            });
          }),
      ),
    );
    const pending = handler(get());
    await vi.advanceTimersByTimeAsync(5000);
    const res = await pending;
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(1);
  });

  it("sends standard browser and Netlify CDN cache headers", async () => {
    vi.stubGlobal("fetch", mockFeeds({ sheeptank: rss("A", [episode(1, 1)]) }));
    const res = await handler(get());
    expect(res.headers.get("cache-control")).toBe("public, max-age=3600");
    expect(res.headers.get("netlify-cdn-cache-control")).toBe(
      "public, durable, s-maxage=3600, stale-while-revalidate=86400",
    );
    expect(res.headers.get("stale-while-revalidate")).toBeNull();
    expect(res.headers.get("surrogate-control")).toBeNull();
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("does not cache an empty list when every feed fails", async () => {
    vi.stubGlobal("fetch", mockFeeds({}));
    const res = await handler(get());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("netlify-cdn-cache-control")).toBeNull();
  });

  it("returns a generic error without internal details", async () => {
    vi.stubGlobal("fetch", mockFeeds({ sheeptank: rss("A", [episode(1, 1)]) }));
    vi.spyOn(Array.prototype, "sort").mockImplementationOnce(() => {
      const err = new TypeError("internal detail: sort exploded");
      throw err;
    });
    const res = await handler(get());
    expect(res.status).toBe(500);
    const text = await res.text();
    expect(text).not.toContain("internal detail");
    expect(text).not.toContain("TypeError");
    expect(JSON.parse(text)).toEqual({
      error: "Failed to fetch podcast feeds",
    });
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("rejects non-GET methods", async () => {
    const res = await handler(new Request(ENDPOINT, { method: "POST" }));
    expect(res.status).toBe(405);
  });
});
