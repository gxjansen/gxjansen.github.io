/**
 * Utility functions for press-related content formatting and handling
 */

/**
 * Formats a date string into a localized month and year format
 * @param date - ISO date string to format
 * @returns Formatted date string (e.g., "January 2024")
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Retrieves a favicon URL for a given website URL with fallback handling
 * @param url - Website URL to get favicon for
 * @returns URL to the website's favicon or fallback icon
 */
export function getFaviconUrl(url: string): string {
  try {
    // Default to our local fallback icon
    if (!url) return '/assets/document-icon.svg';
    
    const urlObj = new URL(url);
    // Only handle http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return '/assets/document-icon.svg';
    }
    
    // Use Google's favicon service with our fallback as the default
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32&default=/assets/document-icon.svg`;
  } catch {
    return '/assets/document-icon.svg';
  }
}
