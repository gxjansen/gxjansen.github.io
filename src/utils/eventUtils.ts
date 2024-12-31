// src/utils/eventUtils.ts
import type { ImageMetadata } from 'astro';

export interface Event {
  id: string;
  name: string;
  date: string;
  url?: string;
  city: string;
  country: string;
  topic: string;
  role: string;
  workshop: boolean;
  icon?: string;
  loadedIcon: ImageMetadata | null;
  relatedPresentationSlugs: string[]; // Changed from optional to required, with empty array as default
}

// Import all event icons as modules with correct typing for Astro's image handling
const eventIcons = import.meta.glob<{ default: ImageMetadata }>('/src/images/events/*.{png,jpg,jpeg,gif,avif,svg}', {
  eager: true // Make imports eager to ensure proper asset handling
});

/**
 * Loads an event icon image dynamically from the events directory
 * @param iconName - The name of the icon file
 * @returns The loaded image or null if not found
 */
export async function getEventIcon(iconName: string | undefined): Promise<ImageMetadata | null> {
  if (!iconName) return null;
  
  try {
    // Construct the icon path
    const iconPath = `/src/images/events/${iconName}`;
    
    // Get the icon module
    const iconModule = eventIcons[iconPath];
    
    if (!iconModule) {
      console.warn(`No icon found for: ${iconName}`);
      return null;
    }

    // Return the ImageMetadata directly from the module
    return iconModule.default;
  } catch (e) {
    console.warn(`Could not load icon: ${iconName}`);
    return null;
  }
}

/**
 * Loads icons for an array of events
 * @param events - Array of raw event data
 * @returns Promise of events with loaded icons
 */
export async function loadEventIcons<T extends { icon?: string }>(events: T[]): Promise<(T & { loadedIcon: ImageMetadata | null })[]> {
  return Promise.all(
    events.map(async (event) => ({
      ...event,
      loadedIcon: await getEventIcon(event.icon)
    }))
  );
}

/**
 * Loads and processes all events with their icons
 * Utility function to be used in pages that need to display events
 * @returns Promise of processed events with loaded icons
 */
export async function getAllEvents(): Promise<Event[]> {
    // Dynamically import events data
    const eventsData = (await import('../data/events.json')).default;
    
    // Ensure each event has relatedPresentationSlugs (default to empty array)
    const eventsWithSlugs = eventsData.map(event => ({
      ...event,
      relatedPresentationSlugs: event.relatedPresentationSlugs || []
    }));
    
    // Load icons for all events
    return loadEventIcons(eventsWithSlugs as Omit<Event, 'loadedIcon'>[]);
}

/**
 * Count the total number of past events
 */
import eventsData from "../data/events.json";

export const getTotalPastEventsCount = () => {
  const today = new Date();
  return eventsData.filter(event => new Date(event.date) < today).length;
};
