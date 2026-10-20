import { describe, it, expect } from "vitest";
import {
  formatLongDate,
  formatMonthYearLong,
  formatMonthYearShort,
  formatShortDate,
  formatShortDateUTC,
  toIsoDate,
} from "../dates";
import { formatDate } from "../../js/textUtils";

// Midday timestamps keep the local-time formatters stable in any time zone.
const MIDDAY = "2024-03-15T12:00:00.000Z";

describe("dates", () => {
  describe("formatShortDateUTC (blog post dates)", () => {
    it("formats as abbreviated month, day and year", () => {
      expect(formatShortDateUTC("2024-01-15")).toBe("Jan 15, 2024");
      expect(formatShortDateUTC(new Date(MIDDAY))).toBe("Mar 15, 2024");
    });

    it("uses UTC, so a UTC-midnight date keeps its calendar day", () => {
      expect(formatShortDateUTC("2024-01-01T00:00:00.000Z")).toBe(
        "Jan 1, 2024",
      );
      expect(formatShortDateUTC("2023-12-31T23:59:59.000Z")).toBe(
        "Dec 31, 2023",
      );
    });

    it("is what textUtils.formatDate returns for the en locale", () => {
      expect(formatDate("2024-01-15", "en")).toBe("Jan 15, 2024");
    });
  });

  describe("formatShortDate (event cards)", () => {
    it("formats as abbreviated month, day and year", () => {
      expect(formatShortDate(MIDDAY)).toBe("Mar 15, 2024");
      expect(formatShortDate("2025-09-03T12:00:00")).toBe("Sep 3, 2025");
    });
  });

  describe("formatLongDate (event detail pages)", () => {
    it("formats as full month, day and year", () => {
      expect(formatLongDate(MIDDAY)).toBe("March 15, 2024");
      expect(formatLongDate("2025-09-03T12:00:00")).toBe("September 3, 2025");
    });
  });

  describe("formatMonthYearLong (press items)", () => {
    it("formats as full month and year", () => {
      expect(formatMonthYearLong("2024-01-15")).toBe("January 2024");
      expect(formatMonthYearLong("2023-12-15")).toBe("December 2023");
      expect(formatMonthYearLong("2024-07-30")).toBe("July 2024");
      expect(formatMonthYearLong(MIDDAY)).toBe("March 2024");
    });
  });

  describe("formatMonthYearShort (Bookhive, Grain)", () => {
    it("formats as abbreviated month and year", () => {
      expect(formatMonthYearShort(MIDDAY)).toBe("Mar 2024");
      expect(formatMonthYearShort("2025-09-15T08:30:00.000Z")).toBe("Sep 2025");
    });

    it("returns undefined for missing or unparseable dates", () => {
      expect(formatMonthYearShort(undefined)).toBeUndefined();
      expect(formatMonthYearShort("")).toBeUndefined();
      expect(formatMonthYearShort("not a date")).toBeUndefined();
    });
  });

  describe("toIsoDate (meta tags)", () => {
    it("returns an ISO timestamp for a Date", () => {
      expect(toIsoDate(new Date(MIDDAY))).toBe(MIDDAY);
    });

    it("returns undefined when there is no Date", () => {
      expect(toIsoDate(undefined)).toBeUndefined();
    });
  });
});
