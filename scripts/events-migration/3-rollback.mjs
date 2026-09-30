// Rollback: undo every "written" ledger entry in reverse order, restoring the
// before-values from plan.json. Creates are deleted, updates restored, deletes
// re-created at their original rkey.
//
// Usage: node 3-rollback.mjs [--dry-run]
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { DID, OUT_DIR, resolvePds, readJson, appendFileSync, Session } from './lib.mjs';

const dryRun = process.argv.includes('--dry-run');
const plan = readJson(join(OUT_DIR, 'plan.json'));
const byKey = new Map(plan.ops.map((o) => [`${o.op} ${o.collection} ${o.rkey}`, o]));
const ledger = readFileSync(join(OUT_DIR, 'ledger.jsonl'), 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l))
  .filter((l) => l.result === 'written');

const pds = await resolvePds();
const session = new Session(pds);
if (!dryRun) await session.login();
const log = join(OUT_DIR, 'rollback.jsonl');

for (const l of ledger.reverse()) {
  const o = byKey.get(`${l.op} ${l.collection} ${l.rkey}`);
  let nsid, payload;
  if (l.op === 'create') {
    nsid = 'com.atproto.repo.deleteRecord';
    payload = { repo: DID, collection: l.collection, rkey: l.rkey };
  } else if (l.op === 'update') {
    nsid = 'com.atproto.repo.putRecord';
    payload = { repo: DID, collection: l.collection, rkey: l.rkey, record: o.before };
  } else {
    nsid = 'com.atproto.repo.createRecord';
    payload = { repo: DID, collection: l.collection, rkey: l.rkey, record: o.before };
  }
  if (dryRun) {
    console.log(`would ${nsid.split('.').pop()} ${l.collection} ${l.rkey}`);
    continue;
  }
  const res = await session.call(nsid, payload);
  appendFileSync(log, JSON.stringify({ ...l, undo: nsid, status: res.status, at: new Date().toISOString() }) + '\n');
  if (res.status !== 200) throw new Error(`${nsid} ${l.rkey}: ${res.status} ${JSON.stringify(res.body)}`);
  await new Promise((r) => setTimeout(r, 6500));
}
console.log(dryRun ? 'dry run complete' : 'rollback complete');
