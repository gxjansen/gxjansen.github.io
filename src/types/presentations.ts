/**
 * Represents a role at an event
 */
export type EventRole = 
  | "Presenter" // Default role when there's a presentation
  | "Event host/moderator"
  | "Main event organizer"
  | "Event co-organizer"
  | "Podcast livestream host"
  | "Panellist"
  | "Speaker" // For non-presentation talks
  | "Co-hosting Commerce Sneaks";

/**
 * Represents a single presentation with optional workshop variant
 */
export interface Presentation {
  /** Title of the presentation */
  title: string;

  /** URL-friendly slug */
  slug: string;

  /** HTML description of the presentation */
  description: string;

  /** Duration (e.g., "30 minutes", "2 hours") */
  duration: string;

  /** Target audience for the presentation */
  intendedAudience?: string;

  /** Whether this is an extended workshop version */
  isWorkshop: boolean;

  /** Whether this is a featured presentation */
  isFeatured: boolean;

  /** Featured image URL */
  image: string;

  /** SlideShare presentation key */
  slideshareKey?: string;

  /** YouTube video ID */
  youtubeId?: string;

  /** Array of related event slugs */
  relatedEventSlugs: string[];
}

/**
 * Update Event interface to support presentations and roles
 */
export interface PresentationEvent extends Event {
  /** Related presentation slug if any */
  presentationSlug?: string;
  
  /** Role played at the event */
  role: EventRole;
}
