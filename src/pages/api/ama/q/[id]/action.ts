/**
 * Admin action endpoint for a single AMA question.
 *
 * POST with a form field `action` of "reroll-variant" | "reroll-persona" |
 * "delete". Gated by the same HMAC token as the view page. Redirects back
 * to the view on success.
 */
import type { APIRoute } from "astro";
import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";
import { pickRandomOverrides } from "../../../../../lib/ama/card";

export const prerender = false;

type StoredQuestion = {
  id: string;
  question: string;
  createdAt: string;
  ipHash?: string;
  variantId?: string;
  personaName?: string;
  adjective?: string;
};

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ params, request, url }) => {
  const id = params.id;
  const token = url.searchParams.get("t") ?? "";
  const secret = process.env.AMA_SIGNING_SECRET;

  if (!id || !secret) {
    return new Response("Not found", { status: 404 });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`admin:${id}`)
    .digest("hex")
    .slice(0, 16);

  if (!constantTimeEqual(token, expected)) {
    return new Response("Forbidden", { status: 403 });
  }

  const form = await request.formData();
  const action = String(form.get("action") ?? "");

  const store = getStore("ama-questions");
  const data = (await store.get(id, { type: "json" })) as StoredQuestion | null;

  if (!data) {
    return new Response("Question not found.", { status: 404 });
  }

  const adminUrl = `/ama/q/${id}/?t=${encodeURIComponent(token)}`;

  if (action === "delete") {
    await store.delete(id);
    return new Response(null, {
      status: 303,
      headers: { location: "/ama/" },
    });
  }

  if (action === "regenerate") {
    await store.setJSON(id, { ...data, ...pickRandomOverrides() });
    return new Response(null, {
      status: 303,
      headers: { location: adminUrl },
    });
  }

  return new Response("Unknown action", { status: 400 });
};
