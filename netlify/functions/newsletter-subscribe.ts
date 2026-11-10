import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { verifySolution } from "altcha-lib/v1";
import { listmonkAuthHeaders, listmonkBaseUrl } from "./_shared/listmonk";
import {
  HONEYPOT_FIELD,
  checkSignupSignals,
  gmailDuplicateQuery,
  parseGmail,
} from "./_shared/signup-guards";

/**
 * Newsletter Subscription Proxy
 *
 * This function proxies subscription requests to our self-hosted Listmonk instance.
 * Uses the Listmonk API to enable custom attributes for subscriber tracking.
 * Validates ALTCHA proof-of-work challenges for spam protection; a solved
 * challenge can only be used once (tracked in Netlify Blobs). On top of that,
 * request-level bot checks (_shared/signup-guards.ts), a Gmail duplicate check
 * and an hourly cap stop list-bombing: every fake signup sends an opt-in mail
 * to someone who never asked for it.
 * API credentials are stored securely in Netlify environment variables.
 *
 * Called same-origin from NewsletterForm.astro, so no CORS headers are sent.
 */

const DEFAULT_LIST_ID = 3; // Guido's Golden Nuggets
/** Lists the public form may subscribe to. Anything else is rejected. */
const ALLOWED_LIST_IDS = new Set([DEFAULT_LIST_ID]);

const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_LENGTH = 100;
const MAX_SIGNUP_PAGE_LENGTH = 200;
const MAX_ALTCHA_LENGTH = 2000;

/** Store of ALTCHA payload hashes that have already been redeemed. */
const USED_CHALLENGES_STORE = "altcha-used-challenges";
/** Store of accepted-signup counts per UTC hour. */
const SIGNUP_COUNTS_STORE = "newsletter-signup-counts";
/**
 * Accepted signups per hour before the form pauses. Real signups come in at a
 * few a month; this only trips when something gets past the other checks.
 */
const MAX_SIGNUPS_PER_HOUR = 30;

/** Same reply for new, existing and silently dropped signups. */
const SUCCESS_MESSAGE =
  "Thanks! Please check your email to confirm your subscription.";

interface SubscriptionRequest {
  email?: unknown;
  name?: unknown;
  listId?: unknown;
  signupPage?: unknown;
  altcha?: unknown;
  elapsedMs?: unknown;
  [HONEYPOT_FIELD]?: unknown;
}

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function fail(status: number, error: string): Response {
  return json(status, { success: false, error });
}

function optionalString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

async function parseBody(req: Request): Promise<SubscriptionRequest> {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const parsed: unknown = await req.json();
    return parsed && typeof parsed === "object"
      ? (parsed as SubscriptionRequest)
      : {};
  }
  // Form-urlencoded fallback (no-JS form submit)
  const params = new URLSearchParams(await req.text());
  return {
    email: params.get("email") ?? undefined,
    name: params.get("name") ?? undefined,
    listId: params.get("l") ?? params.get("listId") ?? undefined,
    signupPage: params.get("signupPage") ?? undefined,
    altcha: params.get("altcha") ?? undefined,
    [HONEYPOT_FIELD]: params.get(HONEYPOT_FIELD) ?? undefined,
  };
}

