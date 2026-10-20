# Netlify Functions

This directory contains serverless functions deployed to Netlify.

## newsletter-subscribe

Proxies newsletter subscription requests to the self-hosted Listmonk instance at `n.a11y.nl`.

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

## getPodcastFeeds

Fetches and parses podcast RSS feeds. See function source for details.
