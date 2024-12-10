/**
 * Represents a single press coverage item (video, podcast, or article)
 */
export interface PressCoverage {
  /** Title of the content */
  title: string;
  /** Publication date in ISO format */
  publicationDate: string;
  /** Name of person or organization associated with the content */
  personOrganization?: string;
  /** URL to the article or content */
  articleUrl?: string;
  /** YouTube video ID or full URL */
  youtubeLink?: string;
  /** Spotify episode ID for podcast embeds */
  spotifyEmbedId?: string;
}
