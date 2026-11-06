import { timingSafeEqual } from "node:crypto";
import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import {
  WHERE_KEY,
  WHERE_STORE,
  applyReport,
  parseCountry,
  type WhereState,
} from "../../src/lib/where";

/**
 * Current country for /where.
 *
 * bsky-avatar POSTs `{"country": "be"}` with `Authorization: Bearer
 * <WHERE_TOKEN>` whenever the country it resolved for the avatar changes. The
 * report is folded into the WhereState in Netlify Blobs; the delay before a
 * trip abroad shows publicly is applied on read, in src/lib/where.ts.
 *
 * Env: WHERE_TOKEN.
 */

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function tokenMatches(header: string | null, token: string): boolean {
  const given = Buffer.from(header?.replace(/^Bearer\s+/i, "") ?? "");
  const expected = Buffer.from(token);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const token = process.env.WHERE_TOKEN;
  if (!token) {
    console.error("where: WHERE_TOKEN is not set");
    return json(500, { error: "Server configuration error" });
  }
  if (!tokenMatches(req.headers.get("authorization"), token)) {
    return json(401, { error: "Unauthorized" });
  }

  let country: string | null = null;
  try {
    const body = (await req.json()) as { country?: unknown };
    country = parseCountry(body?.country);
  } catch {
    // Falls through to the 400 below.
  }
  if (!country) {
    return json(400, { error: 'Expected {"country": "<ISO 3166-1 alpha-2>"}' });
  }

  try {
    const store = getStore({ name: WHERE_STORE, consistency: "strong" });
    const prev = (await store.get(WHERE_KEY, {
      type: "json",
    })) as WhereState | null;
    await store.setJSON(WHERE_KEY, applyReport(prev, country, new Date()));
  } catch (error) {
    console.error("where: blob store failed", error);
    return json(503, { error: "Storage unavailable" });
  }

  return json(200, { ok: true });
};

// No custom `path`: v2 functions keep the default /.netlify/functions/where URL.
// One report per country change is all bsky-avatar sends; the limit only
// slows down token guessing.
export const config: Config = {
  rateLimit: {
    windowLimit: 10,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
