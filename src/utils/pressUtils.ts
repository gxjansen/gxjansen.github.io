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
    
    const domain = new URL(url).hostname;
    // Use Google's favicon service with our fallback as the default
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32&default=/assets/document-icon.svg`;
  } catch {
    return '/assets/document-icon.svg';
  }
}
