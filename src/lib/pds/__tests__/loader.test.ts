import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { z } from "astro/zod";
import {
  loadCollection,
  PdsSchemaError,
  PdsRequestError,
  resetPdsLoaderForTests,
} from "../loader";

const DID = "did:plc:testtesttesttesttesttest";
const PDS = "https://pds.example";
const COLLECTION = "dev.example.thing";
const schema = z.object({ name: z.string() });

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const record = (rkey: string, value: unknown) => ({
  uri: `at://${DID}/${COLLECTION}/${rkey}`,
  cid: `cid-${rkey}`,
  value,
});

/** A fetch stub that serves the DID doc plus the given listRecords pages. */
function fakeFetch(pages: unknown[] | (() => Response)) {
  return vi.fn(async (input: string | URL | Request) => {
    const url = new URL(String(input));
    if (url.origin === "https://plc.directory") {
      return json({
        service: [{ id: "#atproto_pds", serviceEndpoint: PDS }],
      });
    }
    if (typeof pages === "function") return pages();
    const cursor = url.searchParams.get("cursor");
    return json(pages[cursor ? Number(cursor) : 0]);
  });
}

let cacheDir: string;
const opts = (fetchImpl: typeof fetch) => ({
  collection: COLLECTION,
  schema,
  did: DID,
  cacheDir,
  fetchImpl,
  attempts: 2,
  retryDelayMs: 0,
});

beforeEach(() => {
  resetPdsLoaderForTests();
  cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), "pds-cache-"));
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  fs.rmSync(cacheDir, { recursive: true, force: true });
});

describe("loadCollection", () => {
  it("follows the cursor, validates and writes the cache", async () => {
    const f = fakeFetch([
      { cursor: "1", records: [record("a", { name: "A" })] },
      { records: [record("b", { name: "B", extra: true })] },
    ]);
    const res = await loadCollection(opts(f as unknown as typeof fetch));
    expect(res.source).toBe("live");
    expect(res.records.map((r) => [r.rkey, r.value.name])).toEqual([
      ["a", "A"],
      ["b", "B"],
    ]);
    const files = fs.readdirSync(cacheDir);
    expect(files).toHaveLength(1);
    const cached = JSON.parse(
      fs.readFileSync(path.join(cacheDir, files[0]), "utf8"),
    );
    expect(cached.records).toHaveLength(2);
  });

  it("fails hard on a schema mismatch, even with a cache", async () => {
    await loadCollection(
      opts(
        fakeFetch([
          { records: [record("a", { name: "A" })] },
        ]) as unknown as typeof fetch,
      ),
    );
    resetPdsLoaderForTests();
    const bad = fakeFetch([{ records: [record("a", { name: 42 })] }]);
    await expect(
      loadCollection(opts(bad as unknown as typeof fetch)),
    ).rejects.toThrow(PdsSchemaError);
  });

  it("falls back to the cache when the PDS is down, and records it", async () => {
    await loadCollection(
      opts(
        fakeFetch([
          { records: [record("a", { name: "A" })] },
        ]) as unknown as typeof fetch,
      ),
    );
    resetPdsLoaderForTests();
    const down = fakeFetch(() => json({ error: "down" }, 503));
    const res = await loadCollection(opts(down as unknown as typeof fetch));
    expect(res.source).toBe("cache");
    expect(res.records[0].value.name).toBe("A");
    // DID doc once, listRecords twice (attempts: 2).
    expect(down).toHaveBeenCalledTimes(3);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("PDS UNREACHABLE"),
    );
    const fallbacks = JSON.parse(
      fs.readFileSync(path.join(cacheDir, "fallbacks.json"), "utf8"),
    );
    expect(fallbacks[0].collection).toBe(COLLECTION);
  });

  it("treats a network error as an outage", async () => {
    const offline = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(
      loadCollection(opts(offline as unknown as typeof fetch)),
    ).rejects.toThrow(/no cached copy/);
  });

  it("does not fall back on a 4xx", async () => {
    await loadCollection(
      opts(
        fakeFetch([
          { records: [record("a", { name: "A" })] },
        ]) as unknown as typeof fetch,
      ),
    );
    resetPdsLoaderForTests();
    const gone = fakeFetch(() => json({ error: "RepoNotFound" }, 400));
    await expect(
      loadCollection(opts(gone as unknown as typeof fetch)),
    ).rejects.toThrow(PdsRequestError);
  });

  it("revalidates cached data against the current schema", async () => {
    await loadCollection(
      opts(
        fakeFetch([
          { records: [record("a", { name: "A" })] },
        ]) as unknown as typeof fetch,
      ),
    );
    resetPdsLoaderForTests();
    const down = fakeFetch(() => json({}, 502));
    await expect(
      loadCollection({
        ...opts(down as unknown as typeof fetch),
        schema: z.object({ name: z.string(), size: z.number() }),
      }),
    ).rejects.toThrow(PdsSchemaError);
  });

  it("shares one fetch between callers in the same build", async () => {
    const f = fakeFetch([{ records: [record("a", { name: "A" })] }]);
    const [a, b] = await Promise.all([
      loadCollection(opts(f as unknown as typeof fetch)),
      loadCollection(opts(f as unknown as typeof fetch)),
    ]);
    expect(a).toBe(b);
    expect(f).toHaveBeenCalledTimes(2);
  });
});
