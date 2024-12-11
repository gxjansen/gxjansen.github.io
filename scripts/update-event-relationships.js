import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';

// Configuration
const PRESENTATIONS_CSV = 'presentations.csv';
const EVENTS_JSON = 'src/data/events.json';

// Helper function to normalize text for comparison
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')        // Normalize whitespace
    .trim();
}

// Helper function to check if two strings are similar
function isSimilar(str1, str2) {
  const norm1 = normalize(str1);
  const norm2 = normalize(str2);
  return norm1.includes(norm2) || norm2.includes(norm1);
}

async function main() {
  try {
    // Read presentations CSV
    const presentationsContent = await fs.readFile(PRESENTATIONS_CSV, 'utf-8');
    const presentations = parse(presentationsContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Read events JSON
    const eventsContent = await fs.readFile(EVENTS_JSON, 'utf-8');
    const events = JSON.parse(eventsContent);

    // Create a map of presentation slugs by title
    const presentationsByTitle = new Map();
    presentations.forEach(presentation => {
      if (presentation.Name && presentation.Slug) {
        presentationsByTitle.set(normalize(presentation.Name), presentation.Slug);
      }
    });

    // Update events with related presentation slugs
    for (const event of events) {
      if (event.topic) {
        const normalizedTopic = normalize(event.topic);
        
        // Initialize relatedPresentationSlugs if it doesn't exist
        if (!event.relatedPresentationSlugs) {
          event.relatedPresentationSlugs = [];
        }

        // Check each presentation title for a match with the event topic
        for (const [title, slug] of presentationsByTitle.entries()) {
          if (isSimilar(normalizedTopic, title)) {
            if (!event.relatedPresentationSlugs.includes(slug)) {
              event.relatedPresentationSlugs.push(slug);
              console.log(`Matched event "${event.name}" (${event.topic}) with presentation "${title}" (${slug})`);
            }
          }
        }
      }
    }

    // Save updated events
    await fs.writeFile(EVENTS_JSON, JSON.stringify(events, null, 2));
    console.log('Events file updated successfully');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
