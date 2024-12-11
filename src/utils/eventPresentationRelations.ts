import type { CollectionEntry } from 'astro:content';
import eventsData from '../data/events.json';

interface Event {
  id: string;
  name: string;
  icon: string;
  date: string;
  city: string;
  country: string;
  url: string;
  workshop: boolean;
  role: string;
  topic: string;
  relatedPresentationSlugs: string[];
}

// Type assertion for imported events data
const events = eventsData as Event[];

/**
 * Get all events related to a presentation
 * @param presentationSlug - The slug of the presentation
 * @returns Array of related events
 */
export function getRelatedEvents(presentationSlug: string): Event[] {
  console.log('Getting related events for:', presentationSlug);
  console.log('Total events:', events.length);
  console.log('Events with relatedPresentationSlugs:', events.filter(e => e.relatedPresentationSlugs?.length > 0).length);
  
  const relatedEvents = events.filter(event => 
    event.relatedPresentationSlugs?.includes(presentationSlug) ?? false
  );
  
  console.log('Found related events:', relatedEvents.length);
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
  presentations: CollectionEntry<'presentations'>[]
): CollectionEntry<'presentations'>[] {
  const event = events.find(e => e.id === eventId);
  if (!event || !event.relatedPresentationSlugs) return [];
  
  return presentations.filter(presentation => 
    event.relatedPresentationSlugs.includes(presentation.slug)
  );
}

/**
 * Add a presentation-event relationship
 * @param presentationSlug - The slug of the presentation
 * @param eventId - The ID of the event
 */
export function addRelation(presentationSlug: string, eventId: string): void {
  const event = events.find(e => e.id === eventId);
  if (!event) return;
  
  // Initialize relatedPresentationSlugs if it doesn't exist
  if (!event.relatedPresentationSlugs) {
    event.relatedPresentationSlugs = [];
  }
  
  if (!event.relatedPresentationSlugs.includes(presentationSlug)) {
    event.relatedPresentationSlugs.push(presentationSlug);
  }
}

/**
 * Remove a presentation-event relationship
 * @param presentationSlug - The slug of the presentation
 * @param eventId - The ID of the event
 */
export function removeRelation(presentationSlug: string, eventId: string): void {
  const event = events.find(e => e.id === eventId);
  if (!event || !event.relatedPresentationSlugs) return;
  
  event.relatedPresentationSlugs = event.relatedPresentationSlugs.filter(
    slug => slug !== presentationSlug
  );
}

/**
 * Get an event by its ID
 * @param eventId - The ID of the event
 * @returns The event object or undefined if not found
 */
export function getEventById(eventId: string): Event | undefined {
  return events.find(e => e.id === eventId);
}

/**
 * Get all events
 * @returns Array of all events
 */
export function getAllEvents(): Event[] {
  return events;
}

// Export Event interface for use in other files
export type { Event };
