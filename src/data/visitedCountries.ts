/**
 * Countries for the /where flag overview that the events data doesn't cover:
 * places visited without giving a talk. ISO 3166-1 alpha-2, uppercase.
 *
 * The overview is the union of this list, every country in the events data,
 * and every country bsky-avatar has reported since /where went live (see
 * src/lib/where.ts), so a new trip shows up without editing this file.
 */
export const visitedCountries: string[] = [
  "CW",
  "EG",
  "HK",
  "HU",
  "IT",
  "LA",
  "LU",
  "PT",
  "RU",
  "SG",
  "TH",
];
