import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

/**
 * Newsletter Subscription Proxy
 *
 * This function proxies subscription requests to our self-hosted Listmonk instance.
 * This approach solves CSP restrictions and allows proper response handling.
 */

const LISTMONK_URL = "https://n.a11y.nl/subscription/form";
const DEFAULT_LIST_ID = "43998bb9-5d55-4d9a-a3d7-04f6a76ef863";

interface SubscriptionRequest {
  email: string;
  name?: string;
  listId?: string;
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
      };
    }

    const { email, name, listId } = requestData;

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

    // Build form data for Listmonk
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("l", listId || DEFAULT_LIST_ID);

    if (name) {
      formData.append("name", name);
    }

    // Submit to Listmonk
    const response = await fetch(LISTMONK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    // Get response text to check for success indicators
    const responseText = await response.text();

    // Listmonk returns HTML - check for success message
    const isSuccess =
      responseText.includes("confirm your subscription") ||
      responseText.includes("already subscribed") ||
      responseText.includes("Thank you");

    if (isSuccess) {
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

    // Check for common error patterns
    if (responseText.includes("invalid") || responseText.includes("error")) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: false,
          error: "Subscription failed. Please try again.",
        }),
      };
    }

    // Unknown response - log for debugging but return success
    // (Listmonk may have accepted it but responded differently)
    console.log("Unexpected Listmonk response:", responseText.slice(0, 500));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        message: "Thanks for subscribing! Please check your email to confirm.",
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
