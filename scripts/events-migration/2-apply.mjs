// Step 2: execute plan.json exactly. Idempotent and resumable:
//  - every op checks the live record first (already applied -> skip),
//  - updates/deletes use swapRecord against the cid the plan was built from,
//  - a ledger line is appended after every write; a rerun skips ledgered ops,
//  - conflicts (record changed since the backup) are skipped and reported.
//
// Usage: node 2-apply.mjs [--only <rkey>] [--collection <nsid>] [--limit <n>] [--per-hour <n>]
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { DID, OUT_DIR, resolvePds, getJson, readJson, appendFileSync, existsSync, Session } from './lib.mjs';

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const only = opt('only');
const collectionFilter = opt('collection');
const limit = Number(opt('limit') ?? Infinity);
const perHour = Number(opt('per-hour') ?? 550);
const gapMs = Math.ceil(3600000 / perHour);

const plan = readJson(join(OUT_DIR, 'plan.json'));
const ledgerPath = join(OUT_DIR, 'ledger.jsonl');
const done = new Set();
if (existsSync(ledgerPath))
  for (const line of readFileSync(ledgerPath, 'utf-8').split('\n').filter(Boolean)) {
    const l = JSON.parse(line);
    if (l.result !== 'conflict') done.add(`${l.op} ${l.collection} ${l.rkey}`);
  }

const canon = (v) =>
  JSON.stringify(v, (_, x) =>
    x && typeof x === 'object' && !Array.isArray(x)
      ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b)))
      : x,
  );

const pds = await resolvePds();
const session = new Session(pds);
await session.login();

async function current(collection, rkey) {
  const u = `${pds}/xrpc/com.atproto.repo.getRecord?repo=${DID}&collection=${collection}&rkey=${rkey}`;
  const { status, body } = await getJson(u);
  if (status === 200) return body;
  if (status === 400 && /RecordNotFound|Could not locate/.test(JSON.stringify(body))) return null;
  throw new Error(`getRecord ${collection}/${rkey}: ${status} ${JSON.stringify(body)}`);
}
function ledger(entry) {
  appendFileSync(ledgerPath, JSON.stringify({ ...entry, at: new Date().toISOString() }) + '\n');
}

let writes = 0;
const conflicts = [];
for (const o of plan.ops) {
  if (only && o.rkey !== only) continue;
  if (collectionFilter && o.collection !== collectionFilter) continue;
  const key = `${o.op} ${o.collection} ${o.rkey}`;
  if (done.has(key)) continue;
  if (writes >= limit) break;

  const cur = await current(o.collection, o.rkey);
  const base = { op: o.op, collection: o.collection, rkey: o.rkey };
  let res;

  if (o.op === 'create') {
    if (cur) {
      if (canon(cur.value) === canon(o.after)) {
        ledger({ ...base, result: 'already', uri: cur.uri, cid: cur.cid });
        continue;
      }
      conflicts.push(`${key}: exists with different content`);
      ledger({ ...base, result: 'conflict', reason: 'exists-different' });
      continue;
    }
    res = await session.call('com.atproto.repo.createRecord', {
      repo: DID,
      collection: o.collection,
      rkey: o.rkey,
      record: o.after,
    });
  } else if (o.op === 'update') {
    if (!cur) {
      conflicts.push(`${key}: record gone`);
      ledger({ ...base, result: 'conflict', reason: 'missing' });
      continue;
    }
    if (canon(cur.value) === canon(o.after)) {
      ledger({ ...base, result: 'already', uri: cur.uri, cid: cur.cid });
      continue;
    }
    if (cur.cid !== o.swapCid) {
      conflicts.push(`${key}: changed since backup (${o.swapCid} -> ${cur.cid})`);
      ledger({ ...base, result: 'conflict', reason: 'cid-changed', cid: cur.cid });
      continue;
    }
    res = await session.call('com.atproto.repo.putRecord', {
      repo: DID,
      collection: o.collection,
      rkey: o.rkey,
      record: o.after,
      swapRecord: o.swapCid,
    });
  } else if (o.op === 'delete') {
    if (!cur) {
      ledger({ ...base, result: 'already' });
      continue;
    }
    if (cur.cid !== o.swapCid) {
      conflicts.push(`${key}: changed since backup`);
      ledger({ ...base, result: 'conflict', reason: 'cid-changed', cid: cur.cid });
      continue;
    }
    res = await session.call('com.atproto.repo.deleteRecord', {
      repo: DID,
      collection: o.collection,
      rkey: o.rkey,
      swapRecord: o.swapCid,
    });
  }

  if (res.status !== 200) {
    ledger({ ...base, result: 'error', status: res.status, body: res.body });
    throw new Error(`${key}: ${res.status} ${JSON.stringify(res.body)}`);
  }
  ledger({ ...base, result: 'written', uri: res.body.uri, cid: res.body.cid, previousCid: o.swapCid });
  writes++;
  if (writes % 25 === 0) console.log(`${writes} writes`);
  await new Promise((r) => setTimeout(r, gapMs));
}

console.log(`done: ${writes} writes, ${conflicts.length} conflicts`);
for (const c of conflicts) console.log(`  CONFLICT ${c}`);
