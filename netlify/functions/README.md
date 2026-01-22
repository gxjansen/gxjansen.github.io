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
  "signupPage": "/newsletter"
}
```

**Form data:**
- `email` (required): Subscriber email address
- `name` (optional): Subscriber name
- `l` or `listId` (optional): Listmonk list ID (default: 3 for "Guido's Golden Nuggets")
- `signupPage` (optional): Page where signup occurred (for tracking)

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

- `src/components/Newsletter/NewsletterForm.astro` - Frontend form component
- `src/pages/newsletter.astro` - Newsletter signup page

---

## getPodcastFeeds

Fetches and parses podcast RSS feeds. See function source for details.
