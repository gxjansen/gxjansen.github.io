// src/utils/flagUtils.ts
import type { ImageMetadata } from 'astro';

/**
 * Load flag SVG for a country code
 * @param countryCode ISO 3166-1 alpha-2 country code
 * @returns Image metadata or null if failed
 */
export async function loadCountryFlag(countryCode: string): Promise<ImageMetadata | null> {
  try {
    // Special handling for GB which is stored as gb-eng in the package
    const adjustedCode = countryCode === 'GB' ? 'gb-eng' : countryCode.toLowerCase();
    
    // Use _flags prefix to avoid router conflicts
    const flagUrl = `/_flags/${adjustedCode}.svg`;
    
    return {
      src: flagUrl,
      width: 600,
      height: 360,
      format: 'svg'
    };
  } catch (error) {
    console.error(`Error loading flag for ${countryCode}:`, error);
    return null;
  }
}

// ... keep getAllFlags function as is ...

/**
 * Get all flags for an array of country codes
 * @param countryCodes Array of ISO 3166-1 alpha-2 country codes
 * @returns Array of processed flag images
 */
export async function getAllFlags(countryCodes: string[]): Promise<ImageMetadata[]> {
  const uniqueCountries = [...new Set(countryCodes)];
  const flags: ImageMetadata[] = [];

  for (const countryCode of uniqueCountries) {
    const flag = await loadCountryFlag(countryCode);
    if (flag) {
      flags.push(flag);
    }
  }

  return flags;
}