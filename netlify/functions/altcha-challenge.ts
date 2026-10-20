import { createChallenge } from "altcha-lib";

/**
 * ALTCHA Challenge Endpoint
 *
 * Generates cryptographic proof-of-work challenges for spam protection.
 * The challenge expires after 5 minutes (encoded in salt).
 * Uses HMAC signing to verify challenges came from this server.
 *
 * Fetched same-origin by the ALTCHA widget on NewsletterForm.astro and
 * ama.astro, so no CORS headers are sent.
 */

const CHALLENGE_EXPIRY_SECONDS = 300; // 5 minutes
const MAX_NUMBER = 300000; // Complexity: ~1-2 seconds solve time on average device

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      // Every challenge is single-use: never let a browser or the CDN reuse one.
      "Cache-Control": "no-store",
    },
  });
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  const hmacKey = process.env.ALTCHA_HMAC_KEY;
  if (!hmacKey) {
    console.error("Missing ALTCHA_HMAC_KEY environment variable");
    return json(500, { error: "Server configuration error" });
  }

  try {
    const challenge = await createChallenge({
      hmacKey,
      maxNumber: MAX_NUMBER,
      expires: new Date(Date.now() + CHALLENGE_EXPIRY_SECONDS * 1000),
    });
    return json(200, challenge);
  } catch (error) {
    console.error(
      "ALTCHA challenge generation error:",
      error instanceof Error ? error.message : error,
    );
    return json(500, { error: "Failed to generate challenge" });
  }
};
