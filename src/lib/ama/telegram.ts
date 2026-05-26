/**
 * Telegram Bot API helpers for the AMA pipeline.
 *
 * Shared between the submit endpoint (initial sendPhoto) and the
 * webhook callback endpoint (regenerate / delete from inline keyboard).
 */
import crypto from "node:crypto";

const TG_API = "https://api.telegram.org";

export function adminTokenFor(id: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(`admin:${id}`)
    .digest("hex")
    .slice(0, 16);
}

export function adminUrlFor(id: string, token: string): string {
  return `https://gui.do/ama/q/${id}?t=${token}`;
}

export function captionFor(question: string, adminUrl: string): string {
  // Telegram captions cap at 1024 chars; question is ≤500 so plenty of room.
  return `New AMA question:\n\n"${question}"\n\nAdmin: ${adminUrl}`;
}

/**
 * Inline keyboard attached to every AMA photo message.
 *
 * Two callback buttons + one URL button:
 * - Regenerate: tap to re-roll variant/persona/adjective and edit the
 *   image in place (no new message).
 * - Delete: tap to remove the question from the store and from the chat.
 * - Open admin: opens /ama/q/[id] in a browser for download/manual work.
 *
 * callback_data must be ≤64 bytes; "regen:<8-hex-id>" = 14 bytes, fine.
 */
export function keyboardFor(id: string, adminUrl: string) {
  return {
    inline_keyboard: [
      [
        { text: "🎲 Regenerate", callback_data: `regen:${id}` },
        { text: "🗑 Delete", callback_data: `delete:${id}` },
      ],
      [{ text: "Open admin →", url: adminUrl }],
    ],
  };
}

type SendPhotoArgs = {
  botToken: string;
  chatId: string;
  png: Buffer;
  caption: string;
  filename: string;
  keyboard: ReturnType<typeof keyboardFor>;
};

export async function sendPhoto(args: SendPhotoArgs): Promise<Response> {
  const form = new FormData();
  form.append("chat_id", args.chatId);
  form.append("caption", args.caption);
  form.append("reply_markup", JSON.stringify(args.keyboard));
  form.append(
    "photo",
    new Blob([new Uint8Array(args.png)], { type: "image/png" }),
    args.filename,
  );
  return fetch(`${TG_API}/bot${args.botToken}/sendPhoto`, {
    method: "POST",
    body: form,
  });
}

type EditPhotoArgs = {
  botToken: string;
  chatId: number | string;
  messageId: number;
  png: Buffer;
  caption: string;
  filename: string;
  keyboard: ReturnType<typeof keyboardFor>;
};

/**
 * Replace the photo on an existing message in place.
 * Telegram requires the new media to be re-uploaded via multipart with
 * an attach:// reference from the InputMediaPhoto JSON.
 */
export async function editMessageMedia(args: EditPhotoArgs): Promise<Response> {
  const form = new FormData();
  form.append("chat_id", String(args.chatId));
  form.append("message_id", String(args.messageId));
  form.append(
    "media",
    JSON.stringify({
      type: "photo",
      media: "attach://photo",
      caption: args.caption,
    }),
  );
  form.append("reply_markup", JSON.stringify(args.keyboard));
  form.append(
    "photo",
    new Blob([new Uint8Array(args.png)], { type: "image/png" }),
    args.filename,
  );
  return fetch(`${TG_API}/bot${args.botToken}/editMessageMedia`, {
    method: "POST",
    body: form,
  });
}

export async function deleteMessage(
  botToken: string,
  chatId: number | string,
  messageId: number,
): Promise<Response> {
  return fetch(`${TG_API}/bot${botToken}/deleteMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
  });
}

export async function answerCallbackQuery(
  botToken: string,
  callbackQueryId: string,
  text?: string,
): Promise<Response> {
  return fetch(`${TG_API}/bot${botToken}/answerCallbackQuery`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text ?? "",
    }),
  });
}
