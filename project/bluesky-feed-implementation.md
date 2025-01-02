# BlueSky Feed Integration

This document outlines the implementation plan for integrating BlueSky posts into the site's feed feature.

## Overview
BlueSky integration will fetch recent posts from a specified account using the AT Protocol (Authenticated Transfer Protocol) and format them for display in the main feed.

## Implementation Sections

### 1. Authentication Setup
- [ ] Create a Netlify Function for BlueSky authentication:
  ```typescript
  // netlify/functions/blueskyAuth.ts
  interface BlueSkyAuth {
    identifier: string;    // username/email
    password: string;      // app password
    accessJwt: string;     // session token
    refreshJwt: string;    // refresh token
  }
  ```
- [ ] Store credentials securely:
  - Add to Netlify environment variables:
    ```env
    BLUESKY_IDENTIFIER=your-username.bsky.social
    BLUESKY_APP_PASSWORD=your-app-specific-password
    ```
  - Never expose credentials in client-side code

**Validation:**
1. Test authentication flow
2. Verify secure credential storage
3. Confirm token refresh works
4. Check error handling

### 2. API Integration
- [ ] Create BlueSky API utility in `src/utils/blueskyUtils.ts`:
  ```typescript
  interface BlueSkyPost {
    uri: string;
    cid: string;
    author: {
      did: string;
      handle: string;
      displayName?: string;
      avatar?: string;
    };
    record: {
      text: string;
      createdAt: string;
      embed?: {
        images?: Array<{
          alt?: string;
          image: {
            ref: { $link: string };
          };
        }>;
      };
    };
  }

  class BlueSkyAPI {
    private baseUrl = 'https://bsky.social/xrpc/';
    private session: BlueSkyAuth | null = null;

    async authenticate(): Promise<void>;
    async refreshSession(): Promise<void>;
    async getAuthorFeed(author: string, limit: number): Promise<BlueSkyPost[]>;
    async formatPostsForFeed(posts: BlueSkyPost[]): Promise<BaseFeedItem[]>;
  }
  ```

- [ ] Implement rate limiting:
  ```typescript
  class RateLimiter {
    private requestCount: number = 0;
    private lastReset: number = Date.now();
    private readonly limit: number = 100; // requests
    private readonly interval: number = 300000; // 5 minutes

    async checkLimit(): Promise<boolean>;
    async resetLimit(): Promise<void>;
  }
  ```

- [ ] Add caching layer:
  ```typescript
  interface CacheConfig {
    ttl: number;          // Time to live in seconds
    maxSize: number;      // Maximum cache size
    updateInterval: number; // Update frequency
  }
  ```

**Validation:**
1. API calls work correctly
2. Rate limiting prevents API exhaustion
3. Caching improves performance
4. Error states handled gracefully

### 3. Netlify Function Implementation
- [ ] Create BlueSky fetch function:
  ```typescript
  // netlify/functions/getBlueSkyFeed.ts
  import { BlueSkyAPI, RateLimiter } from '../../src/utils/blueskyUtils';

  export async function handler(event: HandlerEvent): Promise<HandlerResponse> {
    const api = new BlueSkyAPI();
    const limiter = new RateLimiter();

    try {
      if (!(await limiter.checkLimit())) {
        return {
          statusCode: 429,
          body: JSON.stringify({ error: 'Failed to fetch BlueSky posts: Rate limit exceeded' })
        };
      }

      await api.authenticate();
      const posts = await api.getAuthorFeed('guido.bsky.social', 20); // Match podcast feed limit
      const feedItems = await api.formatPostsForFeed(posts);

      // Sort by date descending
      const sortedItems = feedItems.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Allow CORS during development
        },
        body: JSON.stringify(sortedItems)
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }
  ```

**Validation:**
1. Function deploys successfully
2. Authentication works
3. Posts are fetched and formatted correctly
4. Error handling works as expected

### 4. Feed Integration & Caching
- [ ] Update feed utilities to include BlueSky posts:
  ```typescript
  // src/utils/feedUtils.ts
  // Cache configuration
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  let cachedPosts: BaseFeedItem[] = [];
  let lastFetch: number = 0;

  async function getBlueSkyPosts(): Promise<BaseFeedItem[]> {
    try {
      // Check cache first
      const now = Date.now();
      if (cachedPosts.length && now - lastFetch < CACHE_TTL) {
        return cachedPosts;
      }

      const response = await fetch('/.netlify/functions/getBlueSkyFeed');
      if (!response.ok) throw new Error('Failed to fetch BlueSky posts');
      
      const posts = await response.json();
      cachedPosts = posts;
      lastFetch = now;
      
      return posts;
    } catch (error) {
      console.error('BlueSky fetch error:', error);
      // Return cached posts on error if available
      return cachedPosts.length ? cachedPosts : [];
    }
  }
  ```

**Validation:**
1. Posts appear correctly in feed
2. Error states don't break the feed
3. Dates sort correctly with other feed items
4. Performance impact is minimal

### 5. Error Handling & Fallbacks
- [ ] Implement comprehensive error handling:
  - Authentication failures
  - Rate limit exceeded
  - Network errors
  - API changes/breaking changes
- [ ] Add fallback states:
  - Show cached content when API is unavailable
  - Graceful degradation when BlueSky is down
  - Clear error messages for users

**Validation:**
1. All error states handled gracefully
2. Fallbacks work as expected
3. User experience remains smooth
4. Error messages are user-friendly

### 6. Testing & Documentation
- [ ] Write tests:
  ```typescript
  // src/utils/__tests__/blueskyUtils.test.ts
  describe('BlueSky API', () => {
    test('authentication flow');
    test('rate limiting');
    test('post fetching');
    test('error handling');
    test('cache behavior');
  });
  ```
- [ ] Add documentation:
  - API integration details
  - Rate limiting strategy
  - Cache implementation
  - Error handling approach

**Validation:**
1. All tests pass
2. Documentation is complete
3. Code coverage meets standards
4. PR review approval

## Final Validation Checklist
Before marking the integration as complete:

- [ ] Authentication works reliably
- [ ] Rate limiting prevents API abuse
- [ ] Caching improves performance
- [ ] Error handling is comprehensive
- [ ] Tests are passing
- [ ] Documentation is complete
- [ ] Security review passed
- [ ] Performance impact acceptable
- [ ] Integration tested in all environments:
  - [ ] Development
  - [ ] Staging
  - [ ] Production

## Security Considerations
1. Credentials stored securely in environment variables
2. No sensitive data exposed to client
3. Rate limiting prevents abuse
4. Token refresh handled securely
5. Error messages don't leak sensitive information

## Performance Considerations
1. Implement caching to reduce API calls
2. Rate limiting to prevent API exhaustion
3. Efficient error handling
4. Minimal client-side processing
5. Proper memory management for cache

## Maintenance Notes
- Monitor API usage and adjust rate limits if needed
- Keep authentication tokens secure and rotated
- Watch for API changes/updates
- Monitor error rates and patterns
- Update caching strategy based on usage patterns
