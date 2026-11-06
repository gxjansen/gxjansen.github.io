#!/usr/bin/env node
// Fingerprints of the PDS collections that pages load at build time
// (src/lib/pds/loader.ts: /verify, /domains). The daily events-snapshot
// workflow runs this next to snapshot-events.mjs; when a fingerprint changes,
// its data-only PR carries the new src/data/pds-fingerprints.json, and the
// merge deploys the site. No change, no PR, no build.
//
// A fingerprint is a SHA-256 over the sorted "uri cid" pairs of a collection,
// so any created, edited or deleted record changes it. The collections are the
// keys of the JSON file itself; a unit test checks the loader's collections
// are all in it. Any fetch error exits non-zero and leaves the file untouched.

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const DID = "did:plc:45uheisi25szrjvjurfpritx";
const FILE = new URL("../src/data/pds-fingerprints.json", import.meta.url);

async function getJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function pdsFor(did) {
  const doc = await getJson(`https://plc.directory/${did}`);
  const svc = doc.service?.find((s) => s.id === "#atproto_pds");
  if (!svc?.serviceEndpoint) throw new Error(`no PDS for ${did}`);
  return svc.serviceEndpoint.replace(/\/$/, "");
}

async function fingerprint(pds, collection) {
  const pairs = [];
  let cursor;
  for (let page = 0; page < 50; page++) {
    const url = new URL(`${pds}/xrpc/com.atproto.repo.listRecords`);
    url.searchParams.set("repo", DID);
    url.searchParams.set("collection", collection);
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("cursor", cursor);
    const body = await getJson(url);
    for (const r of body.records ?? []) pairs.push(`${r.uri} ${r.cid}`);
    if (!body.cursor || !body.records?.length) {
      pairs.sort();
      return {
        records: pairs.length,
        sha256: createHash("sha256").update(pairs.join("\n")).digest("hex"),
      };
    }
    cursor = body.cursor;
  }
  throw new Error(`${collection}: more than 50 pages`);
}

const current = JSON.parse(await readFile(FILE, "utf8"));
const pds = await pdsFor(DID);
const next = {};
for (const collection of Object.keys(current).sort()) {
  next[collection] = await fingerprint(pds, collection);
}
await writeFile(FILE, JSON.stringify(next, null, 2) + "\n");
for (const [c, f] of Object.entries(next)) {
  const changed = current[c]?.sha256 !== f.sha256 ? " (changed)" : "";
  console.log(`${c}: ${f.records} records${changed}`);
}
