# Netlify Functions

This directory contains serverless functions deployed to Netlify. All of them
use the Functions v2 API (default export taking a web `Request` and returning a
`Response`) and keep the default `/.netlify/functions/<name>` URL. Don't set a
custom `path` under `/.netlify`: those paths are reserved.

| Function | Method | Called from |
|----------|--------|-------------|
| `altcha-challenge` | GET | ALTCHA widget on `NewsletterForm.astro` and `/ama` |
| `newsletter-subscribe` | POST | `NewsletterForm.astro` |
| `newsletter-stats` | GET | `NewsletterForm.astro` (subscriber count) |
| `getPodcastFeeds` | GET | No caller in this repo; `/podcasts` bakes episodes in at build time via `src/lib/podcastFeeds.ts` |

Shared conventions:

- No CORS headers. Every caller is same-origin.
- Clients get generic error messages. Details (upstream status, exception messages) only go to the function log.
- Shared code lives in `_shared/`. Netlify only deploys top-level files, or a subdirectory's `index`/same-named file, as functions, so files in `_shared/` are bundled into their importers and never become functions of their own.
- `_shared/listmonk.ts` holds the Listmonk base URL (`LISTMONK_BASE_URL`, default `https://n.a11y.nl/api`) and builds the Basic-auth and Cloudflare bypass headers.
- Tests live in `src/test/<function>.test.ts`.
- Every env var is listed in the repo's `.env.example`.

## altcha-challenge

`GET /.netlify/functions/altcha-challenge` returns a fresh ALTCHA proof-of-work challenge signed with `ALTCHA_HMAC_KEY`:

```json
{
  "algorithm": "SHA-256",
  "challenge": "<hex>",
  "maxnumber": 300000,
  "salt": "<hex>?expires=<unix seconds>&",
  "signature": "<hex>"
}
```

- Challenges expire after 5 minutes and are sent with `Cache-Control: no-store`.
- Without `ALTCHA_HMAC_KEY` it returns 500 `{"error": "Server configuration error"}`.
- Methods other than GET return 405.

## newsletter-subscribe

Proxies newsletter subscription requests to the self-hosted Listmonk instance at `n.a11y.nl` (override with `LISTMONK_BASE_URL`).

### Endpoint

`POST /.netlify/functions/newsletter-subscribe`

### Request Format

Accepts both `application/json` and `application/x-www-form-urlencoded`.

**JSON:**
```json
{
  "email": "user@example.com",
  "name": "Optional Name",
  "listId": 3,
  "signupPage": "/newsletter",
  "altcha": "<solved ALTCHA payload>"
}
```

**Form data:**
- `email` (required): Subscriber email address
- `name` (optional): Subscriber name
- `l` or `listId` (optional): Listmonk list ID (default: 3 for "Guido's Golden Nuggets"). Only ids in `ALLOWED_LIST_IDS` are accepted; anything else returns 400.
- `signupPage` (optional): Page where signup occurred (for tracking)
- `altcha` (required): Solved ALTCHA challenge from `altcha-challenge`

### Abuse protection

- ALTCHA is mandatory. If `ALTCHA_HMAC_KEY` is unset the function returns 500 instead of skipping verification.
- Each solved challenge works once. Redeemed payloads are hashed into the `altcha-used-challenges` Netlify Blobs store.
- Netlify rate limit: 5 requests per minute per IP and domain (`config.rateLimit` in the function).
- Length caps: email 254, name 100, signupPage 200 characters.
- No CORS headers: the form calls the function same-origin.
- Listmonk error details stay in the function log; clients get a generic message.

### Subscription Flow

1. **Create subscriber** via `POST /api/subscribers`
   - Sets status to `enabled`
   - Adds custom attributes: `source`, `signup_page`, `signup_date`

2. **Add to list** via `PUT /api/subscribers/lists`
   - Uses dedicated endpoint for list membership management
   - Sets subscription status to `unconfirmed`

3. **Trigger opt-in** via `POST /api/subscribers/{id}/optin`
   - Sends double opt-in confirmation email to subscriber

### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Thanks! Please check your email to confirm your subscription."
}
```

**Already subscribed (200):**
```json
{
  "success": true,
  "message": "You're already subscribed! Check your inbox for updates."
}
```

**Error (400/500):**
```json
{
  "success": false,
  "error": "Error description"
}
```

### Environment Variables

Required in Netlify:

| Variable | Description |
|----------|-------------|
| `LISTMONK_API_USER` | Listmonk API username (e.g., `netlify-builds`) |
| `LISTMONK_API_KEY` | Listmonk API key/password |
| `ALTCHA_HMAC_KEY` | HMAC key shared with `altcha-challenge` |
| `CF_BYPASS_TOKEN` | Optional. Sent as `X-Bypass-Token` to get past Cloudflare in front of Listmonk |
| `LISTMONK_BASE_URL` | Optional. Listmonk API base URL, defaults to `https://n.a11y.nl/api` |

### Listmonk API User Permissions

The API user needs the following permissions in Listmonk (Settings > Users):

| Permission | Required For |
|------------|--------------|
| `subscribers:get` | Reading subscriber data |
| `subscribers:get_all` | Listing subscribers |
| `subscribers:manage` | Creating subscribers, triggering opt-in |
| `lists:manage_all` | Adding subscribers to lists |

### Custom Attributes

Each subscriber is created with these attributes for tracking:

```json
{
  "source": "gui.do",
  "signup_page": "/newsletter",
  "signup_date": "2025-01-22"
}
```

### Related Files

- `src/test/newsletter-subscribe.test.ts` - Unit tests

- `src/components/Newsletter/NewsletterForm.astro` - Frontend form component
- `src/pages/newsletter.astro` - Newsletter signup page

---

## newsletter-stats

`GET /.netlify/functions/newsletter-stats` returns the combined subscriber count (Listmonk subscribers plus standard.site subscribers counted via constellation):

```json
{ "success": true, "subscriberCount": 1234 }
```

- Each source is refreshed on every uncached call. If one fails, its last known value from the `subscriber-stats` Netlify Blobs store is used. `subscriberCount` is `null` only if neither source has ever answered.
- Listmonk is skipped when `LISTMONK_API_USER`/`LISTMONK_API_KEY` are unset.
- Cached for an hour (`Cache-Control: public, max-age=3600`).
- The form only shows the count when it is above 10.

## getPodcastFeeds

`GET /.netlify/functions/getPodcastFeeds` fetches the Sheeptank, CRO.CAFE and CRO.CAFE NL Transistor feeds and returns the 20 newest episodes that have a Transistor embed:

```json
[
  {
    "title": "Episode title",
    "description": "<p>Show notes</p>",
    "pubDate": "Mon, 05 Jan 2026 00:00:00 GMT",
    "duration": "1234",
    "link": "https://share.transistor.fm/e/<id>",
    "podcastName": "CRO.CAFE"
  }
]
```

- Each feed has a 5 second timeout. A failed feed is logged and skipped, so the others still come through.
- Caching: `Cache-Control: public, max-age=3600` for browsers, and `Netlify-CDN-Cache-Control: public, durable, s-maxage=3600, stale-while-revalidate=86400` so the CDN serves a cached copy for an hour and a stale one for up to a day while it refetches.
- An empty list (every feed failed) is sent with `no-store` so an outage isn't cached.
- Unexpected errors return 500 `{"error": "Failed to fetch podcast feeds"}`.
- `netlify.toml` sets `timeout = 30` under `[functions.getPodcastFeeds]` and lists `fast-xml-parser` in `external_node_modules`.
