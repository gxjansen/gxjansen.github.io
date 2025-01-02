import { describe, it, expect } from 'vitest';
import { createYearAnchorId, createYearAnchorHref, createYearFullUrl } from '../linkHelpers';

describe('linkHelpers', () => {
  describe('createYearAnchorId', () => {
    it('creates a DOM-safe ID from a year string', () => {
      expect(createYearAnchorId('2024')).toBe('year-2024');
      expect(createYearAnchorId('2023')).toBe('year-2023');
    });

    it('handles different year formats', () => {
      // Even though we expect YYYY format, the function should handle other formats safely
      expect(createYearAnchorId('24')).toBe('year-24');
      expect(createYearAnchorId('99')).toBe('year-99');
    });

    it('handles non-numeric strings safely', () => {
      // The function should still create safe IDs even with unexpected input
      expect(createYearAnchorId('current')).toBe('year-current');
      expect(createYearAnchorId('')).toBe('year-');
    });
  });

  describe('createYearAnchorHref', () => {
    it('creates proper anchor hrefs from year strings', () => {
      expect(createYearAnchorHref('2024')).toBe('#year-2024');
      expect(createYearAnchorHref('2023')).toBe('#year-2023');
    });

    it('always prepends the hash symbol', () => {
      const href = createYearAnchorHref('2024');
      expect(href.startsWith('#')).toBe(true);
    });

    it('creates valid anchor hrefs', () => {
      const href = createYearAnchorHref('2024');
      // Check that it creates a valid anchor href that could be used in HTML
      expect(href).toMatch(/^#[\w-]+$/);
    });
  });

  describe('createYearFullUrl', () => {
    it('creates full URLs with base URL', () => {
      expect(createYearFullUrl('2024', 'https://example.com')).toBe('https://example.com#year-2024');
      expect(createYearFullUrl('2023', 'https://test.com/')).toBe('https://test.com/#year-2023');
    });

    it('handles base URLs with and without trailing slashes', () => {
      expect(createYearFullUrl('2024', 'https://example.com')).toBe('https://example.com#year-2024');
      expect(createYearFullUrl('2024', 'https://example.com/')).toBe('https://example.com/#year-2024');
    });

    it('returns just the anchor when no base URL is provided', () => {
      expect(createYearFullUrl('2024')).toBe('#year-2024');
      expect(createYearFullUrl('2023')).toBe('#year-2023');
    });

    it('handles empty base URL', () => {
      expect(createYearFullUrl('2024', '')).toBe('#year-2024');
    });
  });

  describe('edge cases and validation', () => {
    it('handles undefined year safely', () => {
      // @ts-expect-error Testing undefined input
      expect(() => createYearAnchorId(undefined)).not.toThrow();
      // @ts-expect-error Testing undefined input
      expect(() => createYearAnchorHref(undefined)).not.toThrow();
      // @ts-expect-error Testing undefined input
      expect(() => createYearFullUrl(undefined)).not.toThrow();
    });

    it('handles null year safely', () => {
      // @ts-expect-error Testing null input
      expect(() => createYearAnchorId(null)).not.toThrow();
      // @ts-expect-error Testing null input
      expect(() => createYearAnchorHref(null)).not.toThrow();
      // @ts-expect-error Testing null input
      expect(() => createYearFullUrl(null)).not.toThrow();
    });

    it('handles special characters in year strings', () => {
      const specialChars = '2024!@#$%^&*()';
      expect(createYearAnchorId(specialChars)).toBe(`year-${specialChars}`);
      expect(createYearAnchorHref(specialChars)).toBe(`#year-${specialChars}`);
      expect(createYearFullUrl(specialChars)).toBe(`#year-${specialChars}`);
    });
  });
});
