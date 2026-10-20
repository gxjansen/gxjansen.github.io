import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const blobs = new Map<string, unknown>();
const blobFailure = { get: false, set: false };
vi.mock("@netlify/blobs", () => ({
  getStore: () => ({
    get: async (key: string) => {
      if (blobFailure.get) throw new Error("blob get failed");
      return blobs.get(key) ?? null;
    },
    setJSON: async (key: string, value: unknown) => {
      if (blobFailure.set) throw new Error("blob set failed");
      blobs.set(key, structuredClone(value));
    },
  }),
}));

const { default: handler } =
  await import("../../netlify/functions/newsletter-stats");

const ENDPOINT = "https://gui.do/.netlify/functions/newsletter-stats";
const get = () => new Request(ENDPOINT, { method: "GET" });

type Reply = number | "fail";

function mockSources(listmonk: Reply, atproto: Reply) {
  return vi.fn(async (url: string, _init?: RequestInit) => {
    if (url.includes("/subscribers?")) {
      return listmonk === "fail"
        ? new Response("{}", { status: 502 })
        : Response.json({ data: { total: listmonk } });
    }
    if (url.startsWith("https://constellation.microcosm.blue/")) {
      return atproto === "fail"
        ? new Response("{}", { status: 503 })
        : Response.json({ total: atproto });
    }
    throw new Error(`unexpected fetch ${url}`);
  });
}

describe("newsletter-stats", () => {
  beforeEach(() => {
    blobs.clear();
    blobFailure.get = false;
    blobFailure.set = false;
    vi.stubEnv("LISTMONK_API_USER", "user");
    vi.stubEnv("LISTMONK_API_KEY", "key");
    vi.stubEnv("LISTMONK_BASE_URL", "");
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns the combined Listmonk + AT Protocol total", async () => {
    vi.stubGlobal("fetch", mockSources(120, 30));
    const res = await handler(get());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, subscriberCount: 150 });
    expect(res.headers.get("cache-control")).toBe("public, max-age=3600");
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("calls Listmonk with Basic auth at the default base URL", async () => {
    const fetchMock = mockSources(1, 1);
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("CF_BYPASS_TOKEN", "bypass");
    await handler(get());
    const [url, init] = fetchMock.mock.calls.find(([u]) =>
      u.includes("/subscribers?"),
    )!;
    expect(url).toBe("https://n.a11y.nl/api/subscribers?page=1&per_page=1");
    expect(init?.headers).toMatchObject({
      Authorization: `Basic ${Buffer.from("user:key").toString("base64")}`,
      "X-Bypass-Token": "bypass",
    });
  });

  it("honours LISTMONK_BASE_URL", async () => {
    const fetchMock = mockSources(1, 1);
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("LISTMONK_BASE_URL", "https://lists.example.test/api/");
    await handler(get());
    expect(fetchMock.mock.calls.map(([u]) => u)).toContain(
      "https://lists.example.test/api/subscribers?page=1&per_page=1",
    );
  });

  it("skips Listmonk when credentials are not configured", async () => {
    vi.stubEnv("LISTMONK_API_KEY", "");
    const fetchMock = mockSources(999, 30);
    vi.stubGlobal("fetch", fetchMock);
    const res = await handler(get());
    expect((await res.json()).subscriberCount).toBe(30);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps the last known value when a source fails", async () => {
    vi.stubGlobal("fetch", mockSources(100, 20));
    await handler(get());

    vi.stubGlobal("fetch", mockSources("fail", 25));
    const res = await handler(get());
    expect((await res.json()).subscriberCount).toBe(125);
  });

  it("returns null when no source has ever answered", async () => {
    vi.stubGlobal("fetch", mockSources("fail", "fail"));
    const res = await handler(get());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, subscriberCount: null });
  });

  it("treats a malformed constellation reply as zero", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.includes("/subscribers?")
          ? Response.json({ data: { total: 7 } })
          : Response.json({ unexpected: true }),
      ),
    );
    expect((await (await handler(get())).json()).subscriberCount).toBe(7);
  });

  it("still answers when the blob store is unavailable", async () => {
    blobFailure.get = true;
    blobFailure.set = true;
    vi.stubGlobal("fetch", mockSources(10, 5));
    const res = await handler(get());
    expect(res.status).toBe(200);
    expect((await res.json()).subscriberCount).toBe(15);
  });

  it("only accepts GET", async () => {
    vi.stubGlobal("fetch", mockSources(1, 1));
    const res = await handler(new Request(ENDPOINT, { method: "POST" }));
    expect(res.status).toBe(405);
  });
});
