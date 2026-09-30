// Shared helpers for the one-off /events migration. Reads are public; writes
// use a one-off app password session (GUIDO_ATPROTO_APPPASSWORD), revoked after.
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const DID = 'did:plc:45uheisi25szrjvjurfpritx';
export const OUT_DIR = join(homedir(), 'Documents/CoreNotes/Workspaces/brand/events-migration');
mkdirSync(OUT_DIR, { recursive: true });

export async function resolvePds(did = DID) {
  const doc = await (await fetch(`https://plc.directory/${did}`)).json();
  const svc = doc.service.find((s) => s.id === '#atproto_pds');
  return svc.serviceEndpoint;
}

// Record JSON can contain raw control characters; parse leniently.
export async function getJson(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = JSON.parse(text.replace(/[\u0000-\u001f]/g, (c) => (c === '\n' || c === '\t' ? c : ' ')));
  }
  return { status: res.status, headers: res.headers, body };
}

export async function listAll(pds, collection, did = DID) {
  const out = [];
  let cursor;
  do {
    const u = new URL(`${pds}/xrpc/com.atproto.repo.listRecords`);
    u.searchParams.set('repo', did);
    u.searchParams.set('collection', collection);
    u.searchParams.set('limit', '100');
    if (cursor) u.searchParams.set('cursor', cursor);
    const { status, body } = await getJson(u);
    if (status !== 200) throw new Error(`listRecords ${collection}: ${status} ${JSON.stringify(body)}`);
    out.push(...body.records);
    cursor = body.records.length ? body.cursor : undefined;
  } while (cursor);
  return out;
}

export function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf-8'));
}
export function writeJson(p, v) {
  writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
}
export { appendFileSync, existsSync };

// Session with refresh + 429 backoff. Log in once; never re-login in a retry loop.
export class Session {
  constructor(pds) {
    this.pds = pds;
  }
  async login() {
    const pw = process.env.GUIDO_ATPROTO_APPPASSWORD;
    if (!pw) throw new Error('GUIDO_ATPROTO_APPPASSWORD not set');
    const { status, body } = await getJson(`${this.pds}/xrpc/com.atproto.server.createSession`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ identifier: DID, password: pw }),
    });
    if (status !== 200) throw new Error(`login failed: ${status} ${JSON.stringify(body)}`);
    this.access = body.accessJwt;
    this.refresh = body.refreshJwt;
  }
  async refreshSession() {
    const { status, body } = await getJson(`${this.pds}/xrpc/com.atproto.server.refreshSession`, {
      method: 'POST',
      headers: { authorization: `Bearer ${this.refresh}` },
    });
    if (status !== 200) throw new Error(`refresh failed: ${status} ${JSON.stringify(body)}`);
    this.access = body.accessJwt;
    this.refresh = body.refreshJwt;
  }
  async call(nsid, payload, attempt = 0) {
    const { status, headers, body } = await getJson(`${this.pds}/xrpc/${nsid}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${this.access}` },
      body: JSON.stringify(payload),
    });
    if (status === 400 && body?.error === 'ExpiredToken' && attempt < 2) {
      await this.refreshSession();
      return this.call(nsid, payload, attempt + 1);
    }
    if (status === 429 && attempt < 5) {
      const reset = Number(headers.get('ratelimit-reset'));
      const waitMs = reset ? Math.max(1000, reset * 1000 - Date.now()) : 60000 * (attempt + 1);
      console.log(`429, waiting ${Math.round(waitMs / 1000)}s`);
      await new Promise((r) => setTimeout(r, Math.min(waitMs, 3600000)));
      return this.call(nsid, payload, attempt + 1);
    }
    return { status, body };
  }
}
