/**
 * Shared build-time loader for slash pages built from Guido's AT Protocol
 * records: one collection in, validated records out.
 *
 * Failure modes are split on purpose:
 * - Schema mismatch (a record no longer matches the zod schema) throws and
 *   fails the build. That is a real break, usually an upstream lexicon change,
 *   and rendering a half-empty page with a green build would hide it.
 * - Outage (PDS or PLC unreachable, timeouts, 5xx, 429) is retried, then falls
 *   back to the last good copy in `.pds-cache/` with a loud warning, so a PDS
 *   hiccup never blocks an unrelated deploy. With no cached copy it throws.
 *
 * The cache dir survives between builds through the local Netlify plugin in
 * netlify/plugins/pds-cache (and actions/cache in CI). Every successful live
 * load rewrites its cache file; a fallback is recorded in
 * `.pds-cache/fallbacks.json`, which that plugin turns into a deploy notice.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { z } from "astro/zod";

export const GUIDO_DID = "did:plc:45uheisi25szrjvjurfpritx";
const PLC_DIRECTORY = "https://plc.directory";
const PAGE_LIMIT = 100;
/** Hard stop against a cursor loop: 50 pages of 100 records. */
const MAX_PAGES = 50;

export interface PdsRecord<T> {
  uri: string;
  cid: string;
  rkey: string;
  value: T;
}

export interface LoadResult<T> {
  records: PdsRecord<T>[];
  /** "live" from the PDS, or "cache" when the PDS was unreachable. */
  source: "live" | "cache";
  /** When the records were fetched from the PDS (ISO 8601). */
  fetchedAt: string;
}

export interface LoadOptions<S extends z.ZodType> {
  /** Collection NSID, e.g. "dev.keytrace.claim". */
  collection: string;
  /** Schema for a record's `value`. Unknown extra keys should be allowed. */
  schema: S;
  did?: string;
  cacheDir?: string;
  fetchImpl?: typeof fetch;
  /** Attempts per request before treating the PDS as unreachable. */
  attempts?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}

/** A record failed validation. Never falls back to the cache. */
export class PdsSchemaError extends Error {
  override name = "PdsSchemaError";
}

/** The PDS answered, but not in a way a retry or the cache can fix (4xx). */
export class PdsRequestError extends Error {
  override name = "PdsRequestError";
}

/** Network failure, timeout, 5xx or 429: worth a retry, then the cache. */
class PdsOutageError extends Error {
  override name = "PdsOutageError";
}

interface CacheFile {
  did: string;
  collection: string;
  fetchedAt: string;
  records: PdsRecord<unknown>[];
}

const defaultCacheDir = () =>
  process.env.PDS_CACHE_DIR ?? path.join(process.cwd(), ".pds-cache");

const cacheFileFor = (dir: string, did: string, collection: string) =>
  path.join(dir, `${did.replaceAll(":", "_")}--${collection}.json`);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Ctx {
  fetchImpl: typeof fetch;
  attempts: number;
  retryDelayMs: number;
  timeoutMs: number;
}

async function getJson(url: string, ctx: Ctx): Promise<unknown> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= ctx.attempts; attempt++) {
    try {
      const res = await ctx.fetchImpl(url, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(ctx.timeoutMs),
      });
      if (res.ok) return await res.json();
      if (res.status >= 500 || res.status === 429) {
        throw new PdsOutageError(`${res.status} ${res.statusText} for ${url}`);
      }
      const body = await res.text().catch(() => "");
      throw new PdsRequestError(
        `${res.status} ${res.statusText} for ${url}: ${body.slice(0, 300)}`,
      );
    } catch (err) {
      if (err instanceof PdsRequestError) throw err;
      lastError = err;
      if (attempt < ctx.attempts) await sleep(ctx.retryDelayMs * attempt);
    }
  }
  const msg =
    lastError instanceof Error ? lastError.message : String(lastError);
  throw new PdsOutageError(`unreachable after ${ctx.attempts} tries: ${msg}`);
}

const pdsByDid = new Map<string, Promise<string>>();

/** PDS endpoint from the DID document, so a PDS move needs no code change. */
function resolvePds(did: string, ctx: Ctx): Promise<string> {
  let p = pdsByDid.get(did);
  if (!p) {
    p = (async () => {
      if (!did.startsWith("did:plc:")) {
        throw new PdsRequestError(`only did:plc is supported, got ${did}`);
      }
      const doc = (await getJson(`${PLC_DIRECTORY}/${did}`, ctx)) as {
        service?: { id?: string; serviceEndpoint?: string }[];
      };
      const endpoint = doc.service?.find(
        (s) => s.id === "#atproto_pds",
      )?.serviceEndpoint;
      if (!endpoint) throw new PdsRequestError(`no PDS in DID doc of ${did}`);
      return endpoint.replace(/\/$/, "");
    })();
    // A failed lookup must not stick for the rest of the build.
    p.catch(() => pdsByDid.delete(did));
    pdsByDid.set(did, p);
  }
  return p;
}

interface ListRecordsPage {
  cursor?: string;
  records?: { uri: string; cid: string; value: unknown }[];
}

