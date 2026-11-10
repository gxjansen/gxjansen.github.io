/**
 * Bot checks for the newsletter signup.
 *
 * The signup was list-bombed: a script fetched ALTCHA challenges directly,
 * solved them, and posted dotted variants of Gmail addresses (Gmail ignores
 * dots, so every variant lands in the same inbox) through rotating Tor exits.
 * ALTCHA alone doesn't stop that, so these checks look at the request itself.
 *
 * Pure functions, so they can be unit-tested without the handler.
 */

const GMAIL_DOMAINS = new Set(["gmail.com", "googlemail.com"]);

/**
 * Dots allowed in a Gmail local part. None of the confirmed subscribers has
 * more than two; the bots averaged five.
 */
export const MAX_GMAIL_DOTS = 2;

/**
 * Minimum time between page load and submit. The form needs an email address
 * and a solved ALTCHA, which a person can't do faster than this.
 */
export const MIN_SUBMIT_MS = 3000;

/** Name of the honeypot field. Hidden from people, filled in by form bots. */
export const HONEYPOT_FIELD = "hp_note";

export interface GmailAddress {
  /** Local part without dots and +tags, lowercased. Only [a-z0-9]. */
  canonicalLocal: string;
  dots: number;
}

/**
 * Parses a Gmail address. Returns null for other domains and for local parts
 * Gmail doesn't allow (anything besides letters, digits and dots), so the
 * canonical form is always safe to use in a lookup.
 */
export function parseGmail(email: string): GmailAddress | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const domain = email.slice(at + 1).toLowerCase();
  if (!GMAIL_DOMAINS.has(domain)) return null;

  const local = email.slice(0, at).toLowerCase().split("+")[0];
  if (!/^[a-z0-9.]+$/.test(local)) return null;

  const canonicalLocal = local.replace(/\./g, "");
  if (!canonicalLocal) return null;
  return { canonicalLocal, dots: local.split(".").length - 1 };
}

/**
 * Listmonk query (an SQL expression) matching any stored spelling of the same
 * Gmail inbox. Only built from parseGmail output, which is [a-z0-9]+.
 */
export function gmailDuplicateQuery(canonicalLocal: string): string {
  if (!/^[a-z0-9]+$/.test(canonicalLocal)) {
    throw new Error("canonicalLocal must be [a-z0-9]+");
  }
  return (
    "split_part(lower(subscribers.email), '@', 2) IN ('gmail.com', 'googlemail.com')" +
    " AND replace(split_part(split_part(lower(subscribers.email), '@', 1), '+', 1), '.', '')" +
    ` = '${canonicalLocal}'`
  );
}

export type BotVerdict =
  | { ok: true }
  /**
   * `silent`: answer with the normal success message so the bot learns
   * nothing. Used for signals a person can't trip by accident.
   */
  | { ok: false; reason: string; silent: boolean };

export interface SignupSignals {
  email: string;
  honeypot: unknown;
  elapsedMs: unknown;
  userAgent: string | null;
  origin: string | null;
  secFetchSite: string | null;
  /** Origin of the function URL, e.g. https://gui.do */
  expectedOrigin: string;
}

/** Runs the request-level checks, cheapest and most certain first. */
export function checkSignupSignals(s: SignupSignals): BotVerdict {
  if (typeof s.honeypot === "string" && s.honeypot.trim() !== "") {
    return { ok: false, reason: "honeypot", silent: true };
  }

  // Browsers never wrap the User-Agent in quotes; the bomber's script did.
  const ua = s.userAgent?.trim() ?? "";
  if (!ua || ua.startsWith('"')) {
    return { ok: false, reason: "user-agent", silent: true };
  }

  // The form posts with fetch(), so browsers always send Origin, and
  // Sec-Fetch-Site where they support it.
  if (s.origin !== s.expectedOrigin) {
    return { ok: false, reason: "origin", silent: false };
  }
  if (s.secFetchSite && s.secFetchSite !== "same-origin") {
    return { ok: false, reason: "sec-fetch-site", silent: false };
  }

  const gmail = parseGmail(s.email);
  if (gmail && gmail.dots > MAX_GMAIL_DOTS) {
    return { ok: false, reason: "gmail-dots", silent: true };
  }

  const elapsed = typeof s.elapsedMs === "number" ? s.elapsedMs : Number.NaN;
  if (!Number.isFinite(elapsed) || elapsed < MIN_SUBMIT_MS) {
    return { ok: false, reason: "too-fast", silent: false };
  }

  return { ok: true };
}
