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

    // Debug: log incoming request data
    console.log("Request data:", JSON.stringify({ email, name, listId, signupPage }));

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

    // Debug: log credential status (not values)
    console.log("Env check - apiUser exists:", !!apiUser, "apiKey exists:", !!apiKey);
    console.log("Env check - apiUser length:", apiUser?.length, "apiKey length:", apiKey?.length);

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

    // Build JSON payload for Listmonk authenticated API
    // This endpoint supports custom attributes and requires API auth
    const payload = {
      email: email,
      name: name || "",
      status: "enabled", // Subscriber is added directly; use optin campaign in Listmonk if needed
      lists: [listId ? parseInt(String(listId), 10) : DEFAULT_LIST_ID],
      attribs: {
        source: "gui.do",
        signup_page: signupPage || "unknown",
        signup_date: new Date().toISOString().split("T")[0],
      },
    };

    // Debug: log the payload being sent
    console.log("Listmonk payload:", JSON.stringify(payload));

    // Submit to Listmonk authenticated API
    const response = await fetch(LISTMONK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${apiUser}:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify(payload),
    });

    // Parse JSON response from API
    const responseData = await response.json().catch(() => null);

    // Debug: log full response
    console.log("Listmonk response status:", response.status);
    console.log("Listmonk response data:", JSON.stringify(responseData));

    if (response.ok) {
      // Subscriber created - now send opt-in confirmation email
      const subscriberId = responseData?.data?.id;
      if (subscriberId) {
        await fetch(`https://n.a11y.nl/api/subscribers/${subscriberId}/optin`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${apiUser}:${apiKey}`).toString("base64")}`,
          },
        });
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
