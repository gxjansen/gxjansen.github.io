import { describe, it, expect } from "vitest";
import {
  marqueDomainSchema,
  toDomainSections,
  type MarqueDomainRecord,
} from "../marque";
import type { PdsRecord } from "../pds/loader";
import { domainOverrides, extraDomains } from "@data/domains";
import fixture from "./fixtures/marque-domains.json";

const records = fixture as PdsRecord<MarqueDomainRecord>[];
const record = (domain: string, extra: Partial<MarqueDomainRecord> = {}) => ({
  ...records[0],
  value: { ...records[0].value, domain, ...extra },
});
const allDomains = (r: ReturnType<typeof toDomainSections>) => [
  ...r.pinned.map((d) => d.domain),
  ...r.sections.flatMap((s) => s.rows.map((d) => d.domain)),
];

describe("marque domains", () => {
  it("real records match the schema", () => {
    for (const r of fixture) {
      expect(marqueDomainSchema.safeParse(r.value).success, r.uri).toBe(true);
    }
  });

  it("pins gui.do on top, outside the groups", () => {
    const { pinned, sections } = toDomainSections(records);
    expect(pinned.map((d) => d.domain)).toEqual(["gui.do"]);
    expect(sections.flatMap((s) => s.rows).map((d) => d.domain)).not.toContain(
      "gui.do",
    );
  });

  it("leaves hidden domains off the page", () => {
    const shown = allDomains(toDomainSections(records));
    for (const [domain, o] of Object.entries(domainOverrides)) {
      if (o.hidden) expect(shown).not.toContain(domain);
    }
  });

  it("every override names a domain we have (catches typos)", () => {
    const known = new Set([
      ...records.map((r) => r.value.domain),
      ...extraDomains.map((d) => d.domain),
    ]);
    for (const domain of Object.keys(domainOverrides)) {
      expect(known.has(domain), domain).toBe(true);
    }
  });

  it("folds aliases into the domain they redirect to", () => {
    const result = toDomainSections(records);
    const rows = result.sections.flatMap((s) => s.rows);
    const byDomain = (d: string) => rows.find((r) => r.domain === d);
    expect(byDomain("kootana.social")?.aliases).toEqual(["kutana.social"]);
    expect(byDomain("sifa.id")?.aliases).toEqual(["sifa.page", "sifa.work"]);
    expect(allDomains(result)).not.toContain("kutana.social");
    expect(allDomains(result)).not.toContain("sifa.work");
  });

  it("every aliasOf points at a listed domain", () => {
    const shown = new Set(allDomains(toDomainSections(records)));
    for (const [domain, o] of Object.entries(domainOverrides)) {
      if (o.aliasOf) expect(shown.has(o.aliasOf), domain).toBe(true);
    }
  });

  it("puts a new domain without override under other", () => {
    const { sections } = toDomainSections([record("new-thing.social")]);
    const other = sections.find((s) => s.id === "other");
    expect(other?.rows.map((d) => d.domain)).toContain("new-thing.social");
  });

  it("drops expired domains", () => {
    const shown = allDomains(
      toDomainSections([record("old.example", { status: "expired" })]),
    );
    expect(shown).not.toContain("old.example");
  });

  it("never exposes expiry or auto-renew", () => {
    const rows = toDomainSections(records).sections.flatMap((s) => s.rows);
    for (const row of rows) {
      expect(Object.keys(row)).not.toContain("expiresAt");
      expect(Object.keys(row)).not.toContain("autoRenew");
    }
  });
});
