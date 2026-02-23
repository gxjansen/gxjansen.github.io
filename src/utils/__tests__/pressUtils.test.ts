import { describe, it, expect, vi } from "vitest";
import { formatDate, getFaviconUrl } from "../pressUtils";

describe("pressUtils", () => {
  describe("formatDate", () => {
    it("formats date into month and year", () => {
      const result = formatDate("2024-01-15");
      expect(result).toBe("January 2024");
    });

    it("handles different months correctly", () => {
      expect(formatDate("2023-12-01")).toBe("December 2023");
      expect(formatDate("2024-03-15")).toBe("March 2024");
      expect(formatDate("2024-07-30")).toBe("July 2024");
    });

    it("handles ISO date strings", () => {
      const result = formatDate("2024-01-15T12:00:00.000Z");
      expect(result).toBe("January 2024");
    });

    it("uses English locale", () => {
      // Test with a few different months to ensure English names
      const months = [
        { date: "2024-01-01", expected: "January 2024" },
        { date: "2024-04-01", expected: "April 2024" },
        { date: "2024-08-01", expected: "August 2024" },
        { date: "2024-12-01", expected: "December 2024" },
      ];

      months.forEach(({ date, expected }) => {
        expect(formatDate(date)).toBe(expected);
      });
    });
  });

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
