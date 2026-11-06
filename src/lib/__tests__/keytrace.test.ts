import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  keytraceClaimSchema,
  toVerifiedClaims,
  type KeytraceClaimRecord,
} from "../keytrace";
import { GUIDO_DID, type PdsRecord } from "../pds/loader";
import fixture from "./fixtures/keytrace-claims.json";

const records = fixture as PdsRecord<KeytraceClaimRecord>[];

describe("keytrace claims", () => {
  it("real records (trimmed) match the schema", () => {
    for (const r of fixture) {
      expect(keytraceClaimSchema.safeParse(r.value).success, r.uri).toBe(true);
    }
  });

  it("maps claims to display rows in page order", () => {
    const claims = toVerifiedClaims(records);
    expect(claims.map((c) => c.type)).toEqual([
      "tangled",
      "activitypub",
      "github",
      "linkedin",
      "dns",
    ]);
    const mastodon = claims.find((c) => c.type === "activitypub")!;
    expect(mastodon.account).toBe("@gxjansen@mstdn.social");
    // The Mastodon proof is the profile itself: no second link.
    expect(mastodon.proofUrl).toBeUndefined();
    const linkedin = claims.find((c) => c.type === "linkedin")!;
    expect(linkedin.proofUrl).not.toContain("?");
    // dns:gui.do is not a link.
    expect(claims.find((c) => c.type === "dns")!.proofUrl).toBeUndefined();
  });

  it("drops failed and retracted claims, keeps legacy ones", () => {
    const base = records[0];
    const claims = toVerifiedClaims([
      { ...base, rkey: "f", value: { ...base.value, status: "failed" } },
      { ...base, rkey: "r", value: { ...base.value, status: "retracted" } },
      { ...base, rkey: "l", value: { ...base.value, status: undefined } },
    ]);
    expect(claims.map((c) => c.rkey)).toEqual(["l"]);
  });

  it("renders an unknown claim type with its raw name", () => {
    const base = records[0];
    const [claim] = toVerifiedClaims([
      { ...base, value: { ...base.value, type: "npm" } },
    ]);
    expect(claim.label).toBe("npm");
  });
});

describe("gui.do handle", () => {
  it("/.well-known/atproto-did serves Guido's DID", () => {
    const file = path.resolve(
      __dirname,
      "../../../public/.well-known/atproto-did",
    );
    expect(fs.readFileSync(file, "utf8").trim()).toBe(GUIDO_DID);
  });
});
