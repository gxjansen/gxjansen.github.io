/**
 * URL Validation Tests for Data Files
 *
 * Validates that all external URLs in data files are reachable (not 404s).
 * This catches broken links before they reach production.
 *
 * Run with: npm test -- src/data/__tests__/validateUrls.test.ts
 */

import { describe, it, expect } from 'vitest';
import { indieProjects } from '../indieProjects';
import { socialLinks } from '../socialLinks';
import { pressCoverage } from '../press-coverage';
import events from '../events.json';

interface UrlToValidate {
  url: string;
  source: string;
  field: string;
}

/**
 * Collect all URLs from data files
 */
function collectUrls(): UrlToValidate[] {
  const urls: UrlToValidate[] = [];

  // Indie Projects
  indieProjects.forEach((project) => {
    if (project.link) {
      urls.push({
        url: project.link,
        source: `indieProjects: ${project.name}`,
        field: 'link'
      });
    }
    if (project.githubUrl) {
      urls.push({
        url: project.githubUrl,
        source: `indieProjects: ${project.name}`,
        field: 'githubUrl'
      });
    }
  });

  // Social Links
  socialLinks.forEach((link) => {
    if (link.href) {
      urls.push({
        url: link.href,
        source: `socialLinks: ${link.name}`,
        field: 'href'
      });
    }
  });

  // Press Coverage (sample - checking all would be slow)
  // Only check articleUrl and youtubeLink for recent items (last 20)
  const recentPress = pressCoverage.slice(0, 20);
  recentPress.forEach((item) => {
    if (item.articleUrl) {
      urls.push({
        url: item.articleUrl,
        source: `pressCoverage: ${item.title.substring(0, 50)}...`,
        field: 'articleUrl'
      });
    }
    if (item.youtubeLink) {
      urls.push({
        url: item.youtubeLink,
        source: `pressCoverage: ${item.title.substring(0, 50)}...`,
        field: 'youtubeLink'
      });
    }
  });

  // Events (sample - checking all would be slow)
  // Only check upcoming/recent events (first 20)
  const recentEvents = (events as Array<{ url?: string; name: string }>).slice(0, 20);
  recentEvents.forEach((event) => {
    if (event.url) {
      urls.push({
        url: event.url,
        source: `events: ${event.name}`,
        field: 'url'
      });
    }
  });

  return urls;
}

// Domains known to block automated requests or have bot detection
const SKIP_DOMAINS = [
  'instagram.com',
  'linkedin.com',
  'bsky.app',        // BlueSky has bot detection
  'signal.me',       // Signal links are special
  'soundcloud.com',  // Often blocks bots
  'x.com',
  'twitter.com'
];

/**
 * Check if URL should be skipped due to known bot blocking
 */
function shouldSkipUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return SKIP_DOMAINS.some(domain => hostname.includes(domain));
  } catch {
    return false;
  }
}

/**
 * Validate a single URL by making a HEAD request
 * Returns null if valid, error message if invalid
 */
