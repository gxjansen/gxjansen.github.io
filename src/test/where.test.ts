import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  HOME_COUNTRY,
  PUBLIC_DELAY_MS,
  applyReport,
  parseCountry,
  publicView,
  type WhereState,
} from "../lib/where";

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

const { default: handler } = await import("../../netlify/functions/where");

const ENDPOINT = "https://gui.do/.netlify/functions/where";
const HOUR = 60 * 60 * 1000;
const T0 = new Date("2026-11-06T08:00:00Z");
const at = (hours: number) => new Date(T0.getTime() + hours * HOUR);

function post(body: unknown, token = "secret"): Request {
  return new Request(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** Feeds reports in order: [hoursAfterT0, country]. */
function replay(reports: [number, string][]): WhereState {
  let state: WhereState | null = null;
  for (const [h, cc] of reports) state = applyReport(state, cc, at(h));
  return state!;
}

describe("parseCountry", () => {
  it("uppercases two-letter codes", () => {
    expect(parseCountry("be")).toBe("BE");
    expect(parseCountry(" nl ")).toBe("NL");
  });

  it("rejects anything else", () => {
    for (const bad of ["", "bel", "b1", "es-ct", null, 42, undefined]) {
      expect(parseCountry(bad)).toBeNull();
    }
  });
});

describe("publicView", () => {
  it("is empty before the first report", () => {
    expect(publicView(null, T0)).toEqual({ country: null, seen: [] });
  });

  it("keeps showing home for the delay after leaving", () => {
    const state = replay([
      [0, "NL"],
      [1, "BE"],
    ]);
    expect(publicView(state, at(1 + 5.9)).country).toBe(HOME_COUNTRY);
    expect(publicView(state, at(1 + 6)).country).toBe("BE");
  });

  it("does not leak a second country inside the delay", () => {
    const state = replay([
      [0, "NL"],
      [1, "BE"],
      [3, "DE"],
    ]);
    expect(publicView(state, at(6.5)).country).toBe(HOME_COUNTRY);
    expect(publicView(state, at(7)).country).toBe("DE");
  });

  it("shows abroad -> abroad straight away once the trip is public", () => {
    const state = replay([
      [0, "NL"],
      [1, "BE"],
      [24, "DE"],
    ]);
    expect(publicView(state, at(24)).country).toBe("DE");
  });

  it("shows coming home straight away", () => {
    const state = replay([
      [0, "NL"],
      [1, "BE"],
      [24, "NL"],
    ]);
    expect(publicView(state, at(24)).country).toBe("NL");
  });

  it("delays a first report from abroad too", () => {
    const state = replay([[0, "US"]]);
    expect(publicView(state, at(1)).country).toBe(HOME_COUNTRY);
    expect(publicView(state, at(6)).country).toBe("US");
  });

  it("restarts the delay on a new trip", () => {
    const state = replay([
      [0, "NL"],
      [1, "BE"],
      [24, "NL"],
      [48, "FR"],
    ]);
    expect(publicView(state, at(50)).country).toBe(HOME_COUNTRY);
    expect(publicView(state, at(54)).country).toBe("FR");
  });

  it("adds new countries to the overview only after the delay", () => {
    const state = replay([
      [0, "NL"],
      [1, "BE"],
    ]);
    expect(publicView(state, at(2)).seen).toEqual([]);
    expect(publicView(state, at(7)).seen.sort()).toEqual(["BE", "NL"]);
  });

  it("keeps the first-seen time on later visits", () => {
    const state = replay([
      [0, "BE"],
      [24, "NL"],
      [48, "BE"],
    ]);
    expect(state.seen.BE).toBe(at(0).toISOString());
  });

  it("uses the configured delay", () => {
    expect(PUBLIC_DELAY_MS).toBe(6 * HOUR);
  });
});

describe("where function", () => {
  beforeEach(() => {
    blobs.clear();
    blobFailure.get = false;
    blobFailure.set = false;
    vi.stubEnv("WHERE_TOKEN", "secret");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("stores a valid report", async () => {
    const res = await handler(post({ country: "be" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const stored = blobs.get("state") as WhereState;
    expect(stored.country).toBe("BE");
    expect(stored.leftHomeAt).not.toBeNull();
    expect(Object.keys(stored.seen)).toEqual(["BE"]);
  });

  it("builds on the stored state", async () => {
    await handler(post({ country: "nl" }));
    await handler(post({ country: "de" }));
    const stored = blobs.get("state") as WhereState;
    expect(stored.country).toBe("DE");
    expect(Object.keys(stored.seen).sort()).toEqual(["DE", "NL"]);
  });

  it("rejects a wrong or missing token", async () => {
    expect((await handler(post({ country: "be" }, "nope"))).status).toBe(401);
    const bare = new Request(ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ country: "be" }),
    });
    expect((await handler(bare)).status).toBe(401);
    expect(blobs.size).toBe(0);
  });

  it("fails closed without WHERE_TOKEN", async () => {
    vi.stubEnv("WHERE_TOKEN", "");
    expect((await handler(post({ country: "be" }))).status).toBe(500);
  });

  it("rejects bad bodies", async () => {
    expect((await handler(post({ country: "bel" }))).status).toBe(400);
    expect((await handler(post({}))).status).toBe(400);
    expect((await handler(post("not json"))).status).toBe(400);
    expect(blobs.size).toBe(0);
  });

  it("only accepts POST", async () => {
    const res = await handler(new Request(ENDPOINT, { method: "GET" }));
    expect(res.status).toBe(405);
  });

  it("returns 503 when Blobs fails", async () => {
    blobFailure.set = true;
    expect((await handler(post({ country: "be" }))).status).toBe(503);
  });
});
