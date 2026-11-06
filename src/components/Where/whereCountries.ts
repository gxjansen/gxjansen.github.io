import type { ImageMetadata } from "astro";
import { eventsData } from "@data/events";
import { visitedCountries } from "@data/visitedCountries";
import { countryName } from "../../lib/where";

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
    countryName(a).localeCompare(countryName(b), "en"),
  );
}

const flags = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/flags/*.svg",
  { eager: true },
);

/** URL of the flag SVG for a country code, or null when there is none. */
export function flagSrc(cc: string): string | null {
  return (
    flags[`/src/assets/flags/${cc.toLowerCase()}.svg`]?.default.src ?? null
  );
}
