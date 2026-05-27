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
  // Trailing slash matters: site's trailing-slash redirect runs with
  // force=false but the @astrojs/netlify SSR function's path:"/*" wins,
  // so /ama/q/<id> goes straight to Astro which doesn't match
  // (trailingSlash: 'always') and 404s. Bake the slash in here.
  return `https://gui.do/ama/q/${id}/?t=${token}`;
}

export function captionFor(question: string, adminUrl: string): string {
  // Telegram captions cap at 1024 chars; question is ≤500 so plenty of room.
  return `New AMA question:\n\n"${question}"\n\nAdmin: ${adminUrl}`;
}

/**
 * Bluesky compose intent URL.
 *
 * Layout in the composer body when a question is provided:
 *
 *   {question}
 *   <blank line, NBSP>
 *   gui.do/ama #ama
 *
 * The question is prefilled so Guido can cut it and paste it as the
 * image alt text in one motion. Footer always present so the answer
 * post is back-linkable to the AMA page.
 *
 * NBSP on the middle line — Android's Bluesky composer collapses
 * consecutive newlines into one. A non-breaking space makes the
 * line "non-empty" and survives, preserving the blank-row visual on
 * both desktop and Android. Renders identically on desktop where the
 * collapse doesn't happen.
 *
 * Note on the hashtag: Firefox-for-Android's URL handler strips the
 * `#ama` portion when handing off to Bluesky, because it parses the
 * decoded `#` as a URL fragment. Accepted trade-off — the auto-tag
 * works on desktop where most answers happen, and posts stay
 * discoverable via the gui.do/ama URL.
 *
 * Bluesky's compose intent only accepts `text=`. There's no way to
 * pre-attach an image, so this is a tab-switch + manual image attach.
 */
export function blueskyComposeUrl(question?: string): string {
  const footer = "gui.do/ama #ama";
  const blank = "\n \n";
  const body = question ? `${question}${blank}${footer}` : `${blank}${footer}`;
  return `https://bsky.app/intent/compose?text=${encodeURIComponent(body)}`;
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
export function keyboardFor(id: string, adminUrl: string, question?: string) {
  return {
    inline_keyboard: [
      [
        { text: "🎲 Regenerate", callback_data: `regen:${id}` },
        { text: "🗑 Delete", callback_data: `delete:${id}` },
      ],
      [
        { text: "🦋 Post on Bluesky", url: blueskyComposeUrl(question) },
        { text: "Open admin →", url: adminUrl },
      ],
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
