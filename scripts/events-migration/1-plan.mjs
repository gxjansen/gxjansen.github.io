// Step 1 (dry run): build a frozen write plan from src/data/events.json and the
// step-0 backup. No network writes. Output: plan.json (one entry per operation,
// with full before/after values) and review.md (everything worth a human look).
//
// Usage: node 1-plan.mjs <backup-dir>
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Lexicons } from '@atproto/lexicon';
import { DID, OUT_DIR, readJson, writeJson } from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..');
const backupDir = process.argv[2];
if (!backupDir) throw new Error('usage: node 1-plan.mjs <backup-dir>');
const backup = readJson(join(backupDir, 'records.json')).collections;
const events = readJson(join(REPO, 'src/data/__tests__/fixtures/events-2026-09-30.json'));

const C = {
  delivery: 'id.sifa.profile.presentationDelivery',
  presentation: 'id.sifa.profile.presentation',
  project: 'id.sifa.profile.project',
  position: 'id.sifa.profile.position',
  event: 'community.lexicon.calendar.event',
};
const T = (name) => `id.sifa.defs#${name}`;
const EVT = (name) => `community.lexicon.calendar.event#${name}`;
const rkeyOf = (uri) => uri.split('/').pop();
const byRkey = (coll) => new Map(backup[coll].map((r) => [rkeyOf(r.uri), r]));
const deliveries = byRkey(C.delivery);
const presentations = byRkey(C.presentation);
const projects = byRkey(C.project);
const positions = byRkey(C.position);

// ---------------------------------------------------------------------------
// Lexicon validation (the PDS does not validate community.* records).
// ---------------------------------------------------------------------------
const lex = new Lexicons();
function addDir(dir) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) addDir(p);
    else if (ent.name.endsWith('.json')) lex.add(JSON.parse(readFileSync(p, 'utf-8')));
  }
}
addDir(join(HERE, 'lexicons'));
addDir(join(process.env.HOME, 'Documents/Git/sifa-lexicons/lexicons/id/sifa'));

