import { describe, expect, it } from "vitest";
import {
  formatHonorDate,
  sortHonors,
  toHonor,
  type HonorRecord,
} from "../honors";

const rec = (value: Partial<HonorRecord>, rkey = "abc") => ({
  uri: `at://did:plc:x/id.sifa.profile.honor/${rkey}`,
  cid: "cid",
  rkey,
  value: { title: "Untitled", createdAt: "2026-11-09T00:00:00Z", ...value },
});

describe("toHonor", () => {
  it("reads kind from the Sifa token", () => {
    expect(
      toHonor(rec({ title: "X", kind: "id.sifa.defs#honorRecord" })).kind,
    ).toBe("record");
  });

  it("leaves kind unset when it is missing or unknown", () => {
    expect(
      toHonor(rec({ title: "CRO personality 2020 (nominated)" })).kind,
    ).toBeUndefined();
    expect(
      toHonor(rec({ title: "Dutch National Champion 50m", kind: "x#other" }))
        .kind,
    ).toBeUndefined();
    expect(
      toHonor(rec({ title: "X", kind: "id.sifa.defs#honorSomethingNew" })).kind,
    ).toBeUndefined();
  });

  it("puts swimming issuers in the swimming area", () => {
    const knzb = "Koninklijke Nederlandse Zwembond (KNZB)";
    expect(toHonor(rec({ issuer: knzb })).area).toBe("swimming");
    expect(toHonor(rec({ issuer: "Kring Utrecht (KNZB)" })).area).toBe(
      "swimming",
    );
    expect(toHonor(rec({ issuer: "Speedo" })).area).toBe("swimming");
    expect(toHonor(rec({ issuer: "LEN (European Aquatics)" })).area).toBe(
      "swimming",
    );
    expect(toHonor(rec({ issuer: "Lenovo" })).area).toBe("work");
    expect(toHonor(rec({ issuer: "Adobe" })).area).toBe("work");
  });

  it("marks '- youth' titles as youth, not youth records", () => {
    expect(
      toHonor(rec({ title: "Champion 50m - youth (boys born 1982)" })).youth,
    ).toBe(true);
    expect(
      toHonor(rec({ title: "Dutch National youth record for club teams" }))
        .youth,
    ).toBe(false);
  });

  it("keeps only http(s) links and labels them", () => {
    const h = toHonor(
      rec({
        links: [
          { url: "https://www.swimmingworldmagazine.com/news/x/" },
          { url: "https://example.org/a", label: "Example" },
          { url: "javascript:alert(1)" },
        ],
      }),
    );
    expect(h.links).toEqual([
      {
        url: "https://www.swimmingworldmagazine.com/news/x/",
        label: "swimmingworldmagazine.com",
      },
      { url: "https://example.org/a", label: "Example" },
    ]);
  });
});

describe("formatHonorDate and sortHonors", () => {
  it("formats year and year-month", () => {
    expect(formatHonorDate("2001-06")).toBe("June 2001");
    expect(formatHonorDate("1997")).toBe("1997");
    expect(formatHonorDate(undefined)).toBeUndefined();
  });

  it("sorts newest first with undated last", () => {
    const hs = [
      toHonor(rec({ awardedAt: "1997" }, "a")),
      toHonor(rec({}, "b")),
      toHonor(rec({ awardedAt: "2001-06" }, "c")),
    ];
    expect(sortHonors(hs).map((h) => h.rkey)).toEqual(["c", "a", "b"]);
  });
});
