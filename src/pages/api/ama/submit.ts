/**
 * AMA submission endpoint.
 *
 * Pipeline: validate → altcha verify → rate-limit (per IP-hash) → render
 * question card PNG → store metadata in Netlify Blobs → push to Telegram
 * via sendPhoto with a signed admin-link in the caption.
 *
 * Returns { ok: true } on success, or { error: string } with 4xx/5xx.
 */
import type { APIRoute } from "astro";
import { verifySolution } from "altcha-lib";
import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";
import { renderAmaCard } from "../../../lib/ama/render";
import {
  adminTokenFor,
  adminUrlFor,
  captionFor,
  keyboardFor,
  sendPhoto,
} from "../../../lib/ama/telegram";

export const prerender = false;

const MIN_LEN = 10;
const MAX_LEN = 500;

// 5 questions per IP per rolling hour is plenty for legitimate use and
// keeps a single botnet node from filling the Telegram chat.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function hmac(secret: string, input: string): string {
  return crypto.createHmac("sha256", secret).update(input).digest("hex");
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      question?: unknown;
      altcha?: unknown;
    };
    const question =
      typeof body.question === "string" ? body.question.trim() : "";
    const altcha = typeof body.altcha === "string" ? body.altcha : undefined;

    if (question.length < MIN_LEN || question.length > MAX_LEN) {
      return json({ error: "Question must be 10–500 characters." }, 400);
    }
    if (/(https?:\/\/|www\.)/i.test(question)) {
      return json({ error: "Links aren't allowed in questions." }, 400);
    }

    const altchaKey = process.env.ALTCHA_HMAC_KEY;
    if (altchaKey) {
      if (!altcha) {
        return json({ error: "Verification required. Please refresh." }, 400);
      }
      const valid = await verifySolution(altcha, altchaKey).catch(() => false);
      if (!valid) {
        return json({ error: "Verification failed. Please refresh." }, 400);
      }
    }

    const signingSecret = process.env.AMA_SIGNING_SECRET;
    if (!signingSecret) {
      console.error("AMA_SIGNING_SECRET not configured");
      return json({ error: "Server misconfigured." }, 500);
    }

    // IP-hash: never store raw IPs. The hash is salted with the signing
    // secret so it can't be reversed via rainbow tables of common IPs.
    const ip = clientAddress || "0.0.0.0";
    const ipHash = hmac(signingSecret, `ip:${ip}`).slice(0, 24);

    const rl = getStore("ama-ratelimit");
    const prev = (await rl.get(ipHash, { type: "json" })) as {
      count: number;
      first: number;
    } | null;
    const now = Date.now();
    if (prev && now - prev.first < RATE_LIMIT_WINDOW_MS) {
      if (prev.count >= RATE_LIMIT_MAX) {
        return json(
          { error: "Too many questions. Try again in an hour." },
          429,
        );
      }
      await rl.setJSON(ipHash, { count: prev.count + 1, first: prev.first });
    } else {
      await rl.setJSON(ipHash, { count: 1, first: now });
    }

    const id = crypto.randomBytes(8).toString("hex");
    const png = await renderAmaCard(question);

    await getStore("ama-questions").setJSON(id, {
      id,
      question,
      createdAt: new Date().toISOString(),
      ipHash,
    });

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      const token = adminTokenFor(id, signingSecret);
      const adminUrl = adminUrlFor(id, token);
      const tgRes = await sendPhoto({
        botToken,
        chatId,
        png,
        caption: captionFor(question, adminUrl),
        filename: `ama-${id}.png`,
        keyboard: keyboardFor(id, adminUrl),
      });
      if (!tgRes.ok) {
        console.error(
          "Telegram sendPhoto failed:",
          tgRes.status,
          await tgRes.text().catch(() => "<no body>"),
        );
        // Don't 500 the submitter — the question is stored, we can retry
        // delivery later from the admin side.
      }
    } else {
      console.warn(
        "Telegram credentials not set — question stored but not delivered.",
      );
    }

    return json({ ok: true, id });
  } catch (e) {
    console.error("AMA submit error:", e);
    return json({ error: "Something went wrong. Try again." }, 500);
  }
};
