import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

/**
 * Newsletter Subscription Proxy
 *
 * This function proxies subscription requests to our self-hosted Listmonk instance.
 * Uses the Listmonk API to enable custom attributes for subscriber tracking.
 * API credentials are stored securely in Netlify environment variables.
 */

const LISTMONK_API_URL = "https://n.a11y.nl/api/subscribers";
const DEFAULT_LIST_ID = 3; // Guido's Golden Nuggets

interface SubscriptionRequest {
  email: string;
  name?: string;
  listId?: string;
  signupPage?: string;
}

const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
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
      };
    }

    const { email, name, listId, signupPage } = requestData;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Valid email address required" }),
      };
    }

    // Get API credentials from environment
    const apiUser = process.env.LISTMONK_API_USER;
    const apiKey = process.env.LISTMONK_API_KEY;

    if (!apiUser || !apiKey) {
      console.error("Missing Listmonk API credentials");
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: false,
          error: "Server configuration error. Please try again later.",
        }),
      };
    }

    const authHeader = `Basic ${Buffer.from(`${apiUser}:${apiKey}`).toString("base64")}`;
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
      },
      body: JSON.stringify(subscriberPayload),
    });

    const responseData = await response.json().catch(() => null);

    if (response.ok) {
      const subscriberId = responseData?.data?.id;

      if (subscriberId) {
        // Step 2: Add subscriber to list using dedicated endpoint
        const listResponse = await fetch("https://n.a11y.nl/api/subscribers/lists", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            ids: [subscriberId],
            action: "add",
            target_list_ids: [targetListId],
            status: "unconfirmed",
          }),
        });
        const listResult = await listResponse.json().catch(() => null);
        console.log("Step 2 - Add to list:", listResponse.status, JSON.stringify(listResult));

        // Step 3: Send opt-in confirmation email
        const optinResponse = await fetch(`https://n.a11y.nl/api/subscribers/${subscriberId}/optin`, {
          method: "POST",
          headers: {
            Authorization: authHeader,
          },
        });
        const optinResult = await optinResponse.json().catch(() => null);
        console.log("Step 3 - Opt-in:", optinResponse.status, JSON.stringify(optinResult));
      }

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
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
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
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
