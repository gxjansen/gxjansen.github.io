#!/usr/bin/env node
// Refresh src/data/events.snapshot.json from Guido's atproto records.
//
// The site never fetches at build or request time: this script is the only
// network step, run by the scheduled "events snapshot" workflow, which opens a
// PR with the result. The committed snapshot is the build input and an owned,
// versioned copy of the data.
//
// Scope rule: only records where Guido had a role. Deliveries (talks, hosted
// sessions) and projects (organized events) are listed; a calendar event is
// fetched only when a delivery's eventRef or a project's events[] points at it.
// RSVPs are never read and the calendar-event collection is never listed.
//
// Fails closed: any unresolvable reference, a shrinking record count or a
// fetch error exits non-zero and leaves the snapshot untouched.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DID = "did:plc:45uheisi25szrjvjurfpritx";
const EVENT_COLLECTION = "community.lexicon.calendar.event";
const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src/data/events.snapshot.json",
);

const pdsCache = new Map();
async function resolvePds(did) {
  if (pdsCache.has(did)) return pdsCache.get(did);
  const url = did.startsWith("did:web:")
    ? `https://${did.slice(8)}/.well-known/did.json`
    : `https://plc.directory/${did}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`resolve ${did}: ${res.status}`);
  const doc = await res.json();
  const svc = doc.service?.find((s) => s.id === "#atproto_pds" || s.id.endsWith("#atproto_pds"));
  if (!svc) throw new Error(`no PDS for ${did}`);
  pdsCache.set(did, svc.serviceEndpoint);
  return svc.serviceEndpoint;
}

// Record JSON can carry raw control characters; parse leniently.
async function getJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`${url}: ${res.status} ${text.slice(0, 200)}`);
  try {
    return JSON.parse(text);
  } catch {
    return JSON.parse(text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, " "));
  }
}

async function listAll(did, collection) {
  const pds = await resolvePds(did);
  const out = [];
  let cursor;
  do {
    const u = new URL(`${pds}/xrpc/com.atproto.repo.listRecords`);
    u.searchParams.set("repo", did);
    u.searchParams.set("collection", collection);
    u.searchParams.set("limit", "100");
    if (cursor) u.searchParams.set("cursor", cursor);
    const body = await getJson(u);
    out.push(...body.records);
    cursor = body.records.length ? body.cursor : undefined;
  } while (cursor);
  return out;
}

async function getRecord(uri) {
  const [, , did, collection, rkey] = uri.split("/");
  if (collection !== EVENT_COLLECTION) return null;
  const pds = await resolvePds(did);
  return getJson(
    `${pds}/xrpc/com.atproto.repo.getRecord?repo=${did}&collection=${collection}&rkey=${rkey}`,
  );
}

const slim = (records) =>
  records
    .map((r) => ({ uri: r.uri, value: r.value }))
    .sort((a, b) => a.uri.localeCompare(b.uri));

const deliveries = await listAll(DID, "id.sifa.profile.presentationDelivery");
const projects = await listAll(DID, "id.sifa.profile.project");
const presentations = await listAll(DID, "id.sifa.profile.presentation");

const eventUris = new Set();
for (const d of deliveries) if (d.value.eventRef?.uri) eventUris.add(d.value.eventRef.uri);
for (const p of projects)
  for (const pe of p.value.events ?? []) if (pe?.event?.uri) eventUris.add(pe.event.uri);

const events = [];
const unresolved = [];
for (const uri of [...eventUris].sort()) {
  if (uri.split("/")[3] !== EVENT_COLLECTION) continue; // ignore non-event refs
  try {
    const rec = await getRecord(uri);
    events.push({ uri, value: rec.value });
  } catch (err) {
    unresolved.push(`${uri}: ${err.message}`);
  }
}
if (unresolved.length) {
  console.error(`Unresolvable event references:\n${unresolved.join("\n")}`);
  process.exit(1);
}

const snapshot = {
  did: DID,
  deliveries: slim(deliveries),
  projects: slim(projects),
  presentations: slim(presentations),
  events: slim(events),
};

if (existsSync(OUT) && !process.argv.includes("--allow-shrink")) {
  const prev = JSON.parse(readFileSync(OUT, "utf-8"));
  for (const k of ["deliveries", "projects", "events"]) {
    if (snapshot[k].length < prev[k].length) {
      console.error(
        `${k} shrank from ${prev[k].length} to ${snapshot[k].length}; refusing (pass --allow-shrink after checking).`,
      );
      process.exit(1);
    }
  }
}

writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + "\n");
console.log(
  `snapshot: ${snapshot.deliveries.length} deliveries, ${snapshot.projects.length} projects, ${snapshot.events.length} events, ${snapshot.presentations.length} presentations`,
);
