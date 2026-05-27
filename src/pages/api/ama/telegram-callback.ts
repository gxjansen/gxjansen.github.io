/**
 * Telegram webhook for AMA inline-keyboard callbacks.
 *
 * Receives `callback_query` updates when Guido taps [Regenerate] or
 * [Delete] on an AMA message. Validates the secret header set during
 * setWebhook, mutates state via the same code paths as the web admin
 * (pickRandomOverrides + blob store), edits the photo in place via
 * editMessageMedia, then answers the callback to dismiss the loading
 * spinner in the Telegram client.
 *
 * One-time setup (after deploying):
 *
 *   curl "https://api.telegram.org/bot<TOKEN>/setWebhook" \
 *     -d "url=https://gui.do/api/ama/telegram-callback/" \
 *     -d "secret_token=<SECRET>" \
 *     -d 'allowed_updates=["callback_query"]'
 *
 * Where <SECRET> matches the Netlify env var TELEGRAM_WEBHOOK_SECRET.
 */
import type { APIRoute } from "astro";
import { getStore } from "@netlify/blobs";
import { pickRandomOverrides, variants, personas } from "../../../lib/ama/card";
import { renderAmaCard, type RenderOverrides } from "../../../lib/ama/render";
import {
  adminTokenFor,
  adminUrlFor,
  captionFor,
  keyboardFor,
  editMessageMedia,
  deleteMessage,
  answerCallbackQuery,
} from "../../../lib/ama/telegram";

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

type CallbackQuery = {
  id: string;
  message?: {
    message_id: number;
    chat: { id: number | string };
  };
  data?: string;
};

type Update = {
  callback_query?: CallbackQuery;
};

function ok(): Response {
  // Telegram only checks 2xx; body is ignored.
  return new Response("ok", { status: 200 });
}

export const POST: APIRoute = async ({ request }) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const signingSecret = process.env.AMA_SIGNING_SECRET;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!botToken || !signingSecret || !webhookSecret) {
    const missing = [
      !botToken && "TELEGRAM_BOT_TOKEN",
      !signingSecret && "AMA_SIGNING_SECRET",
      !webhookSecret && "TELEGRAM_WEBHOOK_SECRET",
    ]
      .filter(Boolean)
      .join(", ");
    console.error("Telegram callback missing env vars:", missing);
    return new Response(`misconfigured: missing ${missing}`, { status: 500 });
  }

  // Telegram sets this header on every webhook call when secret_token
  // was passed to setWebhook. Defends against random POSTs to the URL.
  const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
  if (headerSecret !== webhookSecret) {
    return new Response("forbidden", { status: 403 });
  }

  const update = (await request.json().catch(() => ({}))) as Update;
  const cq = update.callback_query;
  if (!cq || !cq.data || !cq.message) {
    // Not a callback we handle — ack so Telegram stops retrying.
    return ok();
  }

  const [action, id] = cq.data.split(":");
  if (!action || !id) {
    await answerCallbackQuery(botToken, cq.id, "Invalid callback.");
    return ok();
  }

  const store = getStore("ama-questions");
  const data = (await store.get(id, { type: "json" })) as StoredQuestion | null;

  if (!data) {
    await answerCallbackQuery(botToken, cq.id, "Question no longer exists.");
    return ok();
  }

  const chatId = cq.message.chat.id;
  const messageId = cq.message.message_id;
  const token = adminTokenFor(id, signingSecret);
  const adminUrl = adminUrlFor(id, token);

  if (action === "delete") {
    await store.delete(id);
    await deleteMessage(botToken, chatId, messageId);
    await answerCallbackQuery(botToken, cq.id, "Deleted.");
    return ok();
  }

  if (action === "regen") {
    const next = pickRandomOverrides();
    const merged: StoredQuestion = { ...data, ...next };
    await store.setJSON(id, merged);

    const variant = variants.find((v) => v.id === next.variantId);
    const persona = personas.find((p) => p.name === next.personaName);
    const overrides: RenderOverrides = {
      variant,
      persona,
      adjective: next.adjective,
    };
    const png = await renderAmaCard(data.question, overrides);

    const editRes = await editMessageMedia({
      botToken,
      chatId,
      messageId,
      png,
      caption: captionFor(data.question, adminUrl),
      filename: `ama-${id}.png`,
      keyboard: keyboardFor(id, adminUrl, data.question),
    });
    if (!editRes.ok) {
      console.error(
        "Telegram editMessageMedia failed:",
        editRes.status,
        await editRes.text().catch(() => "<no body>"),
      );
      await answerCallbackQuery(botToken, cq.id, "Edit failed — see logs.");
      return ok();
    }
    await answerCallbackQuery(
      botToken,
      cq.id,
      `${next.adjective} ${next.personaName}`,
    );
    return ok();
  }

  await answerCallbackQuery(botToken, cq.id, "Unknown action.");
  return ok();
};