async function fetchAll(
  did: string,
  collection: string,
  ctx: Ctx,
): Promise<PdsRecord<unknown>[]> {
  const pds = await resolvePds(did, ctx);
  const out: PdsRecord<unknown>[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const url = new URL(`${pds}/xrpc/com.atproto.repo.listRecords`);
    url.searchParams.set("repo", did);
    url.searchParams.set("collection", collection);
    url.searchParams.set("limit", String(PAGE_LIMIT));
    if (cursor) url.searchParams.set("cursor", cursor);
    const body = (await getJson(url.toString(), ctx)) as ListRecordsPage;
    if (!Array.isArray(body.records)) {
      throw new PdsSchemaError(
        `listRecords for ${collection} returned no records array`,
      );
    }
    for (const r of body.records) {
      out.push({
        uri: r.uri,
        cid: r.cid,
        rkey: r.uri.split("/").pop() ?? "",
        value: r.value,
      });
    }
    if (!body.cursor || body.records.length === 0) return out;
    cursor = body.cursor;
  }
  throw new PdsRequestError(
    `listRecords for ${collection}: more than ${MAX_PAGES} pages`,
  );
}

function validate<S extends z.ZodType>(
  collection: string,
  schema: S,
  records: PdsRecord<unknown>[],
  origin: string,
): PdsRecord<z.output<S>>[] {
  const problems: string[] = [];
  const valid: PdsRecord<z.output<S>>[] = [];
  for (const r of records) {
    const parsed = schema.safeParse(r.value);
    if (parsed.success) {
      valid.push({ ...r, value: parsed.data });
    } else {
      const issues = parsed.error.issues
        .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("; ");
      problems.push(`  ${r.uri}\n    ${issues}`);
    }
  }
  if (problems.length > 0) {
    throw new PdsSchemaError(
      `${problems.length} ${collection} record(s) from ${origin} do not match the schema. ` +
        `Did the lexicon change? Update the schema in src/lib/ to match.\n${problems.join("\n")}`,
    );
  }
  return valid;
}

async function writeCache(file: string, data: CacheFile): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, file);
}

async function readCache(file: string): Promise<CacheFile | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as CacheFile;
  } catch {
    return null;
  }
}

async function recordFallback(
  dir: string,
  entry: { collection: string; fetchedAt: string; reason: string },
): Promise<void> {
  const file = path.join(dir, "fallbacks.json");
  let list: unknown[] = [];
  try {
    list = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    // first fallback in this build
  }
  list.push(entry);
  await fs.writeFile(file, JSON.stringify(list, null, 2));
}

function warnLoudly(collection: string, fetchedAt: string, reason: string) {
  const line = "!".repeat(72);
  console.warn(
    `\n${line}\n` +
      `PDS UNREACHABLE: ${collection} is built from cached data fetched ${fetchedAt}.\n` +
      `Reason: ${reason}\n` +
      `The page shows the last good copy. Rebuild once the PDS is back.\n` +
      `${line}\n`,
  );
  if (process.env.GITHUB_ACTIONS) {
    console.log(
      `::warning title=PDS unreachable::${collection} built from cache (${fetchedAt}): ${reason}`,
    );
  }
}

const inFlight = new Map<string, Promise<LoadResult<unknown>>>();

/**
 * Load every record of one collection, validated against `schema`.
 * Calls for the same DID + collection share one fetch per build.
 */
export function loadCollection<S extends z.ZodType>(
  opts: LoadOptions<S>,
): Promise<LoadResult<z.output<S>>> {
  const did = opts.did ?? GUIDO_DID;
  const cacheDir = opts.cacheDir ?? defaultCacheDir();
  const key = `${cacheDir}|${did}|${opts.collection}`;
  let p = inFlight.get(key);
  if (!p) {
    p = load({ ...opts, did, cacheDir });
    p.catch(() => inFlight.delete(key));
    inFlight.set(key, p);
  }
  return p as Promise<LoadResult<z.output<S>>>;
}

async function load<S extends z.ZodType>(
  opts: LoadOptions<S> & { did: string; cacheDir: string },
): Promise<LoadResult<z.output<S>>> {
  const { did, cacheDir, collection, schema } = opts;
  const ctx: Ctx = {
    fetchImpl: opts.fetchImpl ?? fetch,
    attempts: opts.attempts ?? 3,
    retryDelayMs: opts.retryDelayMs ?? 2000,
    timeoutMs: opts.timeoutMs ?? 15000,
  };
  const file = cacheFileFor(cacheDir, did, collection);

  let raw: PdsRecord<unknown>[];
  try {
    raw = await fetchAll(did, collection, ctx);
  } catch (err) {
    if (!(err instanceof PdsOutageError)) throw err;
    const cached = await readCache(file);
    if (!cached) {
      throw new Error(
        `PDS unreachable for ${collection} and no cached copy in ${cacheDir}: ${err.message}`,
      );
    }
    // The schema may have changed since the cache was written: validate again.
    const records = validate(collection, schema, cached.records, "the cache");
    warnLoudly(collection, cached.fetchedAt, err.message);
    await recordFallback(cacheDir, {
      collection,
      fetchedAt: cached.fetchedAt,
      reason: err.message,
    });
    return { records, source: "cache", fetchedAt: cached.fetchedAt };
  }

  const records = validate(collection, schema, raw, "the PDS");
  const fetchedAt = new Date().toISOString();
  await writeCache(file, { did, collection, fetchedAt, records: raw });
  return { records, source: "live", fetchedAt };
}

/** Test hook: forget memoized DID and collection lookups. */
export function resetPdsLoaderForTests(): void {
  pdsByDid.clear();
  inFlight.clear();
}
