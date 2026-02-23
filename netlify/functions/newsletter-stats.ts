import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

/**
 * Newsletter Stats API
 *
 * Fetches subscriber statistics from self-hosted Listmonk instance.
 * Requires LISTMONK_API_USER and LISTMONK_API_KEY environment variables.
 * Uses /subscribers endpoint which requires only subscribers:get permission.
 */

const LISTMONK_API_URL = "https://n.a11y.nl/api";

interface ListmonkSubscribersResponse {
  data: {
    results: unknown[];
    total: number;
    per_page: number;
    page: number;
  };
}

const commonHeaders: Record<string, string> = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
) => {
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { ...commonHeaders },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiUser = process.env.LISTMONK_API_USER;
  const apiKey = process.env.LISTMONK_API_KEY;

  if (!apiUser || !apiKey) {
    // Return a fallback when credentials aren't configured
    return {
      statusCode: 200,
      headers: { ...commonHeaders, "Cache-Control": "public, max-age=3600" },
      body: JSON.stringify({
        success: true,
        subscriberCount: null,
        message: "Stats not configured",
      }),
    };
  }

  try {
    const authHeader = Buffer.from(`${apiUser}:${apiKey}`).toString("base64");
    const bypassToken = process.env.CF_BYPASS_TOKEN || "";

    // Use subscribers endpoint with minimal query (1 result) just to get total count
    const response = await fetch(
      `${LISTMONK_API_URL}/subscribers?page=1&per_page=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
          "X-Bypass-Token": bypassToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Listmonk API returned ${response.status}`);
    }

    const data: ListmonkSubscribersResponse = await response.json();
    const totalSubscribers = data.data.total;

    return {
      statusCode: 200,
      headers: { ...commonHeaders, "Cache-Control": "public, max-age=3600" },
      body: JSON.stringify({
        success: true,
        subscriberCount: totalSubscribers,
      }),
    };
  } catch (error) {
    console.error("Newsletter stats error:", error);

    return {
      statusCode: 200, // Return 200 to not break the page
      headers: { ...commonHeaders },
      body: JSON.stringify({
        success: false,
        subscriberCount: null,
        error: "Could not fetch stats",
      }),
    };
  }
};

export { handler };
