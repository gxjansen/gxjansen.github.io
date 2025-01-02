import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatPosts, arePostsRelated, countItems, sortByValue, type BlogPost } from '../blogUtils';

// Mock the dependencies
vi.mock('../localeUtils', () => ({
  removeLocaleFromSlug: (slug: string) => slug.replace(/^[a-z]{2}\//, ''),
  filterCollectionByLanguage: vi.fn()
}));

vi.mock('../textUtils', () => ({
  slugify: (text: string) => text.toLowerCase()
}));

vi.mock('@config/siteSettings.json', () => ({
  locales: ['en', 'nl']
}));

// Mock blog posts
const mockPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'en/first-post',
    data: {
      title: 'First Post',
      description: 'First post description',
      pubDate: new Date('2023-01-01'),
      heroImage: {
        src: '/images/first.jpg',
        width: 800,
        height: 600,
        format: 'jpg'
      },
      categories: ['Tech', 'Development'],
      authors: [{ id: 'author1' }]
    }
  },
  {
    id: '2',
    slug: 'en/future-post',
    data: {
      title: 'Future Post',
      description: 'Future post description',
      pubDate: new Date('2025-01-01'),
      heroImage: {
        src: '/images/future.jpg',
        width: 800,
        height: 600,
        format: 'jpg'
      },
      categories: ['Tech', 'AI'],
      authors: [{ id: 'author1' }]
    }
  },
  {
    id: '3',
    slug: 'en/second-post',
    data: {
      title: 'Second Post',
      description: 'Second post description',
      pubDate: new Date('2023-06-01'),
      updatedDate: new Date('2023-07-01'),
      heroImage: {
        src: '/images/second.jpg',
        width: 800,
        height: 600,
        format: 'jpg'
      },
      categories: ['Development', 'Tutorial'],
      authors: [{ id: 'author2' }]
    }
  }
];

describe('blogUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set a fixed date for all tests
    vi.setSystemTime(new Date('2024-01-01'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatPosts', () => {
    it('filters out future posts by default', () => {
      const result = formatPosts(mockPosts);
      expect(result).toHaveLength(2);
      expect(result.map(post => post.id)).not.toContain('2'); // Future post
    });

    it('includes future posts when filterOutFuturePosts is false', () => {
      const result = formatPosts(mockPosts, { filterOutFuturePosts: false });
      expect(result).toHaveLength(3);
      expect(result.map(post => post.id)).toContain('2'); // Future post
    });

    it('sorts posts by date in descending order by default', () => {
      const result = formatPosts(mockPosts, { filterOutFuturePosts: false });
      expect(result[0].id).toBe('2'); // Future post (2025)
      expect(result[1].id).toBe('3'); // Second post (2023-06)
      expect(result[2].id).toBe('1'); // First post (2023-01)
    });

    it('removes locale from slugs by default', () => {
      const result = formatPosts(mockPosts);
      result.forEach(post => {
        expect(post.slug).not.toMatch(/^[a-z]{2}\//);
      });
    });

    it('keeps locale in slugs when removeLocale is false', () => {
      const result = formatPosts(mockPosts, { removeLocale: false });
      result.forEach(post => {
        expect(post.slug).toMatch(/^[a-z]{2}\//);
      });
    });

    it('limits the number of posts when limit is specified', () => {
      const result = formatPosts(mockPosts, { limit: 1 });
      expect(result).toHaveLength(1);
    });
  });

  describe('arePostsRelated', () => {
    it('returns true when posts share a category', () => {
      const result = arePostsRelated(mockPosts[0], mockPosts[2]); // Both have 'Development'
      expect(result).toBe(true);
    });

    it('returns false when posts have no shared categories', () => {
      // Future post with AI category vs Second post with Tutorial category
      const result = arePostsRelated(mockPosts[1], mockPosts[2]);
      expect(result).toBe(false);
    });

    it('returns false when comparing a post with itself', () => {
      const result = arePostsRelated(mockPosts[0], mockPosts[0]);
      expect(result).toBe(false);
    });
  });

  describe('countItems', () => {
    it('counts occurrences of items', () => {
      const items = ['Tech', 'Development', 'Tech', 'AI'];
      const result = countItems(items) as Record<string, { original: string; count: number }>;
      expect(result.tech).toEqual({ original: 'Tech', count: 2 });
      expect(result.development).toEqual({ original: 'Development', count: 1 });
      expect(result.ai).toEqual({ original: 'AI', count: 1 });
    });

    it('handles empty array', () => {
      const result = countItems([]);
      expect(result).toEqual({});
    });

    it('handles case differences', () => {
      const items = ['Tech', 'TECH', 'tech'];
      const result = countItems(items) as Record<string, { original: string; count: number }>;
      expect(result.tech.count).toBe(3);
    });
  });

  describe('sortByValue', () => {
    it('sorts items by count in descending order', () => {
      const input = {
        tech: { original: 'Tech', count: 3 },
        development: { original: 'Development', count: 1 },
        ai: { original: 'AI', count: 2 }
      };
      const result = sortByValue(input);
      expect(result).toEqual([
        ['tech', 'Tech', 3],
        ['ai', 'AI', 2],
        ['development', 'Development', 1]
      ]);
    });

    it('handles empty object', () => {
      const result = sortByValue({});
      expect(result).toEqual([]);
    });
  });
});
