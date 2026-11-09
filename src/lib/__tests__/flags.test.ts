import { describe, expect, it } from "vitest";
import {
  flagCodeFromEmoji,
  flagImage,
  flagName,
  splitFlagEmoji,
} from "../flags";

describe("flagCodeFromEmoji", () => {
  it("reads regional indicator pairs", () => {
    expect(flagCodeFromEmoji("🇳🇱")).toBe("nl");
    expect(flagCodeFromEmoji("🇪🇺")).toBe("eu");
  });

  it("reads tag sequences for subdivisions", () => {
    expect(flagCodeFromEmoji("🏴󠁧󠁢󠁳󠁣󠁴󠁿")).toBe("gb-sct");
  });

  it("returns null for other text", () => {
    expect(flagCodeFromEmoji("NL")).toBeNull();
    expect(flagCodeFromEmoji("🏆")).toBeNull();
  });
});

describe("flagImage and flagName", () => {
  it("finds the SVG regardless of case", () => {
    expect(flagImage("NL")).toBeTruthy();
    expect(flagImage("nl")).toBe(flagImage("NL"));
    expect(flagImage("zz")).toBeNull();
  });

  it("names countries, the EU and subdivisions", () => {
    expect(flagName("NL")).toBe("Netherlands");
    expect(flagName("eu")).toBe("European Union");
    expect(flagName("gb-sct")).toBe("Scotland");
  });
});

describe("splitFlagEmoji", () => {
  it("splits text around flags", () => {
    expect(splitFlagEmoji("Helsinki 🇫🇮")).toEqual([
      { type: "text", value: "Helsinki " },
      { type: "flag", code: "fi", emoji: "🇫🇮" },
    ]);
  });

  it("handles several flags and text after them", () => {
    const parts = splitFlagEmoji("🇳🇱 🇪🇺 home");
    expect(parts.map((p) => p.type)).toEqual(["flag", "text", "flag", "text"]);
  });

  it("returns plain text unchanged", () => {
    expect(splitFlagEmoji("no flags here")).toEqual([
      { type: "text", value: "no flags here" },
    ]);
  });
});
