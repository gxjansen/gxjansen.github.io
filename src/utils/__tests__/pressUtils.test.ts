import { describe, it, expect } from "vitest";
import { getFaviconUrl } from "../pressUtils";

describe("pressUtils", () => {
  describe("getFaviconUrl", () => {
    it("returns Google favicon service URL for valid URLs", () => {
      const url = "https://example.com/page";
      const result = getFaviconUrl(url);
      expect(result).toBe(
        "https://www.google.com/s2/favicons?domain=example.com&sz=32&default=/assets/document-icon.svg",
      );
    });

    it("extracts domain correctly from complex URLs", () => {
      const urls = [
        "https://subdomain.example.com/path?query=1",
        "http://example.co.uk/path#hash",
        "https://multiple.sub.domains.example.net:8080",
      ];

      urls.forEach((url) => {
        const domain = new URL(url).hostname;
        const result = getFaviconUrl(url);
        expect(result).toBe(
          `https://www.google.com/s2/favicons?domain=${domain}&sz=32&default=/assets/document-icon.svg`,
        );
      });
    });

    it("returns fallback icon for empty URL", () => {
      const result = getFaviconUrl("");
      expect(result).toBe("/assets/document-icon.svg");
    });

    it("returns fallback icon for invalid URLs", () => {
      const invalidUrls = [
        "not-a-url",
        "http://",
        "ftp://invalid",
        undefined,
        null,
      ];

      invalidUrls.forEach((url) => {
        // @ts-ignore - Testing invalid input
        const result = getFaviconUrl(url);
        expect(result).toBe("/assets/document-icon.svg");
      });
    });
  });
});
