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
 * Flag with country information for proper accessibility
 */
export interface FlagWithCountry {
  image: ImageMetadata;
  countryCode: string;
  countryName: string;
}

/**
 * Map country codes to full names for alt text
 */
const countryNames: Record<string, string> = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'DE': 'Germany',
  'FR': 'France',
  'NL': 'Netherlands',
  'BE': 'Belgium',
  'ES': 'Spain',
  'IT': 'Italy',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'PL': 'Poland',
  'AT': 'Austria',
  'CH': 'Switzerland',
  'IE': 'Ireland',
  'PT': 'Portugal',
  'CZ': 'Czech Republic',
  'GR': 'Greece',
  'RO': 'Romania',
  'HU': 'Hungary',
  'SK': 'Slovakia',
  'BG': 'Bulgaria',
  'HR': 'Croatia',
  'SI': 'Slovenia',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'EE': 'Estonia',
  'LU': 'Luxembourg',
  'MT': 'Malta',
  'CY': 'Cyprus',
  'CA': 'Canada',
  'AU': 'Australia',
  'NZ': 'New Zealand',
  'JP': 'Japan',
  'CN': 'China',
  'IN': 'India',
  'BR': 'Brazil',
  'MX': 'Mexico',
  'AR': 'Argentina',
  'CL': 'Chile',
  'CO': 'Colombia',
  'ZA': 'South Africa',
  'SG': 'Singapore',
  'HK': 'Hong Kong',
  'TH': 'Thailand',
  'MY': 'Malaysia',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'VN': 'Vietnam',
  'KR': 'South Korea',
  'TR': 'Turkey',
  'IL': 'Israel',
  'AE': 'United Arab Emirates',
  'SA': 'Saudi Arabia',
  'EG': 'Egypt',
  'RU': 'Russia',
  'UA': 'Ukraine'
};

/**
 * Get all flags for an array of country codes with country information
 * @param countryCodes Array of ISO 3166-1 alpha-2 country codes
 * @returns Array of flag objects with images and country information
 */
export async function getAllFlags(countryCodes: string[]): Promise<FlagWithCountry[]> {
  const uniqueCountries = [...new Set(countryCodes)];
  const flagsWithCountry: FlagWithCountry[] = [];

  for (const countryCode of uniqueCountries) {
    const flag = await loadCountryFlag(countryCode);
    if (flag) {
      flagsWithCountry.push({
        image: flag,
        countryCode,
        countryName: countryNames[countryCode] || countryCode
      });
    }
  }

  return flagsWithCountry;
}

/**
 * Legacy function for backward compatibility - returns only images
 * @deprecated Use getAllFlags instead for better accessibility
 */
export async function getAllFlagImages(countryCodes: string[]): Promise<ImageMetadata[]> {
  const flagsWithCountry = await getAllFlags(countryCodes);
  return flagsWithCountry.map(f => f.image);
}