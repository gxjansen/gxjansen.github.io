/**
 * Every collection a page loads at build time must be fingerprinted, or the
 * daily snapshot run won't notice its changes and the page goes stale until
 * the next unrelated deploy (scripts/pds-fingerprints.mjs).
 */
import { describe, it, expect } from "vitest";
import fingerprints from "../pds-fingerprints.json";
import { KEYTRACE_COLLECTION } from "../../lib/keytrace";
import { MARQUE_COLLECTION } from "../../lib/marque";

describe("pds fingerprints", () => {
  it("covers every collection loaded at build time", () => {
    for (const c of [KEYTRACE_COLLECTION, MARQUE_COLLECTION]) {
      expect(Object.keys(fingerprints), c).toContain(c);
    }
  });
});