// ---------------------------------------------------------------------------
// Deterministic TIDs: event-date microseconds + a per-kind clock id, so a
// rerun produces identical rkeys and creates are idempotent.
// ---------------------------------------------------------------------------
const B32 = '234567abcdefghijklmnopqrstuvwxyz';
const usedTids = new Set();
function tid(dateStr, kind) {
  const clock = { event: 1, delivery: 2, project: 3 }[kind];
  let micros = BigInt(Date.parse(`${dateStr.slice(0, 10)}T12:00:00Z`)) * 1000n;
  for (;;) {
    let n = (micros << 10n) | BigInt(clock);
    let s = '';
    for (let i = 0; i < 13; i++) {
      s = B32[Number(n & 31n)] + s;
      n >>= 5n;
    }
    if (!usedTids.has(s)) {
      usedTids.add(s);
      return s;
    }
    micros += 1n;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const noonUtc = (date) => `${date.slice(0, 10)}T12:00:00.000Z`;
const isOnline = (city) => /online|virtual/i.test(city ?? '');
function stripUtm(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    for (const k of [...u.searchParams.keys()]) if (k.startsWith('utm_')) u.searchParams.delete(k);
    return u.toString();
  } catch {
    return url;
  }
}
const norm = (s) =>
  (s ?? '')
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/\b(19|20)\d\d\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
function sim(a, b) {
  const A = new Set(norm(a).split(' ').filter(Boolean));
  const B = new Set(norm(b).split(' ').filter(Boolean));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / Math.min(A.size, B.size);
}
function talkTitle(v) {
  if (v.presentationRef?.uri) {
    const p = presentations.get(rkeyOf(v.presentationRef.uri));
    if (p?.value?.title) return p.value.title.trim();
  }
  return (v.title ?? '').trim();
}

// ---------------------------------------------------------------------------
// Decisions (Guido, 2026-09-30) — explicit lists, not rules.
// ---------------------------------------------------------------------------
const DELETE_DELIVERIES = {
  '3mpyt5nn2sv2p': 'Joomladays 2014-03-23 sparse duplicate of 3mqzj6wrye22b',
  '3mpyt5nmh7w2p': 'Meet Magento UK 2019-06-19 sparse duplicate of 3mqzjfkbtnc2b',
  '3mqx7edisq22y':
    'Meet Magento Romania dated 2017-12-10; Romania was 2017-10-17 and the Association talk is at MageTitans 2016-11-12',
};
const DELETE_PROJECTS = {
  '3mq2q4ce4ze2f': 'Joomladays duplicate; 3mhbvthylup25 is kept (correct June 2009 dates)',
};
const EMERCE_DINNER = {
  date: '2022-05-12',
  title: 'Grow Smart or Die Fast: 5 Guidelines to Navigate the Recession',
};
const JOOMLADAYS_2009 = { startsAt: '2009-06-12', endsAt: '2009-06-13' };
const CITY_FIX = { 'n.t.b.': 'Amsterdam' };
const NAME_FIX = [[/Champaigne/g, 'Champagne']];
const COUNTRY_FIX_BY_EVENT = { 'D-Congress': 'SE', 'Space Academy': 'GB' };

const SERIES = {
  'mm-nl': { existing: '3mhbvthykvd25' },
  crocafe: {
    existing: '3mq2q4ce4zi2f',
    appendDescription:
      ' Also organized two CRO.CAFE Unconferences (Rotterdam and Utrecht, 2019).',
  },
  orocrm: { existing: '3mq2q4ce4zf2f' },
  joomladays: { existing: '3mhbvthylup25' },
  mu: { existing: '3mq2q4ce4zh2f' },
  'spryker-ug': {
    name: 'Spryker User Group',
    role: 'Organizer & host',
    description:
      'Organized and hosted the Spryker User Group, online and in person, for the Spryker community.',
    url: 'https://commercequest.space/',
  },
  'spryker-excite': {
    name: 'Spryker EXCITE',
    role: 'Main stage host',
    description: "Hosted the main stage of Spryker's yearly EXCITE conference in Berlin.",
  },
  'spryker-customer-day': {
    name: 'Spryker customer day',
    role: 'Host & moderator',
    description: 'Organized and hosted Spryker customer days in Europe and the US.',
  },
  'spryker-hackathons': {
    name: 'Spryker hackathons',
    role: 'Organizer & host',
    description:
      'Organized and hosted Spryker hackathons, including partner hackathons and the EXCITE hackathons.',
  },
};
const MU_HOSTED = new Set(['magento-unconference-2016-10', 'magento-unconference-2017-08']);

function seriesOf(e) {
  const s = `${e.id} ${e.name} ${e.url}`.toLowerCase();
  if (/spryker|nagarro|turbine/.test(s)) {
    if (e.id.includes('user-group') || /user group/i.test(e.name)) return 'spryker-ug';
    if (s.includes('hackathon')) return 'spryker-hackathons';
    if (s.includes('excite')) return 'spryker-excite';
    if (s.includes('customer')) return 'spryker-customer-day';
    throw new Error(`unclassified Spryker entry ${e.id}`);
  }
  if (MU_HOSTED.has(e.id)) return 'mu';
  if (/rganizer/.test(e.role)) {
    if (/meet magento/i.test(e.name)) return 'mm-nl';
    if (s.includes('cro.cafe')) return 'crocafe';
    if (s.includes('orocrm')) return 'orocrm';
    if (s.includes('joomla')) return 'joomladays';
    throw new Error(`unclassified organizer entry ${e.id}`);
  }
  return null;
}

// events.json role -> delivery role token (only used when the delivery has
// no known token yet, or for new deliveries).
function roleToken(e) {
  if (e.workshop) return T('workshop');
  const r = e.role.toLowerCase();
  if (/panel/.test(r)) return T('panelist');
  if (/keynote/.test(r)) return T('keynote');
  if (/speaker|session|talk/.test(r) && !/host|moderat/.test(r)) return T('presenter');
  if (/host|moderat|podcast|mc\b|co-hosting|advisor/.test(r)) return T('host');
  return T('presenter');
}
// The Sifa editor requires a title ("What you presented"); fall back to what the
// session was when events.json has no topic.
function newDeliveryTitle(e) {
  if (e.topic) return e.topic;
  if (/podcast|livestream/i.test(e.role)) return 'Podcast livestream';
  if (/session/i.test(e.role)) return e.role;
  return e.name;
}
const KNOWN_ROLES = new Set(['presenter', 'panelist', 'keynote', 'workshop', 'host'].map(T));
const isPlaceholderTitle = (title, v) =>
  !title ||
  norm(title) === norm(v.eventName) ||
  (/ host$/i.test(title) && norm(title.replace(/ host$/i, '')) === norm(v.eventName));

// ---------------------------------------------------------------------------
// Pass 1: clean events.json entries (fixes applied), classify.
// ---------------------------------------------------------------------------
const review = [];
const entries = events.map((raw, index) => {
  const e = { ...raw, index };
  e.date = e.date.slice(0, 10);
  if (CITY_FIX[e.city]) e.city = CITY_FIX[e.city];
  for (const [re, to] of NAME_FIX) e.name = e.name.replace(re, to);
  e.url = stripUtm(e.url);
  e.topic = (e.topic ?? '').trim();
  e.series = seriesOf(e);
  if (e.series === 'joomladays') e.date = JOOMLADAYS_2009.startsAt;
  return e;
});

// ---------------------------------------------------------------------------
// Pass 2: match events.json entries to existing deliveries, 1:1 per date.
// ---------------------------------------------------------------------------
const live = [...deliveries.values()].filter((r) => !DELETE_DELIVERIES[rkeyOf(r.uri)]);
const delByDate = new Map();
for (const r of live) {
  const d = (r.value.date ?? '').slice(0, 10);
  if (!delByDate.has(d)) delByDate.set(d, []);
  delByDate.get(d).push(r);
}
// Joomladays 2009's delivery (if any) keeps its own date; match on the original date too.
const matchDate = (e) => (e.series === 'joomladays' ? events[e.index].date.slice(0, 10) : e.date);

const matchOf = new Map(); // entry index -> delivery rkey
const matchedRkeys = new Set();
const byDate = new Map();
for (const e of entries) {
  const d = matchDate(e);
  if (!byDate.has(d)) byDate.set(d, []);
  byDate.get(d).push(e);
}
for (const [date, es] of byDate) {
  const cands = delByDate.get(date) ?? [];
  const pairs = [];
  for (const e of es)
    for (const r of cands) {
      const v = r.value;
      let score = sim(e.name, v.eventName);
      if (e.topic && talkTitle(v)) score += sim(e.topic, talkTitle(v)) * 0.5;
      pairs.push({ e, r, score });
    }
  pairs.sort((a, b) => b.score - a.score);
  for (const { e, r, score } of pairs) {
    const rk = rkeyOf(r.uri);
    if (matchOf.has(e.index) || matchedRkeys.has(rk)) continue;
    if (score < 0.34 && !(es.length === 1 && cands.length === 1)) continue;
    matchOf.set(e.index, rk);
    matchedRkeys.add(rk);
    if (score < 0.6)
      review.push(
        `- Low-confidence match (${score.toFixed(2)}): events.json \`${e.id}\` "${e.name}" / "${e.topic}" ↔ delivery ${rk} "${r.value.eventName}" / "${talkTitle(r.value)}"`,
      );
  }
}
const unmatchedDeliveries = live.filter((r) => !matchedRkeys.has(rkeyOf(r.uri)));

// ---------------------------------------------------------------------------
// Pass 3: build records.
// ---------------------------------------------------------------------------
const ops = [];
const now = new Date().toISOString();
function validate(collection, value, label) {
  try {
    lex.assertValidRecord(collection, value);
  } catch (err) {
    throw new Error(`invalid ${collection} (${label}): ${err.message}\n${JSON.stringify(value)}`);
  }
}
const uriFor = (collection, rkey) => `at://${DID}/${collection}/${rkey}`;

// calendar.event per hosted entry (+ EXCITE 2024, which only exists as a delivery).
const hosted = entries.filter((e) => e.series);
const eventUriByIndex = new Map();
function buildEvent({ name, date, endDate, city, country, url, description }) {
  const online = isOnline(city);
  const v = {
    $type: C.event,
    name,
    startsAt: noonUtc(date),
    ...(endDate ? { endsAt: noonUtc(endDate) } : {}),
    mode: online ? EVT('virtual') : EVT('inperson'),
    status: EVT('scheduled'),
    ...(!online && country
      ? {
          locations: [
            {
              $type: 'community.lexicon.location.address',
              country,
              ...(city ? { locality: city } : {}),
            },
          ],
        }
      : {}),
    ...(url ? { uris: [{ uri: url, name: 'Event website' }] } : {}),
    ...(description ? { description } : {}),
    rsvpExpected: false,
    createdAt: noonUtc(date),
  };
  return v;
}
for (const e of hosted) {
  const rkey = tid(e.date, 'event');
  const isExcite2025Theme = e.id === 'spryker-excite-2025-09';
  const value = buildEvent({
    name: e.name,
    date: e.date,
    endDate: e.series === 'joomladays' ? JOOMLADAYS_2009.endsAt : undefined,
    city: e.city,
    country: e.country,
    url: e.url,
    description: e.topic || undefined,
  });
  validate(C.event, value, e.id);
  ops.push({ op: 'create', collection: C.event, rkey, after: value, source: e.id, isExcite2025Theme });
  eventUriByIndex.set(e.index, uriFor(C.event, rkey));
}
// EXCITE 2024-09-12: hosted, present only as a delivery.
const excite2024 = unmatchedDeliveries.find(
  (r) => (r.value.date ?? '').startsWith('2024-09-12') && /excite/i.test(r.value.eventName ?? ''),
);
let excite2024Uri;
if (excite2024) {
  const v = excite2024.value;
  const rkey = tid('2024-09-12', 'event');
  const value = buildEvent({
    name: v.eventName,
    date: '2024-09-12',
    city: v.address?.locality ?? 'Berlin',
    country: v.address?.country ?? 'DE',
    url: '',
  });
  validate(C.event, value, 'excite-2024');
  ops.push({ op: 'create', collection: C.event, rkey, after: value, source: 'delivery ' + rkeyOf(excite2024.uri) });
  excite2024Uri = uriFor(C.event, rkey);
} else review.push('- EXCITE 2024-09-12 delivery not found; no event created for it.');

// Projects
const seriesEntries = new Map();
for (const e of hosted) {
  if (!seriesEntries.has(e.series)) seriesEntries.set(e.series, []);
  seriesEntries.get(e.series).push(e);
}
const projectEvent = (uri, role) => ({
  event: { uri },
  ...(role && !/^speaker$/i.test(role) ? { role } : {}),
});
function positionFor(firstDate) {
  const director = positions.get('3mhbvthyfw325');
  const senior = positions.get('3mhbvthyfw225');
  const pick = firstDate.slice(0, 7) < '2023-11' ? director : senior;
  return { uri: pick.uri, cid: pick.cid };
}
for (const [series, cfg] of Object.entries(SERIES)) {
  const es = (seriesEntries.get(series) ?? []).sort((a, b) => a.date.localeCompare(b.date));
  const linked = es.map((e) => projectEvent(eventUriByIndex.get(e.index), e.role));
  if (series === 'spryker-excite' && excite2024Uri) linked.push(projectEvent(excite2024Uri, 'Mainstage event host'));
  if (!linked.length) continue;
  if (cfg.existing) {
    const rec = projects.get(cfg.existing);
    if (!rec) throw new Error(`project ${cfg.existing} missing`);
    const before = rec.value;
    const existing = before.events ?? [];
    const seen = new Set(existing.map((x) => x.event.uri));
    const merged = [...existing, ...linked.filter((x) => !seen.has(x.event.uri))];
    merged.sort((a, b) => a.event.uri.localeCompare(b.event.uri));
    const after = {
      ...before,
      events: merged,
      ...(before.role ? {} : { role: 'Organizer' }),
      ...(cfg.appendDescription && !(before.description ?? '').includes('Unconference')
        ? { description: (before.description ?? '').trimEnd() + cfg.appendDescription }
        : {}),
    };
    validate(C.project, after, series);
    ops.push({ op: 'update', collection: C.project, rkey: cfg.existing, swapCid: rec.cid, before, after, source: series });
  } else {
    const first = es[0]?.date ?? '2024-09-12';
    const last = es.at(-1)?.date ?? first;
    const rkey = tid(first, 'project');
    const after = {
      $type: C.project,
      name: cfg.name,
      role: cfg.role,
      description: cfg.description,
      ...(cfg.url ? { url: cfg.url } : {}),
      position: positionFor(first),
      startedAt: first.slice(0, 7),
      endedAt: last.slice(0, 7),
      events: linked.sort((a, b) => a.event.uri.localeCompare(b.event.uri)),
      createdAt: noonUtc(first),
    };
    validate(C.project, after, series);
    ops.push({ op: 'create', collection: C.project, rkey, after, source: series });
  }
}
for (const [rk, why] of Object.entries(DELETE_PROJECTS)) {
  const rec = projects.get(rk);
  if (rec) ops.push({ op: 'delete', collection: C.project, rkey: rk, swapCid: rec.cid, before: rec.value, reason: why });
}

// events.json index -> record key the site uses (event AT-URI for hosted, else delivery AT-URI).
const mapping = [];
// Deliveries: patch matched, create unmatched non-hosted, eventRef on hosted+delivery.
const placeholderFixes = [];
for (const e of entries) {
  const rk = matchOf.get(e.index);
  const eventUri = eventUriByIndex.get(e.index);
  if (eventUri) mapping.push({ index: e.index, id: events[e.index].id, key: eventUri });
  else if (rk) mapping.push({ index: e.index, id: events[e.index].id, key: uriFor(C.delivery, rk) });
  if (!rk) {
    if (e.series) continue; // project-only hosted entry
    const online = isOnline(e.city);
    const rkey = tid(e.date, 'delivery');
    const after = {
      $type: C.delivery,
      title: newDeliveryTitle(e),
      eventName: e.name,
      date: e.date,
      role: roleToken(e),
      ...(e.city ? { location: online ? e.city : [e.city, e.country].filter(Boolean).join(', ') } : {}),
      ...(!online && e.country ? { address: { country: e.country, ...(e.city ? { locality: e.city } : {}) } } : {}),
      mode: online ? EVT('virtual') : EVT('inperson'),
      ...(e.url ? { links: [{ uri: e.url, type: T('linkEvent') }] } : {}),
      createdAt: noonUtc(e.date),
    };
    validate(C.delivery, after, e.id);
    ops.push({ op: 'create', collection: C.delivery, rkey, after, source: e.id });
    mapping.push({ index: e.index, id: events[e.index].id, key: uriFor(C.delivery, rkey) });
    continue;
  }
  const rec = deliveries.get(rk);
  const before = rec.value;
  const after = { ...before };
  // role
  if (e.workshop && after.role !== T('workshop')) after.role = T('workshop');
  else if (!KNOWN_ROLES.has(after.role)) after.role = roleToken(e);
  // online mode
  const online = isOnline(e.city);
  if (online && after.mode !== EVT('virtual')) after.mode = EVT('virtual');
  // address / country
  const fixCountry = COUNTRY_FIX_BY_EVENT[before.eventName];
  if (after.address && !after.address.country && (fixCountry || e.country)) {
    after.address = { ...after.address, country: fixCountry || e.country };
  } else if (!after.address && !online && e.country) {
    after.address = { country: e.country, ...(e.city ? { locality: e.city } : {}) };
  }
  // event link
  const links = [...(before.links ?? [])];
  if (e.url && !links.some((l) => l.type === T('linkEvent'))) {
    links.push({ uri: e.url, type: T('linkEvent') });
    after.links = links;
  }
  // Emerce dinner: the linked talk was a copy-paste slip.
  if (e.date === EMERCE_DINNER.date && /dinner/i.test(e.name)) {
    delete after.presentationRef;
    after.title = EMERCE_DINNER.title;
  }
  // A linked talk whose title is only a placeholder (e.g. "Spryker customer day",
  // shared by several deliveries): unlink this delivery and give it the real
  // topic, rather than renaming the shared talk.
  if (after.presentationRef && e.topic && e.id !== 'spryker-excite-2025-09' && isPlaceholderTitle(talkTitle(after), after)) {
    placeholderFixes.push(`- ${rk} ${e.date} linked talk "${talkTitle(after)}" → own title "${e.topic}" (unlinked)`);
    delete after.presentationRef;
    after.title = e.topic;
  }
  // Placeholder titles (standalone deliveries only; a linked talk's title comes from the talk).
  if (!after.presentationRef && e.topic && e.id !== 'spryker-excite-2025-09' && isPlaceholderTitle(after.title, after)) {
    placeholderFixes.push(`- ${rk} ${e.date} "${after.title ?? ''}" → "${e.topic}"`);
    after.title = e.topic;
  }
  // Organize + speak: link the hosted event.
  if (eventUri) after.eventRef = { uri: eventUri };
  if (JSON.stringify(after) === JSON.stringify(before)) continue;
  validate(C.delivery, after, e.id);
  ops.push({ op: 'update', collection: C.delivery, rkey: rk, swapCid: rec.cid, before, after, source: e.id });
}
if (excite2024) {
  const before = excite2024.value;
  const after = { ...before, eventRef: { uri: excite2024Uri } };
  if (after.role && !KNOWN_ROLES.has(after.role)) after.role = T('host');
  validate(C.delivery, after, 'excite-2024');
  ops.push({ op: 'update', collection: C.delivery, rkey: rkeyOf(excite2024.uri), swapCid: excite2024.cid, before, after, source: 'excite-2024' });
}
for (const [rk, why] of Object.entries(DELETE_DELIVERIES)) {
  const rec = deliveries.get(rk);
  if (rec) ops.push({ op: 'delete', collection: C.delivery, rkey: rk, swapCid: rec.cid, before: rec.value, reason: why });
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const ORDER = { [C.event]: 0, [C.project]: 1, [C.delivery]: 2 };
const OP_ORDER = { create: 0, update: 1, delete: 2 };
ops.sort((a, b) => ORDER[a.collection] - ORDER[b.collection] || OP_ORDER[a.op] - OP_ORDER[b.op] || a.rkey.localeCompare(b.rkey));
const plan = { did: DID, backupDir, generatedAt: now, ops };
writeJson(join(OUT_DIR, 'plan.json'), plan);
mapping.sort((x, y) => x.index - y.index);
writeJson(join(OUT_DIR, 'mapping.json'), { excite2024: excite2024Uri ?? null, entries: mapping });

const count = {};
for (const o of ops) count[`${o.op} ${o.collection}`] = (count[`${o.op} ${o.collection}`] ?? 0) + 1;
const leftover = unmatchedDeliveries.filter((r) => r !== excite2024);
const md = [
  '# /events migration: dry-run review',
  '',
  `Generated ${now} from ${backupDir}. Plan: \`plan.json\` (${ops.length} operations).`,
  '',
  '## Operation counts',
  '',
  ...Object.entries(count).map(([k, v]) => `- ${k}: ${v}`),
  '',
  '## Deliveries not in events.json (kept, will render on /events)',
  '',
  ...(leftover.length ? leftover.map((r) => `- ${rkeyOf(r.uri)} ${r.value.date} ${r.value.eventName} / "${talkTitle(r.value)}" (${r.value.role ?? 'no role'})`) : ['- none']),
  '',
  '## Placeholder titles replaced by the events.json topic',
  '',
  ...(placeholderFixes.length ? placeholderFixes : ['- none']),
  '',
  '## Low-confidence matches and other notes',
  '',
  ...(review.length ? review : ['- none']),
  '',
  '## Deletions',
  '',
  ...ops.filter((o) => o.op === 'delete').map((o) => `- ${o.collection} ${o.rkey}: ${o.reason}`),
  '',
];
writeFileSync(join(OUT_DIR, 'review.md'), md.join('\n'));
console.log(md.slice(0, 12).join('\n'));
