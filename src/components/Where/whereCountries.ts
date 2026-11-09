import { eventsData } from "@data/events";
import { visitedCountries } from "@data/visitedCountries";
import { flagName } from "../../lib/flags";

/** Countries known at build time: events plus the hand-kept list. */
export const staticCountries: string[] = [
  ...new Set([
    ...eventsData.map((e) => e.country.toUpperCase()).filter(Boolean),
    ...visitedCountries.map((c) => c.toUpperCase()),
  ]),
];

/** Dedupes and sorts country codes by their English name. */
export function sortCountries(codes: Iterable<string>): string[] {
  return [...new Set(codes)].sort((a, b) =>
    flagName(a).localeCompare(flagName(b), "en"),
  );
}
