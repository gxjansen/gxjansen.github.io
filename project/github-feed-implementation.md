# Github Feed Implementation

This document details the implementation of Github activity integration for the feed feature.

## API Integration

### Events API Endpoint
```typescript
// Endpoint: GET https://api.github.com/users/{username}/events
interface GithubEvent {
  id: string;
  type: string;
  created_at: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  // Other event-specific fields
}

async function fetchGithubEvents(username: string, etag?: string): Promise<GithubEvent[]> {
  const headers: HeadersInit = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (etag) {
    headers['If-None-Match'] = etag;
  }

  const response = await fetch(`https://api.github.com/users/${username}/events`, {
    headers
  });

  // Handle 304 Not Modified
  if (response.status === 304) {
    return [];
  }

  // Store new ETag for future requests
  const newEtag = response.headers.get('ETag');
  
  // Get polling interval for rate limiting
  const pollInterval = parseInt(response.headers.get('X-Poll-Interval') || '60', 10);

  // Only events from past 90 days are included
  const events = await response.json();
  return events;
}
```

### Event Transformation
```typescript
function transformGithubEvents(events: GithubEvent[]): BaseFeedItem[] {
  return events.map(event => {
    // Base properties all events share
    const baseItem: BaseFeedItem = {
      id: event.id,
      date: new Date(event.created_at),
      source: 'github',
      icon: 'tabler/outline/brand-github',
      url: `https://github.com/${event.actor.login}`,
    };

    // Event-specific transformations
    switch (event.type) {
      case 'PushEvent':
        return {
          ...baseItem,
          title: `Pushed to repository`,
          description: event.payload.commits?.[0]?.message,
          url: event.payload.commits?.[0]?.url || baseItem.url
        };
      case 'CreateEvent':
        return {
          ...baseItem,
          title: `Created ${event.payload.ref_type}`,
          description: event.payload.ref,
          url: `https://github.com/${event.repo.name}`
        };
      // Add other event types as needed
      default:
        return {
          ...baseItem,
          title: `GitHub activity`,
          description: `New ${event.type}`
        };
    }
  });
}
```

### Rate Limiting
```typescript
class GithubRateLimiter {
  private lastPollTime: number = 0;
  private pollInterval: number = 60; // Default 60 seconds

  updatePollInterval(interval: number) {
    this.pollInterval = interval;
    this.lastPollTime = Date.now();
  }

  async waitForNextPoll(): Promise<void> {
    const timeSinceLastPoll = Date.now() - this.lastPollTime;
    const timeToWait = (this.pollInterval * 1000) - timeSinceLastPoll;
    
    if (timeToWait > 0) {
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }
  }
}
```

### Caching
```typescript
interface GithubCache {
  etag: string;
  data: GithubEvent[];
  timestamp: number;
}

class GithubEventCache {
  private cache: Map<string, GithubCache> = new Map();
  
  set(username: string, etag: string, data: GithubEvent[]) {
    this.cache.set(username, {
      etag,
      data,
      timestamp: Date.now()
    });
  }

  get(username: string): GithubCache | undefined {
    const cached = this.cache.get(username);
    if (!cached) return undefined;

    // Cache expires after 5 minutes
    if (Date.now() - cached.timestamp > 5 * 60 * 1000) {
      this.cache.delete(username);
      return undefined;
    }

    return cached;
  }
}
```

### Complete Service Implementation
```typescript
class GithubService {
  private rateLimiter: GithubRateLimiter;
  private cache: GithubEventCache;
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.rateLimiter = new GithubRateLimiter();
    this.cache = new GithubEventCache();
  }

  async getUserEvents(username: string): Promise<BaseFeedItem[]> {
    // Check cache first
    const cached = this.cache.get(username);
    
    // Wait for rate limit if needed
    await this.rateLimiter.waitForNextPoll();

    // Fetch events with ETag if we have cached data
    const events = await fetchGithubEvents(username, cached?.etag);
    
    if (events.length === 0 && cached) {
      // 304 Not Modified, use cached data
      return transformGithubEvents(cached.data);
    }

    // Update cache with new data
    if (events.length > 0) {
      const etag = response.headers.get('ETag');
      if (etag) {
        this.cache.set(username, etag, events);
      }
    }

    // Update rate limiter
    const pollInterval = parseInt(response.headers.get('X-Poll-Interval') || '60', 10);
    this.rateLimiter.updatePollInterval(pollInterval);

    // Transform and return events
    return transformGithubEvents(events);
  }
}

// Usage in feedUtils.ts:
const githubService = new GithubService(process.env.GITHUB_TOKEN);

export async function getGithubFeedItems(username: string): Promise<BaseFeedItem[]> {
  try {
    return await githubService.getUserEvents(username);
  } catch (error) {
    console.error('Failed to fetch Github events:', error);
    return [];
  }
}
```

## Implementation Notes

1. The Events API only returns events from the past 90 days
2. Use ETags for efficient caching and to respect rate limits
3. The X-Poll-Interval header indicates minimum time between requests
4. Cache responses for 5 minutes to reduce API calls
5. Transform all events into the common BaseFeedItem format
6. Handle rate limits gracefully to prevent API exhaustion
7. Implement proper error handling and fallbacks
