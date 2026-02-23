import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { verifySolution } from "altcha-lib";

/**
 * Newsletter Subscription Proxy
 *
 * This function proxies subscription requests to our self-hosted Listmonk instance.
 * Uses the Listmonk API to enable custom attributes for subscriber tracking.
 * Validates ALTCHA proof-of-work challenges for spam protection.
 * API credentials are stored securely in Netlify environment variables.
 */

const LISTMONK_API_URL = "https://n.a11y.nl/api/subscribers";
const DEFAULT_LIST_ID = 3; // Guido's Golden Nuggets

interface SubscriptionRequest {
  email: string;
  name?: string;
  listId?: string;
  signupPage?: string;
  altcha?: string;
}

const commonHeaders: Record<string, string> = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
) => {
  // Handle CORS preflight
  if ((event.httpMethod as string) === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      } as Record<string, string>,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...commonHeaders },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse request body
    let requestData: SubscriptionRequest;

    if (event.headers["content-type"]?.includes("application/json")) {
      requestData = JSON.parse(event.body || "{}");
    } else {
      // Handle form-urlencoded data
      const params = new URLSearchParams(event.body || "");
      requestData = {
        email: params.get("email") || "",
        name: params.get("name") || undefined,
        listId: params.get("l") || params.get("listId") || undefined,
        signupPage: params.get("signupPage") || undefined,
        altcha: params.get("altcha") || undefined,
      };
    }

    const { email, name, listId, signupPage, altcha } = requestData;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers: { ...commonHeaders },
        body: JSON.stringify({ error: "Valid email address required" }),
      };
    }

    // Validate ALTCHA proof-of-work solution
    const altchaKey = process.env.ALTCHA_HMAC_KEY;
    if (altchaKey) {
      if (!altcha) {
        console.log("Submission without ALTCHA solution");
        return {
          statusCode: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            success: false,
            error: "Verification required. Please try again.",
          }),
        };
      }

      try {
        const isValid = await verifySolution(altcha, altchaKey);
        if (!isValid) {
          console.log("Invalid ALTCHA solution submitted");
          return {
            statusCode: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              success: false,
              error: "Verification failed. Please refresh and try again.",
            }),
          };
        }
      } catch (error) {
        console.error("ALTCHA verification error:", error);
        return {
          statusCode: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            success: false,
            error: "Verification expired. Please refresh and try again.",
          }),
        };
      }
    }

    // Get API credentials from environment
    const apiUser = process.env.LISTMONK_API_USER;
    const apiKey = process.env.LISTMONK_API_KEY;

    if (!apiUser || !apiKey) {
      console.error("Missing Listmonk API credentials");
      return {
        statusCode: 500,
        headers: { ...commonHeaders },
        body: JSON.stringify({
          success: false,
          error: "Server configuration error. Please try again later.",
        }),
      };
    }

    const authHeader = `Basic ${Buffer.from(`${apiUser}:${apiKey}`).toString("base64")}`;
    const bypassToken = process.env.CF_BYPASS_TOKEN || "";
    const targetListId = listId ? parseInt(String(listId), 10) : DEFAULT_LIST_ID;

    // Step 1: Create subscriber (without list assignment - separate API call needed)
    const subscriberPayload = {
      email: email,
      name: name || "",
      status: "enabled",
      attribs: {
        source: "gui.do",
        signup_page: signupPage || "unknown",
        signup_date: new Date().toISOString().split("T")[0],
      },
    };

    const response = await fetch(LISTMONK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        "X-Bypass-Token": bypassToken,
      },
      body: JSON.stringify(subscriberPayload),
    });

    const responseData = await response.json().catch(() => null);

    if (response.ok) {
      const subscriberId = responseData?.data?.id;

      if (subscriberId) {
        // Step 2: Add subscriber to list using dedicated endpoint
        await fetch("https://n.a11y.nl/api/subscribers/lists", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
            "X-Bypass-Token": bypassToken,
          },
          body: JSON.stringify({
            ids: [subscriberId],
            action: "add",
            target_list_ids: [targetListId],
            status: "unconfirmed",
          }),
        });

        // Step 3: Send opt-in confirmation email
        await fetch(`https://n.a11y.nl/api/subscribers/${subscriberId}/optin`, {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "X-Bypass-Token": bypassToken,
          },
        });
      }

      return {
        statusCode: 200,
        headers: { ...commonHeaders },
        body: JSON.stringify({
          success: true,
          message:
            "Thanks! Please check your email to confirm your subscription.",
        }),
      };
    }

    // Handle specific error cases from Listmonk API
    if (response.status === 409 || responseData?.message?.includes("already")) {
      // Already subscribed - treat as success
      return {
        statusCode: 200,
        headers: { ...commonHeaders },
        body: JSON.stringify({
          success: true,
          message: "You're already subscribed! Check your inbox for updates.",
        }),
      };
    }

    // Log error for debugging
    console.log("Listmonk API error:", response.status, responseData);

    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: false,
        error: responseData?.message || "Subscription failed. Please try again.",
      }),
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: false,
        error: "Something went wrong. Please try again later.",
      }),
    };
  }
};

export { handler };
