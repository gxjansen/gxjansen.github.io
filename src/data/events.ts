/**
 * The /events data, derived at build time from Guido's own atproto records:
 * Sifa talks and hosted sessions (id.sifa.profile.presentationDelivery) and
 * the events his Sifa projects organized (id.sifa.profile.project events[] ->
 * community.lexicon.calendar.event).
 *
 * The build reads only the committed snapshot; the scheduled "events snapshot"
 * workflow refreshes it through a PR (scripts/snapshot-events.mjs). Display
 * fields the records can't hold (slugs, role wording, logos, presentation
 * links) live in events-overrides.json.
 */
import snapshot from "./events.snapshot.json";
import overrides from "./events-overrides.json";
import { deriveEvents } from "./eventsDerive.js";

export interface RawEvent {
  id: string;
  /** AT-URI of the record this entry comes from (event for hosted, else delivery). */
  key: string;
  name: string;
  date: string;
  url: string;
  city: string;
  country: string;
  topic: string;
  role: string;
  workshop: boolean;
  icon?: string;
  relatedPresentationSlugs: string[];
}

export const eventsData: RawEvent[] = deriveEvents(
  snapshot as Parameters<typeof deriveEvents>[0],
  overrides as Parameters<typeof deriveEvents>[1],
);
