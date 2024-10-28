// src/utils/flagUtils.ts
import type { ImageMetadata } from 'astro';

// Import flags as modules with correct typing for Astro's image handling
const flags = import.meta.glob<{ default: ImageMetadata }>('/src/assets/flags/*.svg', {
  eager: true // Make imports eager to ensure proper asset handling
});

/**
 * Load flag SVG for a country code
 * @param countryCode ISO 3166-1 alpha-2 country code
 * @returns Image metadata or null if failed
 */
export async function loadCountryFlag(countryCode: string): Promise<ImageMetadata | null> {
  try {
    // Special handling for GB which is stored as gb-eng in the package
    const adjustedCode = countryCode === 'GB' ? 'gb-eng' : countryCode.toLowerCase();
    
    // Construct the flag path
    const flagPath = `/src/assets/flags/${adjustedCode}.svg`;
    
    // Get the flag module
    const flagModule = flags[flagPath];
    
    if (!flagModule) {
      console.warn(`No flag found for country code: ${countryCode}`);
      return null;
    }

    // Return the ImageMetadata directly from the module
    return flagModule.default;
    
  } catch (error) {
    console.error(`Error loading flag for ${countryCode}:`, error);
    return null;
  }
}

/**
 * Get all flags for an array of country codes
 * @param countryCodes Array of ISO 3166-1 alpha-2 country codes
 * @returns Array of processed flag images
 */
export async function getAllFlags(countryCodes: string[]): Promise<ImageMetadata[]> {
  const uniqueCountries = [...new Set(countryCodes)];
  const flagImages: ImageMetadata[] = [];

  for (const countryCode of uniqueCountries) {
    const flag = await loadCountryFlag(countryCode);
    if (flag) {
      flagImages.push(flag);
    }
  }

  return flagImages;
}