// Step 0: CAR export + listRecords dump of every collection the migration touches.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { DID, OUT_DIR, resolvePds, listAll, writeJson } from './lib.mjs';

const COLLECTIONS = [
  'id.sifa.profile.presentationDelivery',
  'id.sifa.profile.presentation',
  'id.sifa.profile.project',
  'id.sifa.profile.position',
  'id.sifa.profile.involvement',
  'community.lexicon.calendar.event',
];
const stamp = process.argv[2] ?? new Date().toISOString().replace(/[:.]/g, '-');
const dir = join(OUT_DIR, `backup-${stamp}`);
mkdirSync(dir, { recursive: true });
const pds = await resolvePds();
const car = await fetch(`${pds}/xrpc/com.atproto.sync.getRepo?did=${DID}`);
if (car.status !== 200) throw new Error(`getRepo ${car.status}`);
writeFileSync(join(dir, 'repo.car'), Buffer.from(await car.arrayBuffer()));
const dump = {};
for (const c of COLLECTIONS) dump[c] = await listAll(pds, c);
writeJson(join(dir, 'records.json'), { did: DID, pds, collections: dump });
console.log(dir);
for (const c of COLLECTIONS) console.log(c, dump[c].length);
