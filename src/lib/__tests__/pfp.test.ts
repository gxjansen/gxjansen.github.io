import { describe, it, expect } from "vitest";
import { fixedPfps } from "@data/pfp";
import { hasPfpTag, groupByYear, PFP_SINCE } from "../pfp";
import { tidToDate } from "../pds/loader";

describe("tidToDate", () => {
  it("decodes the creation time of a TID rkey", () => {
    expect(tidToDate("3mzx46tv46726")?.toISOString()).toBe(
      "2026-11-10T09:16:46.118Z",
    );
  });
  it("returns null for rkeys that aren't TIDs", () => {
    expect(tidToDate("self")).toBeNull();
    expect(tidToDate("3mzx46tv4672")).toBeNull();
  });
});

describe("hasPfpTag", () => {
  const base = { createdAt: "2026-11-10T00:00:00Z" };
  it("matches a #pfp tag facet, case-insensitive", () => {
    expect(
      hasPfpTag({
        ...base,
        facets: [
          { features: [{ $type: "app.bsky.richtext.facet#tag", tag: "PFP" }] },
        ],
      }),
    ).toBe(true);
  });
  it("matches #pfp in the description text", () => {
    expect(hasPfpTag({ ...base, description: "#selfie #pfp" })).toBe(true);
  });
  it("ignores other tags and lookalikes", () => {
    expect(hasPfpTag({ ...base, description: "#pfps #selfie" })).toBe(false);
    expect(hasPfpTag({ ...base, description: "no tags" })).toBe(false);
  });
});

describe("fixed pfp list", () => {
  it("has unique photo keys and valid dates", () => {
    expect(new Set(fixedPfps.map((p) => p.rkey)).size).toBe(fixedPfps.length);
    for (const p of fixedPfps) expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it("is older than the tag cutoff, so the two sources don't overlap by date", () => {
    for (const p of fixedPfps)
      expect(p.date < PFP_SINCE.slice(0, 10)).toBe(true);
  });
  it("groups by year, newest first", () => {
    const years = groupByYear(fixedPfps).map(([y]) => y);
    expect(years).toEqual([...years].sort().reverse());
  });
});
