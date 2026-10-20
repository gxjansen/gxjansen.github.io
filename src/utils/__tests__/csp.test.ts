import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { scriptHash } from "../csp";

describe("scriptHash", () => {
  it("returns the CSP source expression for the exact script text", () => {
    // Well-known SHA-256 of the empty string.
    expect(scriptHash("")).toBe(
      "sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
    );
  });

  it("hashes UTF-8 bytes, so whitespace and non-ASCII matter", () => {
    const code = "  console.log('héllo');\n";
    const expected = createHash("sha256").update(code, "utf8").digest("base64");
    expect(scriptHash(code)).toBe(`sha256-${expected}`);
    expect(scriptHash(code.trim())).not.toBe(scriptHash(code));
  });
});
