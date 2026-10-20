import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createHmac } from "node:crypto";

// Real altcha-lib (v1 API) by default; individual tests can make it throw.
const failCreate = { value: false };
vi.mock("altcha-lib/v1", async (importOriginal) => {
  const actual = await importOriginal<typeof import("altcha-lib/v1")>();
  return {
    ...actual,
    createChallenge: (...args: Parameters<typeof actual.createChallenge>) => {
      if (failCreate.value) throw new Error("internal detail: entropy");
      return actual.createChallenge(...args);
    },
  };
});

const { default: handler } =
  await import("../../netlify/functions/altcha-challenge");

const ENDPOINT = "https://gui.do/.netlify/functions/altcha-challenge";
const get = () => new Request(ENDPOINT, { method: "GET" });

describe("altcha-challenge", () => {
  beforeEach(() => {
    failCreate.value = false;
    vi.stubEnv("ALTCHA_HMAC_KEY", "test-key");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns a signed challenge that expires in 5 minutes", async () => {
    const before = Math.floor(Date.now() / 1000);
    const res = await handler(get());
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/json");

    const body = await res.json();
    expect(body).toMatchObject({ algorithm: "SHA-256", maxnumber: 300000 });
    expect(body.challenge).toMatch(/^[0-9a-f]{64}$/);

    // Signed with ALTCHA_HMAC_KEY, so newsletter-subscribe can verify it.
    const expected = createHmac("sha256", "test-key")
      .update(body.challenge)
      .digest("hex");
    expect(body.signature).toBe(expected);

    const expires = Number(
      new URLSearchParams(body.salt.split("?")[1]).get("expires"),
    );
    expect(expires).toBeGreaterThanOrEqual(before + 299);
    expect(expires).toBeLessThanOrEqual(before + 301);
  });

  it("issues a fresh challenge on every call", async () => {
    const a = await (await handler(get())).json();
    const b = await (await handler(get())).json();
    expect(a.challenge).not.toBe(b.challenge);
  });

  it("is never cacheable and sends no CORS header", async () => {
    const res = await handler(get());
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("fails closed when ALTCHA_HMAC_KEY is missing", async () => {
    vi.stubEnv("ALTCHA_HMAC_KEY", "");
    const res = await handler(get());
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Server configuration error" });
  });

  it("returns a generic error when challenge generation fails", async () => {
    failCreate.value = true;
    const res = await handler(get());
    expect(res.status).toBe(500);
    const text = await res.text();
    expect(text).not.toContain("internal detail");
    expect(JSON.parse(text)).toEqual({ error: "Failed to generate challenge" });
  });

  it.each(["POST", "OPTIONS", "PUT"])("rejects %s with 405", async (method) => {
    const res = await handler(new Request(ENDPOINT, { method }));
    expect(res.status).toBe(405);
  });
});