/** Returns the list id to use, or null when the requested list isn't allowed. */
export function resolveListId(listId: unknown): number | null {
  if (listId === undefined || listId === null || listId === "")
    return DEFAULT_LIST_ID;
  const id = Number(listId);
  return Number.isInteger(id) && ALLOWED_LIST_IDS.has(id) ? id : null;
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

/**
 * Marks an ALTCHA payload as used. Returns false if it was already redeemed,
 * or if the store can't be reached (fail closed: the bomber replayed one
 * solution from several Tor exits within seconds).
 *
 * Strong consistency matters: with the default eventual consistency a read
 * can be up to 60 seconds stale, which let those replays through.
 */
async function redeemChallenge(altcha: string): Promise<boolean> {
  try {
    const store = getStore({
      name: USED_CHALLENGES_STORE,
      consistency: "strong",
    });
    const key = await sha256Hex(altcha);
    if (await store.get(key)) return false;
    await store.set(key, new Date().toISOString());
    return true;
  } catch (error) {
    console.error(
      "ALTCHA replay check unavailable:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}

/**
 * Counts an accepted signup against the hourly cap. Returns false when the cap
 * is reached. The read-then-write isn't atomic, which is fine for a soft cap.
 * Blob errors don't block a signup: the cap is a backstop, not the main check.
 */
async function withinHourlyCap(): Promise<boolean> {
  try {
    const store = getStore({
      name: SIGNUP_COUNTS_STORE,
      consistency: "strong",
    });
    const key = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
    const count = Number((await store.get(key)) ?? 0);
    if (count >= MAX_SIGNUPS_PER_HOUR) return false;
    await store.set(key, String(count + 1));
    return true;
  } catch (error) {
    console.error(
      "Signup cap unavailable:",
      error instanceof Error ? error.message : error,
    );
    return true;
  }
}

/**
 * True when another spelling of this Gmail inbox (dots, +tag, googlemail.com)
 * is already on the list. Lookup errors count as "not found".
 */
async function gmailAlreadyOnList(
  email: string,
  listId: number,
  baseUrl: string,
  headers: Record<string, string>,
): Promise<boolean> {
  const gmail = parseGmail(email);
  if (!gmail) return false;
  try {
    const params = new URLSearchParams({
      list_id: String(listId),
      per_page: "1",
      query: gmailDuplicateQuery(gmail.canonicalLocal),
    });
    const res = await fetch(`${baseUrl}/subscribers?${params}`, { headers });
    if (!res.ok) {
      console.error("Gmail duplicate check failed:", res.status);
      return false;
    }
    const data = await res.json();
    return Number(data?.data?.total ?? 0) > 0;
  } catch (error) {
    console.error(
      "Gmail duplicate check unavailable:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    let requestData: SubscriptionRequest;
    try {
      requestData = await parseBody(req);
    } catch {
      return fail(400, "Invalid request.");
    }

    const email =
      typeof requestData.email === "string" ? requestData.email.trim() : "";
    if (
      !email ||
      email.length > MAX_EMAIL_LENGTH ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return json(400, { error: "Valid email address required" });
    }

    const name = optionalString(requestData.name, MAX_NAME_LENGTH);
    const signupPage = optionalString(
      requestData.signupPage,
      MAX_SIGNUP_PAGE_LENGTH,
    );

    const targetListId = resolveListId(requestData.listId);
    if (targetListId === null) {
      return fail(400, "Unknown newsletter.");
    }

    const verdict = checkSignupSignals({
      email,
      honeypot: requestData[HONEYPOT_FIELD],
      elapsedMs: requestData.elapsedMs,
      userAgent: req.headers.get("user-agent"),
      origin: req.headers.get("origin"),
      secFetchSite: req.headers.get("sec-fetch-site"),
      expectedOrigin: new URL(req.url).origin,
    });
    if (!verdict.ok) {
      console.log("Signup blocked:", verdict.reason);
      return verdict.silent
        ? json(200, { success: true, message: SUCCESS_MESSAGE })
        : fail(400, "Verification failed. Please refresh and try again.");
    }

    // ALTCHA is mandatory: without the key we can't verify, so refuse (fail closed).
    const altchaKey = process.env.ALTCHA_HMAC_KEY;
    if (!altchaKey) {
      console.error("Missing ALTCHA_HMAC_KEY environment variable");
      return fail(500, "Server configuration error. Please try again later.");
    }

    const altcha =
      typeof requestData.altcha === "string" ? requestData.altcha : "";
    if (!altcha || altcha.length > MAX_ALTCHA_LENGTH) {
      return fail(400, "Verification required. Please try again.");
    }

    try {
      const isValid = await verifySolution(altcha, altchaKey);
      if (!isValid) {
        console.log("Invalid ALTCHA solution submitted");
        return fail(400, "Verification failed. Please refresh and try again.");
      }
    } catch {
      return fail(400, "Verification expired. Please refresh and try again.");
    }

    if (!(await redeemChallenge(altcha))) {
      console.log("Reused ALTCHA solution submitted");
      return fail(400, "Verification expired. Please refresh and try again.");
    }

    const listmonkHeaders = listmonkAuthHeaders();
    if (!listmonkHeaders) {
      console.error("Missing Listmonk API credentials");
      return fail(500, "Server configuration error. Please try again later.");
    }
    const baseUrl = listmonkBaseUrl();

    if (
      await gmailAlreadyOnList(email, targetListId, baseUrl, listmonkHeaders)
    ) {
      console.log("Signup blocked: gmail-duplicate");
      return json(200, { success: true, message: SUCCESS_MESSAGE });
    }

    if (!(await withinHourlyCap())) {
      console.log("Signup blocked: hourly-cap");
      return fail(429, "Too many signups right now. Please try again later.");
    }

    // Step 1: Create subscriber (without list assignment - separate API call needed)
    const response = await fetch(`${baseUrl}/subscribers`, {
      method: "POST",
      headers: { ...listmonkHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name: name || "",
        status: "enabled",
        attribs: {
          source: "gui.do",
          signup_page: signupPage || "unknown",
          signup_date: new Date().toISOString().split("T")[0],
        },
      }),
    });

    const responseData = await response.json().catch(() => null);

    if (response.ok) {
      const subscriberId = responseData?.data?.id;

      if (subscriberId) {
        // Step 2: Add subscriber to list using dedicated endpoint
        await fetch(`${baseUrl}/subscribers/lists`, {
          method: "PUT",
          headers: { ...listmonkHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({
            ids: [subscriberId],
            action: "add",
            target_list_ids: [targetListId],
            status: "unconfirmed",
          }),
        });

        // Step 3: Send opt-in confirmation email
        await fetch(`${baseUrl}/subscribers/${subscriberId}/optin`, {
          method: "POST",
          headers: listmonkHeaders,
        });
      }

      return json(200, { success: true, message: SUCCESS_MESSAGE });
    }

    if (response.status === 409 || responseData?.message?.includes("already")) {
      // Already subscribed: same reply as a new signup, so the form can't be
      // used to find out who is on the list.
      return json(200, { success: true, message: SUCCESS_MESSAGE });
    }

    // Log status and Listmonk's message only; the full body can echo the email address.
    console.log("Listmonk API error:", response.status, responseData?.message);
    return fail(400, "Subscription failed. Please try again.");
  } catch (error) {
    console.error(
      "Newsletter subscription error:",
      error instanceof Error ? error.message : error,
    );
    return fail(500, "Something went wrong. Please try again later.");
  }
};

// No custom `path`: v2 functions keep the default /.netlify/functions/newsletter-subscribe URL.
export const config: Config = {
  rateLimit: {
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
