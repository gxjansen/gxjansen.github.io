/**
 * Content category type
 * - 'award': Awards and recognitions
 * - 'nomination': Award nominations
 * - 'listing': Mentioned in a list (e.g., "Best podcasts", "Top experts")
 * - 'interview': True interviews, articles with contributed content (default)
 */
export type ContentCategory = 'award' | 'nomination' | 'listing' | 'interview';

/**
 * Represents a single press coverage item (video, podcast, or article)
 */
export interface PressCoverage {
  /** Title of the content */
  title: string;
  /** Publication date in ISO format */
  publicationDate: string;
  /** Language of the content */
  language?: string;
  /** Name of person or organization associated with the content */
  personOrganization?: string;
  /** URL to the article or content */
  articleUrl?: string;
  /** YouTube video ID or full URL */
  youtubeLink?: string;
  /** Spotify episode ID for podcast embeds */
  spotifyEmbedId?: string;
  /** Local audio file path (DRM-free alternative to Spotify embed) */
  audioFile?: string;
  /** Apple Podcasts URL for fallback links */
  applePodcastsUrl?: string;
  /** Content category - defaults to 'interview' if not specified */
  category?: ContentCategory;
}
