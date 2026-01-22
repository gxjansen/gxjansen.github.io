# PRD: ALTCHA Newsletter Spam Protection

## Problem Statement

The newsletter signup form on gui.do is receiving a high volume of spam subscriptions. While double opt-in prevents these from becoming confirmed subscribers, the unconfirmed subscriber list is polluted with spam entries, and server resources are wasted sending confirmation emails to invalid addresses.

## Goals

1. Block automated spam submissions before they reach Listmonk
2. Maintain privacy-first approach (no external tracking services)
3. Minimal friction for legitimate users
4. Align with self-hosted infrastructure philosophy

## Non-Goals

- Blocking all spam (some will always get through)
- User behavior tracking or profiling
- Requiring JavaScript-disabled fallback (acceptable tradeoff)

## Solution: ALTCHA Integration

ALTCHA is a proof-of-work based captcha that:
- Requires no external services (self-contained)
- Is privacy-friendly (no tracking, no cookies)
- Works by making the client do computational work
- Is open source and auditable

### Architecture

```
Current:
[Form] → [Netlify Function] → [Listmonk API]

With ALTCHA:
[Form + ALTCHA Widget] → [Netlify Function (validate)] → [Listmonk API]
                              ↑
                    [Challenge Endpoint]
```

### Components

#### 1. Challenge Endpoint (`netlify/functions/altcha-challenge.ts`)

Generates cryptographic challenges for the widget.

**Request:** `GET /.netlify/functions/altcha-challenge`

**Response:**
```json
{
  "algorithm": "SHA-256",
  "challenge": "<hash>",
  "salt": "<random-salt>",
  "signature": "<hmac-signature>"
}
```

**Security:**
- Uses HMAC signing with secret key (env: `ALTCHA_HMAC_KEY`)
- Challenge expires after 5 minutes
- Salt includes timestamp for expiry validation

#### 2. Updated Subscribe Function (`netlify/functions/newsletter-subscribe.ts`)

Validates ALTCHA solution before processing subscription.

**New request field:**
```json
{
  "email": "user@example.com",
  "altcha": "<base64-encoded-solution>"
}
```

**Validation steps:**
1. Decode ALTCHA payload
2. Verify HMAC signature (proves challenge came from our server)
3. Check challenge hasn't expired
4. Verify proof-of-work solution is correct
5. Proceed with subscription if valid

#### 3. Frontend Widget (`NewsletterForm.astro`)

Adds ALTCHA widget to all form variants.

**Behavior:**
- Widget loads and fetches challenge from endpoint
- Solves proof-of-work in background (web worker)
- Shows subtle "Verifying..." indicator during solve
- Includes solution in form submission
- Graceful degradation: form still works if widget fails (reduced protection)

### Configuration

**Environment Variables (Netlify):**
```
ALTCHA_HMAC_KEY=<32+ character random string>
```

**Complexity Setting:**
- Default: 300,000 (1-2 seconds solve time on average device)
- Adjustable if spam persists or user complaints arise
- Higher = more bot protection, more user wait time

### User Experience

1. User lands on page with newsletter form
2. ALTCHA widget initializes invisibly
3. Widget fetches challenge and begins solving
4. User fills in email (solving happens in parallel)
5. By submit time, solution is usually ready
6. If not ready, brief "Verifying..." state (1-2 sec max)
7. Form submits with solution
8. Success/error message as before

**Mobile considerations:**
- Proof-of-work is CPU-bound
- Older devices may take 3-5 seconds
- Acceptable tradeoff vs spam volume

### Error Handling

| Scenario | Behavior |
|----------|----------|
| Challenge fetch fails | Form submits without ALTCHA (logged server-side) |
| Solution invalid | "Verification failed. Please try again." |
| Solution expired | "Please refresh and try again." |
| Widget JS fails to load | Form works without protection (graceful degradation) |

### Metrics (Future)

Track in server logs:
- Submissions with valid ALTCHA vs without
- Invalid ALTCHA attempts (potential bot indicator)
- Solve times (for complexity tuning)

### Security Considerations

1. **HMAC key rotation:** Can rotate `ALTCHA_HMAC_KEY` without downtime (old challenges fail gracefully)
2. **Replay attacks:** Salt includes timestamp; challenges expire after 5 minutes
3. **Brute force:** Proof-of-work makes bulk submissions expensive
4. **Fallback abuse:** Monitor submissions without ALTCHA; can make it mandatory if abused

### Implementation Plan

1. Add `altcha` npm dependency
2. Create `altcha-challenge.ts` Netlify function
3. Update `newsletter-subscribe.ts` with validation
4. Add ALTCHA widget to `NewsletterForm.astro`
5. Add `ALTCHA_HMAC_KEY` to Netlify environment
6. Test all form variants
7. Deploy and monitor

### Dependencies

- `altcha-lib`: Server-side challenge generation and validation (~15KB)
- No frontend dependencies (widget is vanilla JS from CDN or bundled)

### Rollback Plan

If issues arise:
1. Remove ALTCHA validation from `newsletter-subscribe.ts` (keep accepting submissions)
2. Widget continues to load but solution is ignored
3. Full rollback: revert all changes

## Success Criteria

- 90%+ reduction in spam/unconfirmed subscribers
- No increase in user complaints about signup friction
- Average solve time under 3 seconds on desktop
- Zero false rejections of legitimate users

## Timeline

- Implementation: 1-2 hours
- Testing: 30 minutes
- Deployment: Immediate after testing

## References

- [ALTCHA Documentation](https://altcha.org/docs/)
- [altcha-lib npm](https://www.npmjs.com/package/altcha-lib)
- [Listmonk API](https://listmonk.app/docs/apis/apis/)
