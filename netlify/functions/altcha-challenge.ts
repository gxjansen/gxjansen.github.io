import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { createChallenge } from "altcha-lib";

/**
 * ALTCHA Challenge Endpoint
 *
 * Generates cryptographic proof-of-work challenges for spam protection.
 * The challenge expires after 5 minutes (encoded in salt).
 * Uses HMAC signing to verify challenges came from this server.
 */

const CHALLENGE_EXPIRY_SECONDS = 300; // 5 minutes
const MAX_NUMBER = 300000; // Complexity: ~1-2 seconds solve time on average device

const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
) => {
  // CORS headers for all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const hmacKey = process.env.ALTCHA_HMAC_KEY;

    if (!hmacKey) {
      console.error("Missing ALTCHA_HMAC_KEY environment variable");
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    // Create challenge with expiry timestamp in params
    const expires = new Date(Date.now() + CHALLENGE_EXPIRY_SECONDS * 1000);

    const challenge = await createChallenge({
      hmacKey,
      maxNumber: MAX_NUMBER,
      expires,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        ...corsHeaders,
      },
      body: JSON.stringify(challenge),
    };
  } catch (error) {
    console.error("ALTCHA challenge generation error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
      body: JSON.stringify({ error: "Failed to generate challenge" }),
    };
  }
};

export { handler };
