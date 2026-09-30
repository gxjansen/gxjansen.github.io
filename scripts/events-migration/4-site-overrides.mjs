// Step 4: generate src/data/events-overrides.json, the display fields the
// records can't hold (preserved slug, role wording, logo, presentation links,
// and the few labels that differ from what the records derive).
//
// Usage:
//   node 4-site-overrides.mjs --simulate [--write-snapshot]   # snapshot = backup + plan
//   node 4-site-overrides.mjs              # use the real src/data/events.snapshot.json
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { OUT_DIR, readJson, writeJson } from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..');
const { deriveEvents } = await import(pathToFileURL(join(REPO, 'src/data/eventsDerive.js')));
const events = readJson(join(REPO, 'src/data/__tests__/fixtures/events-2026-09-30.json'));
const plan = readJson(join(OUT_DIR, 'plan.json'));
const mapping = readJson(join(OUT_DIR, 'mapping.json'));

// Deliberate data fixes: compare against the fixed values, not the old ones.
const FIXES = {
  name: [[/Champaigne/g, 'Champagne']],
  city: { 'n.t.b.': 'Amsterdam' },
};

export function simulatedSnapshot() {
  const backup = readJson(join(plan.backupDir, 'records.json')).collections;
  const state = {};
  for (const [coll, recs] of Object.entries(backup))
    state[coll] = new Map(recs.map((r) => [r.uri, r.value]));
  for (const o of plan.ops) {
    const uri = `at://${plan.did}/${o.collection}/${o.rkey}`;
    state[o.collection] ??= new Map();
    if (o.op === 'delete') state[o.collection].delete(uri);
    else state[o.collection].set(uri, o.after);
  }
  const list = (coll) =>
    [...(state[coll] ?? new Map()).entries()]
      .map(([uri, value]) => ({ uri, value }))
      .sort((a, b) => a.uri.localeCompare(b.uri));
  const deliveries = list('id.sifa.profile.presentationDelivery');
  const projects = list('id.sifa.profile.project');
  const refs = new Set();
  for (const d of deliveries) if (d.value.eventRef?.uri) refs.add(d.value.eventRef.uri);
  for (const p of projects) for (const pe of p.value.events ?? []) refs.add(pe.event.uri);
  const events = list('community.lexicon.calendar.event').filter((e) => refs.has(e.uri));
  return { deliveries, projects, presentations: list('id.sifa.profile.presentation'), events };
}

const snapshot = process.argv.includes('--simulate')
  ? simulatedSnapshot()
  : readJson(join(REPO, 'src/data/events.snapshot.json'));
if (process.argv.includes('--write-snapshot'))
  writeJson(join(REPO, 'src/data/events.snapshot.json'), { did: plan.did, ...snapshot });

// Which entry of a duplicated id does /events/[id]/ render today? The last one.
const lastIndexOfId = new Map();
events.forEach((e, i) => lastIndexOfId.set(e.id, i));

// Majority vote: Sifa presentation URI -> local presentation slug, and project -> logo.
const deliveryByUri = new Map(snapshot.deliveries.map((d) => [d.uri, d.value]));
const projectOfEvent = new Map();
for (const p of snapshot.projects)
  for (const pe of p.value.events ?? []) projectOfEvent.set(pe.event.uri, p.uri);
const votes = (m, k, v) => {
  if (!k || !v) return;
  m.set(k, m.get(k) ?? new Map());
  m.get(k).set(v, (m.get(k).get(v) ?? 0) + 1);
};
const winner = (m) =>
  Object.fromEntries(
    [...m.entries()].map(([k, vs]) => [k, [...vs.entries()].sort((a, b) => b[1] - a[1])[0][0]]),
  );
const presVotes = new Map();
const iconVotes = new Map();
for (const { index, key } of mapping.entries) {
  const e = events[index];
  const d = deliveryByUri.get(key);
  if (d?.presentationRef?.uri && e.relatedPresentationSlugs?.length === 1)
    votes(presVotes, d.presentationRef.uri, e.relatedPresentationSlugs[0]);
  votes(iconVotes, projectOfEvent.get(key), e.icon);
}
const presentationSlugs = winner(presVotes);
const projectIcons = winner(iconVotes);

// Derive without per-entry overrides, then record only what differs.
const derived = new Map(
  deriveEvents(snapshot, { byKey: {}, projectIcons, presentationSlugs }).map((e) => [e.key, e]),
);
const byKey = {};
for (const { index, key } of mapping.entries) {
  const e = events[index];
  const d = derived.get(key);
  if (!d) throw new Error(`no derived entry for ${e.id} (${key})`);
  let name = e.name;
  for (const [re, to] of FIXES.name) name = name.replace(re, to);
  const city = FIXES.city[e.city] ?? e.city;
  const id = lastIndexOfId.get(e.id) === index ? e.id : `${e.id}-${e.date.slice(8, 10)}`;
  const o = { id };
  if (e.role !== d.role) o.role = e.role;
  if ((e.icon || undefined) !== d.icon) o.icon = e.icon || null;
  const rel = e.relatedPresentationSlugs ?? [];
  if (JSON.stringify(rel) !== JSON.stringify(d.relatedPresentationSlugs)) o.relatedPresentationSlugs = rel;
  if (name !== d.name) o.name = name;
  if (city !== d.city) o.city = city;
  if ((e.url || '') !== d.url) o.url = e.url || '';
  byKey[key] = o;
}

// EXCITE 2024 only existed as a delivery; give it the same name and slug
// pattern as the other EXCITE editions.
if (mapping.excite2024) byKey[mapping.excite2024] = { id: 'spryker-excite-2024-09', name: 'Spryker EXCITE', role: 'Mainstage event host' };

const out = { presentationSlugs, projectIcons, byKey };
writeJson(join(REPO, 'src/data/events-overrides.json'), out);
const counts = {};
for (const o of Object.values(byKey))
  for (const k of Object.keys(o)) counts[k] = (counts[k] ?? 0) + 1;
console.log('overrides per field:', counts);
console.log('presentation slugs:', Object.keys(presentationSlugs).length, 'project icons:', projectIcons);
