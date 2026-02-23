/**
 * Type definition for year strings (YYYY format)
 */
type YearString = string;

/**
 * Creates a DOM-safe ID from a year string
 * @param year - The year to create an ID for
 * @returns A DOM-safe ID string
 */
export const createYearAnchorId = (year: YearString): string => {
  return `year-${year}`;
};

/**
 * Creates a proper anchor href from a year string
 * @param year - The year to create an href for
 * @returns A properly formatted href string including the hash
 */
export const createYearAnchorHref = (year: YearString): string => {
  return `#${createYearAnchorId(year)}`;
};

/**
 * Creates a full URL for a year anchor, including the base URL
 * @param year - The year to create a URL for
 * @param baseUrl - The base URL of the site (optional)
 * @returns A complete URL string
 */
export const createYearFullUrl = (
  year: YearString,
  baseUrl?: string,
): string => {
  const anchor = createYearAnchorHref(year);
  return baseUrl ? `${baseUrl}${anchor}` : anchor;
};
