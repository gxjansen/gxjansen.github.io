import type { Presentation, EventRole } from '../types/presentations';

/**
 * Type guard to check if a value is a valid EventRole
 * @param value - Value to check
 * @returns True if value is a valid EventRole
 */
export function isEventRole(value: unknown): value is EventRole {
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
  return typeof value === 'string' && validRoles.includes(value);
}

/**
 * Type guard to check if a value is a valid Presentation
 * @param value - Value to check
 * @returns True if value matches Presentation interface
 */
export function isPresentation(value: unknown): value is Presentation {
  if (!value || typeof value !== 'object') return false;

  const presentation = value as Partial<Presentation>;

  // Check required fields
  if (
    typeof presentation.title !== 'string' ||
    typeof presentation.slug !== 'string' ||
    typeof presentation.description !== 'string' ||
    typeof presentation.duration !== 'string' ||
    typeof presentation.isWorkshop !== 'boolean' ||
    typeof presentation.isFeatured !== 'boolean' ||
    typeof presentation.image !== 'string' ||
    !Array.isArray(presentation.relatedEventSlugs)
  ) {
    return false;
  }

  // Check optional fields if present
  if (
    presentation.intendedAudience !== undefined &&
    typeof presentation.intendedAudience !== 'string'
  ) {
    return false;
  }

  if (
    presentation.slideshareKey !== undefined &&
    typeof presentation.slideshareKey !== 'string'
  ) {
    return false;
  }

  if (
    presentation.youtubeId !== undefined &&
    typeof presentation.youtubeId !== 'string'
  ) {
    return false;
  }

  // Check if relatedEventSlugs contains only strings
  if (!presentation.relatedEventSlugs.every(slug => typeof slug === 'string')) {
    return false;
  }

  return true;
}

/**
 * Validates a presentation object and returns validation errors
 * @param presentation - Presentation object to validate
 * @returns Array of validation error messages, empty if valid
 */
export function validatePresentation(presentation: unknown): string[] {
  const errors: string[] = [];

  if (!presentation || typeof presentation !== 'object') {
    return ['Invalid presentation: must be an object'];
  }

  const p = presentation as Partial<Presentation>;

  // Required fields
  if (!p.title?.trim()) errors.push('title field is required and must not be empty');
  if (!p.slug?.trim()) errors.push('slug field is required and must not be empty');
  if (!p.description?.trim()) errors.push('description field is required and must not be empty');
  if (!p.duration?.trim()) errors.push('duration field is required and must not be empty');
  if (typeof p.isWorkshop !== 'boolean') errors.push('isWorkshop field must be a boolean');
  if (typeof p.isFeatured !== 'boolean') errors.push('isFeatured field must be a boolean');
  if (!p.image?.trim()) errors.push('image field is required and must not be empty');
  
  // Optional fields validation
  if (p.intendedAudience !== undefined && !p.intendedAudience.trim()) {
    errors.push('intendedAudience field if provided must not be empty');
  }
  
  if (p.slideshareKey !== undefined && !p.slideshareKey.trim()) {
    errors.push('slideshareKey field if provided must not be empty');
  }
  
  if (p.youtubeId !== undefined && !p.youtubeId.trim()) {
    errors.push('youtubeId field if provided must not be empty');
  }

  // Array validation
  if (!Array.isArray(p.relatedEventSlugs)) {
    errors.push('relatedEventSlugs field must be an array');
  } else {
    if (!p.relatedEventSlugs.every(slug => typeof slug === 'string' && slug.trim())) {
      errors.push('relatedEventSlugs field must contain only non-empty strings');
    }
  }

  // Slug format validation
  if (p.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) {
    errors.push('Slug must be in kebab-case format');
  }

  return errors;
}
