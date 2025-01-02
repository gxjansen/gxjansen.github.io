import { describe, it, expect } from 'vitest';
import { isEventRole, isPresentation, validatePresentation } from '../typeGuards';

describe('typeGuards', () => {
  describe('isEventRole', () => {
    it('returns true for valid event roles', () => {
      const validRoles = [
        "Presenter",
        "Event host/moderator",
        "Main event organizer",
        "Event co-organizer",
        "Podcast livestream host",
        "Panellist",
        "Speaker",
        "Co-hosting Commerce Sneaks"
      ];

      validRoles.forEach(role => {
        expect(isEventRole(role)).toBe(true);
      });
    });

    it('returns false for invalid event roles', () => {
      const invalidRoles = [
        'Invalid Role',
        'presenter', // wrong case
        123,
        null,
        undefined,
        {},
        [],
        true,
        ''
      ];

      invalidRoles.forEach(role => {
        expect(isEventRole(role)).toBe(false);
      });
    });
  });

  describe('isPresentation', () => {
    const validPresentation = {
      title: 'Test Presentation',
      slug: 'test-presentation',
      description: 'A test presentation',
      duration: '30 minutes',
      isWorkshop: false,
      isFeatured: false,
      image: '/images/test.jpg',
      relatedEventSlugs: ['event-1', 'event-2']
    };

    it('returns true for valid presentation', () => {
      expect(isPresentation(validPresentation)).toBe(true);
    });

    it('returns true for valid presentation with optional fields', () => {
      const presentationWithOptional = {
        ...validPresentation,
        intendedAudience: 'Developers',
        slideshareKey: 'abc123',
        youtubeId: 'xyz789'
      };
      expect(isPresentation(presentationWithOptional)).toBe(true);
    });

    it('returns false for invalid presentations', () => {
      const invalidPresentations = [
        null,
        undefined,
        123,
        'string',
        [],
        {},
        { ...validPresentation, title: 123 }, // wrong type for title
        { ...validPresentation, isWorkshop: 'true' }, // wrong type for boolean
        { ...validPresentation, relatedEventSlugs: 'not-an-array' }, // wrong type for array
        { ...validPresentation, relatedEventSlugs: [1, 2, 3] }, // wrong type in array
        { ...validPresentation, intendedAudience: 123 }, // wrong type for optional field
      ];

      invalidPresentations.forEach(presentation => {
        expect(isPresentation(presentation)).toBe(false);
      });
    });
  });

  describe('validatePresentation', () => {
    const validPresentation = {
      title: 'Test Presentation',
      slug: 'test-presentation',
      description: 'A test presentation',
      duration: '30 minutes',
      isWorkshop: false,
      isFeatured: false,
      image: '/images/test.jpg',
      relatedEventSlugs: ['event-1', 'event-2']
    };

    it('returns empty array for valid presentation', () => {
      const errors = validatePresentation(validPresentation);
      expect(errors).toHaveLength(0);
    });

    it('returns empty array for valid presentation with optional fields', () => {
      const presentationWithOptional = {
        ...validPresentation,
        intendedAudience: 'Developers',
        slideshareKey: 'abc123',
        youtubeId: 'xyz789'
      };
      const errors = validatePresentation(presentationWithOptional);
      expect(errors).toHaveLength(0);
    });

    it('validates required fields', () => {
      const stringFields = ['title', 'slug', 'description', 'duration', 'image'];
      const booleanFields = ['isWorkshop', 'isFeatured'];

      // Test string fields
      stringFields.forEach(field => {
        const invalidPresentation = { ...validPresentation };
        delete invalidPresentation[field];
        const errors = validatePresentation(invalidPresentation);
        expect(errors).toContain(`${field} field is required and must not be empty`);
      });

      // Test boolean fields
      booleanFields.forEach(field => {
        const invalidPresentation = { ...validPresentation };
        delete invalidPresentation[field];
        const errors = validatePresentation(invalidPresentation);
        expect(errors).toContain(`${field} field must be a boolean`);
      });
    });

    it('validates empty strings', () => {
      const stringFields = ['title', 'slug', 'description', 'duration', 'image'];

      stringFields.forEach(field => {
        const invalidPresentation = { 
          ...validPresentation,
          [field]: '   ' // empty string with whitespace
        };
        const errors = validatePresentation(invalidPresentation);
        expect(errors).toContain(`${field} field is required and must not be empty`);
      });
    });

    it('validates optional fields when present', () => {
      const optionalFields = {
        intendedAudience: '   ',
        slideshareKey: '   ',
        youtubeId: '   '
      };

      Object.entries(optionalFields).forEach(([field, value]) => {
        const invalidPresentation = { 
          ...validPresentation,
          [field]: value
        };
        const errors = validatePresentation(invalidPresentation);
        expect(errors).toContain(`${field} field if provided must not be empty`);
      });
    });

    it('validates relatedEventSlugs array', () => {
      const invalidArrays = [
        undefined,
        null,
        'not-an-array',
        [123, 456],
        ['valid', '', 'invalid'],
        ['valid', '   ', 'invalid']
      ];

      invalidArrays.forEach(array => {
        const invalidPresentation = {
          ...validPresentation,
          relatedEventSlugs: array
        };
        const errors = validatePresentation(invalidPresentation);
        expect(errors.some(error => error.includes('relatedEventSlugs'))).toBe(true);
      });
    });

    it('validates slug format', () => {
      const invalidSlugs = [
        'Invalid Slug',
        'UPPERCASE-SLUG',
        'special@characters',
        '-starts-with-dash',
        'ends-with-dash-',
        'double--dash',
        'underscore_instead_of_dash'
      ];

      invalidSlugs.forEach(slug => {
        const invalidPresentation = {
          ...validPresentation,
          slug
        };
        const errors = validatePresentation(invalidPresentation);
        expect(errors).toContain('Slug must be in kebab-case format');
      });
    });

    it('accepts valid slug formats', () => {
      const validSlugs = [
        'valid-slug',
        'another-valid-slug',
        'with-123-numbers',
        'a',
        '123',
        'no-trailing-or-leading-dashes'
      ];

      validSlugs.forEach(slug => {
        const validPresentationWithSlug = {
          ...validPresentation,
          slug
        };
        const errors = validatePresentation(validPresentationWithSlug);
        expect(errors).not.toContain('Slug must be in kebab-case format');
      });
    });
  });
});
