/**
 * /where: the country Guido is in right now.
 *
 * bsky-avatar (on the NAS) resolves the country for the avatar flag and POSTs
 * it to netlify/functions/where.ts whenever it changes. The function folds the
 * report into a WhereState in Netlify Blobs; the /where server island reads it
 * back through publicView().
 *
 * Privacy: leaving home is published with a delay. Until PUBLIC_DELAY_MS has
 * passed since the departure, the public view keeps saying "home", even when
 * he moves on to a second country inside that window. Coming home and moving
 * between two foreign countries later on show straight away. Countries seen
 * for the first time wait the same delay before joining the flag overview, so
 * the overview can't give the trip away either.
 */

export const HOME_COUNTRY = "NL";
export const PUBLIC_DELAY_MS = 6 * 60 * 60 * 1000;

export const WHERE_STORE = "where";
export const WHERE_KEY = "state";

export interface WhereState {
  /** ISO 3166-1 alpha-2, uppercase. */
  country: string;
  /** When the current trip abroad started; null while home. */
  leftHomeAt: string | null;
  /** Last report received, ISO timestamp. */
  updatedAt: string;
  /** Every country ever reported, with the first time it was seen. */
  seen: Record<string, string>;
}

export interface WherePublic {
  /** Country to show as current, or null before the first report. */
  country: string | null;
  /** Reported countries old enough to show in the overview. */
  seen: string[];
}

/** Normalizes a country code; returns null unless it is two ASCII letters. */
export function parseCountry(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cc = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(cc) ? cc : null;
}

/** Folds one report into the stored state. */
export function applyReport(
  prev: WhereState | null,
  country: string,
  now: Date,
): WhereState {
  const at = now.toISOString();
  const seen = { ...(prev?.seen ?? {}) };
  seen[country] ??= at;

  let leftHomeAt: string | null;
  if (country === HOME_COUNTRY) {
    leftHomeAt = null;
  } else if (prev && prev.country !== HOME_COUNTRY) {
    // Still on the same trip: abroad -> abroad keeps the departure time.
    leftHomeAt = prev.leftHomeAt ?? at;
  } else {
    // Just left home, or the very first report is from abroad.
    leftHomeAt = at;
  }

  return { country, leftHomeAt, updatedAt: at, seen };
}

/** What /where may show at `now`. */
export function publicView(
  state: WhereState | null,
  now: Date,
  delayMs: number = PUBLIC_DELAY_MS,
): WherePublic {
  if (!state) return { country: null, seen: [] };

  const t = now.getTime();
  const old = (iso: string | null) =>
    iso !== null && t - new Date(iso).getTime() >= delayMs;

  const country =
    state.country === HOME_COUNTRY || old(state.leftHomeAt)
      ? state.country
      : HOME_COUNTRY;

  const seen = Object.entries(state.seen)
    .filter(([, firstSeen]) => old(firstSeen))
    .map(([cc]) => cc);

  return { country, seen };
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

// Names that should differ from Intl's. Hong Kong was visited before 1997.
const NAME_OVERRIDES: Record<string, string> = { HK: "Hong Kong" };

/** English country name for a code, falling back to the code itself. */
export function countryName(cc: string): string {
  if (NAME_OVERRIDES[cc]) return NAME_OVERRIDES[cc];
  try {
    return regionNames.of(cc) ?? cc;
  } catch {
    return cc;
  }
}
