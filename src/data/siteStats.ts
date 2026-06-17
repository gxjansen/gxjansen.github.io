/**
 * Single source of truth for the headline numbers used across the site
 * (homepage stats, CV, about, speaker, retainer, events, footer …).
 *
 * Everything is derived at build time from the real events data + a fixed
 * start date, so every page shows the same figure and it can never drift.
 * Import these instead of hardcoding "200+ talks across 26 countries" anywhere.
 */
import eventsData from "./events.json";

/** Years building communities — since Guido's first community role (2004-11-12). */
const COMMUNITY_START = Date.UTC(2004, 10, 12); // month is 0-indexed
export const yearsBuilding = Math.floor(
  (Date.now() - COMMUNITY_START) / (365.25 * 86_400_000),
);

/** Unique countries presented in (from the same events data as the flag marquee). */
export const countryCount = new Set(
  (eventsData as { country?: string }[])
    .map((e) => e.country)
    .filter((c): c is string => Boolean(c)),
).size;

/** Talks given — on-stage roles (speaker / host / moderator / panel / workshop /
 *  keynote / session), excluding pure organiser roles. */
const SPEAKING_ROLE =
  /speak|keynote|talk|workshop|present|panel|host|moderat|session/i;
export const talksCount = (eventsData as { role?: string }[]).filter((e) =>
  SPEAKING_ROLE.test(e.role ?? ""),
).length;
