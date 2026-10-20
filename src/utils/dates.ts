/**
 * Date formatters shared across the site.
 *
 * Each formatter pins its locale and options so the output is the same
 * everywhere it is used. Unless the name says UTC, formatting uses the
 * build machine's local time zone (Netlify builds run in UTC).
 */

type DateInput = string | number | Date;

/** "Jan 15, 2024" in UTC. Used for blog post dates. */
export function formatShortDateUTC(
  date: DateInput,
  locale: string = "en-US",
): string {
  return new Date(date).toLocaleDateString(locale, {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** "Jan 15, 2024" in local time. Used on event cards. */
export function formatShortDate(date: DateInput): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** "January 15, 2024" in local time. Used on event detail pages. */
export function formatLongDate(date: DateInput): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** "January 2024" in local time. Used for press items. */
export function formatMonthYearLong(date: DateInput): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * "Jan 2024" in local time. Returns undefined for a missing or unparseable
 * date, so callers can choose their own fallback.
 */
export function formatMonthYearShort(date?: DateInput): string | undefined {
  if (date === undefined || date === "") return undefined;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** ISO 8601 timestamp for metadata, or undefined if not a Date. */
export function toIsoDate(date: Date | undefined): string | undefined {
  return date instanceof Date ? date.toISOString() : undefined;
}
