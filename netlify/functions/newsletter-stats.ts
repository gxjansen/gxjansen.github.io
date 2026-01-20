import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

/**
 * Newsletter Stats API
 *
 * Fetches subscriber statistics from self-hosted Listmonk instance.
 * Requires LISTMONK_API_USER and LISTMONK_API_KEY environment variables.
 */

const LISTMONK_API_URL = "https://n.a11y.nl/api";

interface ListmonkDashboardStats {
  data: {
    subscribers: {
      total: number;
      blocklisted: number;
      orphans: number;
    };
  };
}

const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
) => {
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiUser = process.env.LISTMONK_API_USER;
  const apiKey = process.env.LISTMONK_API_KEY;

  if (!apiUser || !apiKey) {
    // Return a fallback when credentials aren't configured
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
      body: JSON.stringify({
        success: true,
        subscriberCount: null,
        message: "Stats not configured",
      }),
    };
  }

  try {
    const authHeader = Buffer.from(`${apiUser}:${apiKey}`).toString("base64");

    const response = await fetch(`${LISTMONK_API_URL}/dashboard/stats`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Listmonk API returned ${response.status}`);
    }

    const data: ListmonkDashboardStats = await response.json();
    const totalSubscribers = data.data.subscribers.total;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
      body: JSON.stringify({
        success: true,
        subscriberCount: totalSubscribers,
      }),
    };
  } catch (error) {
    console.error("Newsletter stats error:", error);

    return {
      statusCode: 200, // Return 200 to not break the page
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: false,
        subscriberCount: null,
        error: "Could not fetch stats",
      }),
    };
  }
};

export { handler };
