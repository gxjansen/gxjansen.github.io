import { describe, it, expect } from "vitest";
import { sanitizeQuestion } from "../lib/ama/sanitize";

describe("sanitizeQuestion", () => {
  it("leaves ordinary text alone", () => {
    expect(sanitizeQuestion("What's next for gui.do?")).toBe(
      "What's next for gui.do?",
    );
  });

  it("trims and collapses whitespace runs", () => {
    expect(sanitizeQuestion("  one   two\t\tthree  ")).toBe("one two three");
  });

  it("turns tabs and line breaks (\\n, \\r\\n, \\r) into single spaces", () => {
    expect(sanitizeQuestion("a\nb")).toBe("a b");
    expect(sanitizeQuestion("a\r\nb")).toBe("a b");
    expect(sanitizeQuestion("a\rb")).toBe("a b");
    expect(sanitizeQuestion("a\tb")).toBe("a b");
  });

  it("strips C0 controls and DEL", () => {
    expect(sanitizeQuestion("a\u0000b\u0007c\u001Bd\u007Fe")).toBe("abcde");
    expect(sanitizeQuestion("a\u000Bb\u000Cc")).toBe("abc");
  });

  it("strips zero-width characters and the BOM", () => {
    expect(sanitizeQuestion("\uFEFFin\u200Bvis\u200Cible\u200D")).toBe(
      "invisible",
    );
  });

  it("strips bidi overrides and directional isolates", () => {
    expect(sanitizeQuestion("abc\u202Edef\u202C")).toBe("abcdef");
    expect(sanitizeQuestion("\u2066x\u2069\u2067y\u2068")).toBe("xy");
  });

  it("normalizes to NFC", () => {
    const decomposed = "Cafe\u0301"; // e + combining acute
    const result = sanitizeQuestion(decomposed);
    expect(result).toBe("Café");
    expect(result).toHaveLength(4);
  });

  it("keeps emoji and mixed scripts", () => {
    expect(sanitizeQuestion("Hoe gaat het? 你好 مرحبا 🚀")).toBe(
      "Hoe gaat het? 你好 مرحبا 🚀",
    );
  });

  it("returns an empty string for whitespace or invisible-only input", () => {
    expect(sanitizeQuestion("   ")).toBe("");
    expect(sanitizeQuestion("\u200B\u202E\uFEFF")).toBe("");
  });
});
