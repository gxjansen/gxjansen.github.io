/**
 * Domains for /domains: Guido's `at.marque.domain` records (Marque,
 * https://marque.at, a registrar that writes one record per domain into the
 * owner's PDS), merged with src/data/domains.ts for what the records don't
 * say: what a domain is for, which group it goes in, a link, domains held
 * elsewhere (gui.do) and domains left off the page.
 *
 * Schema follows the published lexicon (authority marque.at). Expiry and
 * auto-renew are validated but never rendered: they would point squatters at
 * domains that may lapse.
 */

import { z } from "astro/zod";
import { loadCollection, type PdsRecord } from "./pds/loader";
import {
  domainGroups,
  domainOverrides,
  extraDomains,
  type DomainGroupId,
} from "@data/domains";

export const MARQUE_COLLECTION = "at.marque.domain";

export const marqueDomainSchema = z.looseObject({
  domain: z.string().min(1),
  status: z.string(),
  registeredAt: z.string(),
  expiresAt: z.string(),
  createdAt: z.string(),
  dnssec: z.boolean().optional(),
  atprotoHandle: z.string().optional(),
  atprotoVerified: z.boolean().optional(),
});

export type MarqueDomainRecord = z.output<typeof marqueDomainSchema>;

export interface DomainRow {
  domain: string;
  group: DomainGroupId;
  note?: string;
  url?: string;
  dnssec: boolean;
  /** Set when the domain is an AT Protocol handle (verified via DNS). */
  handle?: string;
  pinned: boolean;
}

export interface DomainSection {
  id: DomainGroupId;
  label: string;
  text?: string;
  rows: DomainRow[];
}

/** Lifecycle states that still mean "mine": expired domains drop off. */
const LIVE_STATUSES = new Set(["active", "expiring", "transferPending"]);

export function toDomainSections(records: PdsRecord<MarqueDomainRecord>[]): {
  pinned: DomainRow[];
  sections: DomainSection[];
} {
  const rows = new Map<string, DomainRow>();
  for (const { value: v } of records) {
    if (!LIVE_STATUSES.has(v.status)) continue;
    const domain = v.domain.toLowerCase();
    rows.set(domain, {
      domain,
      group: "other",
      dnssec: v.dnssec ?? false,
      handle: v.atprotoVerified ? v.atprotoHandle : undefined,
      pinned: false,
    });
  }
  // Domains not registered through Marque; a Marque record wins if both exist.
  for (const extra of extraDomains) {
    if (!rows.has(extra.domain)) {
      rows.set(extra.domain, {
        domain: extra.domain,
        group: "other",
        dnssec: extra.dnssec ?? false,
        pinned: false,
      });
    }
  }
  for (const [domain, o] of Object.entries(domainOverrides)) {
    const row = rows.get(domain);
    if (!row) continue;
    if (o.hidden) {
      rows.delete(domain);
      continue;
    }
    Object.assign(row, {
      group: o.group ?? row.group,
      note: o.note,
      url: o.url,
      pinned: o.pinned ?? false,
    });
  }

  const all = [...rows.values()].sort((a, b) =>
    a.domain.localeCompare(b.domain),
  );
  const sections = domainGroups
    .map((g) => ({
      id: g.id,
      label: g.label,
      text: g.text,
      rows: all.filter((r) => !r.pinned && r.group === g.id),
    }))
    .filter((s) => s.rows.length > 0);
  return { pinned: all.filter((r) => r.pinned), sections };
}

export async function loadDomainSections() {
  const { records } = await loadCollection({
    collection: MARQUE_COLLECTION,
    schema: marqueDomainSchema,
  });
  return toDomainSections(records);
}
