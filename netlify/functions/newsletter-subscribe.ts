import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

/**
 * Newsletter Subscription Proxy
 *
 * This function proxies subscription requests to our self-hosted Listmonk instance.
 * Uses the Listmonk API to enable custom attributes for subscriber tracking.
 * API credentials are stored securely in Netlify environment variables.
 */

const LISTMONK_API_URL = "https://n.a11y.nl/api/public/subscription";
const DEFAULT_LIST_ID = "43998bb9-5d55-4d9a-a3d7-04f6a76ef863";

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

    // Build JSON payload for Listmonk public subscription API
    // This endpoint supports custom attributes for subscriber tracking
    const payload = {
      email: email,
      name: name || "",
      list_uuids: [listId || DEFAULT_LIST_ID],
      attribs: {
        source: "gui.do",
        signup_page: signupPage || "unknown",
        signup_date: new Date().toISOString().split("T")[0],
      },
    };

    // Submit to Listmonk public subscription API
    const response = await fetch(LISTMONK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Parse JSON response from API
    const responseData = await response.json().catch(() => null);

    if (response.ok) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: true,
          message:
            "Thanks for subscribing! Please check your email to confirm.",
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
