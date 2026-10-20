import type { CollectionEntry } from "astro:content";
import { eventsData } from "../data/events";
import type { Event } from "./eventUtils";

const events = eventsData as unknown as Event[];

/**
 * Get all events related to a presentation
 * @param presentationSlug - The slug of the presentation
 * @returns Array of related events
 */
export function getRelatedEvents(presentationSlug: string): Event[] {
  const relatedEvents = events.filter(
    (event) =>
      event.relatedPresentationSlugs?.includes(presentationSlug) ?? false,
  );
  return relatedEvents;
}

/**
 * Get all presentations related to an event
 * @param eventId - The ID of the event
 * @param presentations - Array of all presentations
 * @returns Array of related presentations
 */
export function getRelatedPresentations(
  eventId: string,
  presentations: CollectionEntry<"presentations">[],
): CollectionEntry<"presentations">[] {
  const event = events.find((e) => e.id === eventId);
  if (!event || !event.relatedPresentationSlugs) return [];

  return presentations.filter((presentation) =>
    event.relatedPresentationSlugs.includes(presentation.id),
  );
}

/**
 * Get the URL for the most recent related presentation of an event
 * @param eventId - The ID of the event
 * @returns The URL to the presentation or undefined if none exists
 */
export function getPresentationUrl(eventId: string): string | undefined {
  const event = events.find((e) => e.id === eventId);
  if (
    !event ||
    !event.relatedPresentationSlugs ||
    event.relatedPresentationSlugs.length === 0
  ) {
    return undefined;
  }

  // Return URL using the last (most recent) related presentation slug
  return `/presentations/${event.relatedPresentationSlugs[event.relatedPresentationSlugs.length - 1]}`;
}
