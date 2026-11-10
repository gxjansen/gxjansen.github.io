import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const used = new Map<string, string>();
const blobsDown = { value: false };
vi.mock("@netlify/blobs", () => ({
  getStore: () => {
    if (blobsDown.value) throw new Error("blobs unavailable");
    return {
      get: async (key: string) => used.get(key) ?? null,
      set: async (key: string, value: string) => {
        used.set(key, value);
      },
    };
  },
}));

const verifySolution = vi.fn();
vi.mock("altcha-lib/v1", () => ({
  verifySolution: (...args: unknown[]) => verifySolution(...args),
}));

const { default: handler, resolveListId } =
  await import("../../netlify/functions/newsletter-subscribe");

const ENDPOINT = "https://gui.do/.netlify/functions/newsletter-subscribe";

const BROWSER_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
  Origin: "https://gui.do",
  "Sec-Fetch-Site": "same-origin",
};

function post(
  body: Record<string, unknown>,
  headers: Record<string, string | undefined> = {},
): Request {
  const merged = Object.fromEntries(
    Object.entries({ ...BROWSER_HEADERS, ...headers }).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  );
  return new Request(ENDPOINT, {
    method: "POST",
    headers: merged,
    body: JSON.stringify(body),
  });
}

const valid = {
  email: "reader@example.com",
  listId: "3",
  altcha: "solved-payload",
  elapsedMs: 12000,
};

const SUCCESS = "Thanks! Please check your email to confirm your subscription.";

describe("newsletter-subscribe", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    used.clear();
    blobsDown.value = false;
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
    // Same reply as a new signup, so the form can't enumerate subscribers.
    expect((await res.json()).message).toBe(SUCCESS);
  });

  describe("bot checks", () => {
    async function expectSilentDrop(res: Response) {
      expect(res.status).toBe(200);
      expect((await res.json()).message).toBe(SUCCESS);
      expect(fetchMock).not.toHaveBeenCalled();
    }

    it("silently drops a filled-in honeypot", async () => {
      await expectSilentDrop(
        await handler(post({ ...valid, hp_note: "https://spam.example" })),
      );
    });

    it("silently drops a quoted or missing User-Agent", async () => {
      await expectSilentDrop(
        await handler(
          post(valid, { "User-Agent": `"${BROWSER_HEADERS["User-Agent"]}"` }),
        ),
      );
      await expectSilentDrop(
        await handler(post(valid, { "User-Agent": undefined })),
      );
    });

    it("silently drops Gmail addresses with many dots", async () => {
      await expectSilentDrop(
        await handler(post({ ...valid, email: "l.u.y.i.w.azi49@gmail.com" })),
      );
    });

    it("rejects a missing or foreign Origin", async () => {
      expect((await handler(post(valid, { Origin: undefined }))).status).toBe(
        400,
      );
      expect(
        (await handler(post(valid, { Origin: "https://evil.example" }))).status,
      ).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects a cross-site Sec-Fetch-Site", async () => {
      const res = await handler(
        post(valid, { "Sec-Fetch-Site": "cross-site" }),
      );
      expect(res.status).toBe(400);
    });

    it("rejects a submit that is too fast or has no timing", async () => {
      expect((await handler(post({ ...valid, elapsedMs: 800 }))).status).toBe(
        400,
      );
      const { elapsedMs: _omit, ...untimed } = valid;
      expect((await handler(post(untimed))).status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("fails closed when the replay store is unavailable", async () => {
      blobsDown.value = true;
      const res = await handler(post(valid));
      expect(res.status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("skips a Gmail inbox that is already on the list", async () => {
      fetchMock.mockImplementation(async (url: string) =>
        url.includes("/subscribers?")
          ? new Response(JSON.stringify({ data: { total: 1 } }), {
              status: 200,
            })
          : new Response("{}", { status: 200 }),
      );
      const res = await handler(
        post({ ...valid, email: "Luyi.Wazi49+news@googlemail.com" }),
      );
      expect((await res.json()).message).toBe(SUCCESS);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const lookup = new URL(fetchMock.mock.calls[0][0]);
      expect(lookup.searchParams.get("list_id")).toBe("3");
      expect(lookup.searchParams.get("query")).toContain("= 'luyiwazi49'");
    });

    it("subscribes a new Gmail inbox after the lookup", async () => {
      fetchMock.mockImplementation(async (url: string) => {
        if (url.includes("/subscribers?"))
          return new Response(JSON.stringify({ data: { total: 0 } }));
        if (url.endsWith("/subscribers"))
          return new Response(JSON.stringify({ data: { id: 7 } }));
        return new Response("{}");
      });
      const res = await handler(post({ ...valid, email: "j.doe@gmail.com" }));
      expect(res.status).toBe(200);
      expect(fetchMock.mock.calls.some(([url]) => url.endsWith("/optin"))).toBe(
        true,
      );
    });

    it("pauses signups once the hourly cap is reached", async () => {
      used.set(new Date().toISOString().slice(0, 13), "30");
      const res = await handler(post(valid));
      expect(res.status).toBe(429);
      expect(
        fetchMock.mock.calls.some(([url]) => url.endsWith("/subscribers")),
      ).toBe(false);
    });
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
