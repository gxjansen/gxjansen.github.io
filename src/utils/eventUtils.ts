// src/utils/eventUtils.ts
import type { ImageMetadata } from 'astro';

export interface Event {
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
}

/**
 * Loads an event icon image dynamically from the events directory
 * @param iconName - The name of the icon file
 * @returns The loaded image or null if not found
 */
export async function getEventIcon(iconName: string | undefined): Promise<ImageMetadata | null> {
  if (!iconName) return null;
  
  try {
    const image = await import(`../images/events/${iconName}`);
    return image.default;
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
    
    // Load icons for all events
    return loadEventIcons(eventsData as Omit<Event, 'loadedIcon'>[]);
  }