async function validateUrl(urlInfo: UrlToValidate): Promise<string | null> {
  const { url, source, field } = urlInfo;

  // Skip empty URLs
  if (!url || url.trim() === '') {
    return null;
  }

  // Skip non-http URLs (like mailto:, tel:, etc.)
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return null;
  }

  // Skip domains known to block automated requests
  if (shouldSkipUrl(url)) {
    console.log(`  Skipping (bot-blocked domain): ${url}`);
    return null;
  }

  try {
    // Use a promise with timeout instead of AbortController
    // (AbortController doesn't work well in jsdom test environment)
    const fetchWithTimeout = async (fetchUrl: string, method: string): Promise<Response> => {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 15000);
      });

      const fetchPromise = fetch(fetchUrl, {
        method,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        redirect: 'follow'
      });

      return Promise.race([fetchPromise, timeoutPromise]);
    };

    const response = await fetchWithTimeout(url, 'HEAD');

    // Accept 2xx and 3xx status codes
    // Some sites return 405 for HEAD, so try GET as fallback
    if (response.status === 405) {
      const getResponse = await fetchWithTimeout(url, 'GET');

      if (getResponse.status === 404) {
        return `${source} [${field}]: ${url} returned 404 (Not Found)`;
      }
      // 403 and other errors might be bot blocking - warn but don't fail
      if (getResponse.status >= 400) {
        console.warn(`  Warning: ${url} returned ${getResponse.status} (may be bot blocking)`);
        return null;
      }
      return null;
    }

    // Only fail on actual 404s - the clearest signal of a broken link
    if (response.status === 404) {
      return `${source} [${field}]: ${url} returned 404 (Not Found)`;
    }

    // 403 and other 4xx might be bot blocking - warn but don't fail
    if (response.status >= 400) {
      console.warn(`  Warning: ${url} returned ${response.status} (may be bot blocking)`);
      return null;
    }

    return null;
  } catch (error) {
    // Network errors, timeouts, etc.
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Don't fail on timeouts or network errors - these might be temporary
    if (errorMessage.includes('timeout')) {
      console.warn(`  Warning: ${url} - timeout (skipped)`);
      return null;
    }

    // Network errors - warn but don't fail
    console.warn(`  Warning: ${url} - ${errorMessage} (skipped)`);
    return null;
  }
}

/**
 * Validate URLs with rate limiting to avoid overwhelming servers
 */
async function validateUrlsWithRateLimit(
  urls: UrlToValidate[],
  delayMs: number = 100
): Promise<string[]> {
  const errors: string[] = [];

  for (const urlInfo of urls) {
    const error = await validateUrl(urlInfo);
    if (error) {
      errors.push(error);
    }
    // Small delay between requests to be polite to servers
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  return errors;
}

describe('Data File URL Validation', () => {
  it('should have valid URLs in indieProjects', async () => {
    const urls = collectUrls().filter(u => u.source.startsWith('indieProjects'));

    console.log(`Validating ${urls.length} URLs from indieProjects...`);

    const errors = await validateUrlsWithRateLimit(urls, 200);

    if (errors.length > 0) {
      console.error('\nBroken URLs found in indieProjects:');
      errors.forEach(err => console.error(`  - ${err}`));
    }

    expect(errors).toEqual([]);
  }, 60000); // 60s timeout for this test

  it('should have valid URLs in socialLinks', async () => {
    const urls = collectUrls().filter(u => u.source.startsWith('socialLinks'));

    console.log(`Validating ${urls.length} URLs from socialLinks...`);

    const errors = await validateUrlsWithRateLimit(urls, 200);

    if (errors.length > 0) {
      console.error('\nBroken URLs found in socialLinks:');
      errors.forEach(err => console.error(`  - ${err}`));
    }

    expect(errors).toEqual([]);
  }, 60000);

  it('should have valid URLs in recent pressCoverage', async () => {
    const urls = collectUrls().filter(u => u.source.startsWith('pressCoverage'));

    console.log(`Validating ${urls.length} URLs from pressCoverage...`);

    const errors = await validateUrlsWithRateLimit(urls, 300);

    if (errors.length > 0) {
      console.error('\nBroken URLs found in pressCoverage:');
      errors.forEach(err => console.error(`  - ${err}`));
    }

    expect(errors).toEqual([]);
  }, 120000); // 2 min timeout

  it('should have valid URLs in recent events', async () => {
    const urls = collectUrls().filter(u => u.source.startsWith('events'));

    console.log(`Validating ${urls.length} URLs from events...`);

    const errors = await validateUrlsWithRateLimit(urls, 200);

    if (errors.length > 0) {
      console.error('\nBroken URLs found in events:');
      errors.forEach(err => console.error(`  - ${err}`));
    }

    expect(errors).toEqual([]);
  }, 60000);
});

// Export for potential use in CLI script
export { collectUrls, validateUrl, validateUrlsWithRateLimit };
