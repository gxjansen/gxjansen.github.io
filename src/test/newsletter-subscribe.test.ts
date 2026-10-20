import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const used = new Map<string, string>();
vi.mock("@netlify/blobs", () => ({
  getStore: () => ({
    get: async (key: string) => used.get(key) ?? null,
    set: async (key: string, value: string) => {
      used.set(key, value);
    },
  }),
}));

const verifySolution = vi.fn();
vi.mock("altcha-lib/v1", () => ({
  verifySolution: (...args: unknown[]) => verifySolution(...args),
}));

const { default: handler, resolveListId } =
  await import("../../netlify/functions/newsletter-subscribe");

const ENDPOINT = "https://gui.do/.netlify/functions/newsletter-subscribe";

function post(body: Record<string, unknown>): Request {
  return new Request(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const valid = {
  email: "reader@example.com",
  listId: "3",
  altcha: "solved-payload",
};

describe("newsletter-subscribe", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    used.clear();
    verifySolution.mockReset().mockResolvedValue(true);
    vi.stubEnv("ALTCHA_HMAC_KEY", "test-key");
    vi.stubEnv("LISTMONK_API_USER", "user");
    vi.stubEnv("LISTMONK_API_KEY", "key");
    fetchMock = vi.fn(async (url: string) =>
      url.endsWith("/subscribers")
        ? new Response(JSON.stringify({ data: { id: 42 } }), { status: 200 })
        : new Response("{}", { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("subscribes a valid request to the default list", async () => {
    const res = await handler(post(valid));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
    const listCall = fetchMock.mock.calls.find(([url]) =>
      url.endsWith("/subscribers/lists"),
    );
    expect(JSON.parse(listCall![1].body).target_list_ids).toEqual([3]);
  });

  it("fails closed when ALTCHA_HMAC_KEY is missing", async () => {
    vi.stubEnv("ALTCHA_HMAC_KEY", "");
    const res = await handler(post(valid));
    expect(res.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a missing ALTCHA solution", async () => {
    const res = await handler(post({ email: valid.email }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid ALTCHA solution", async () => {
    verifySolution.mockResolvedValue(false);
    const res = await handler(post(valid));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a reused ALTCHA solution", async () => {
    expect((await handler(post(valid))).status).toBe(200);
    fetchMock.mockClear();
    const res = await handler(post({ ...valid, email: "other@example.com" }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects lists outside the allowlist", async () => {
    const res = await handler(post({ ...valid, listId: "7" }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects invalid and overlong email addresses", async () => {
    expect(
      (await handler(post({ ...valid, email: "not-an-email" }))).status,
    ).toBe(400);
    const long = `${"a".repeat(250)}@example.com`;
    expect((await handler(post({ ...valid, email: long }))).status).toBe(400);
  });

  it("does not leak Listmonk error messages to the client", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "internal detail: db timeout" }), {
        status: 500,
      }),
    );
    const res = await handler(post(valid));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(
      "Subscription failed. Please try again.",
    );
  });

  it("treats an existing subscriber as success", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "E-mail already exists." }), {
        status: 409,
      }),
    );
    const res = await handler(post(valid));
    expect(res.status).toBe(200);
  });

  it("sends no wildcard CORS header", async () => {
    const res = await handler(post(valid));
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("only accepts POST", async () => {
    const res = await handler(new Request(ENDPOINT, { method: "GET" }));
    expect(res.status).toBe(405);
  });

  it("rejects malformed JSON", async () => {
    const res = await handler(
      new Request(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{not json",
      }),
    );
    expect(res.status).toBe(400);
  });
});

describe("resolveListId", () => {
  it("defaults to list 3 and rejects unknown ids", () => {
    expect(resolveListId(undefined)).toBe(3);
    expect(resolveListId("")).toBe(3);
    expect(resolveListId("3")).toBe(3);
    expect(resolveListId(3)).toBe(3);
    expect(resolveListId("4")).toBeNull();
    expect(resolveListId("3abc")).toBeNull();
  });
});
