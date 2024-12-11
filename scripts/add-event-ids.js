import fs from 'fs/promises';

const EVENTS_JSON = 'src/data/events.json';

// Helper function to generate an ID from event properties
function generateEventId(event) {
  // Convert event name to lowercase, remove special chars, replace spaces with hyphens
  const nameSlug = event.name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  
  // Convert date to YYYY-MM format
  const dateParts = event.date.split('-');
  const dateSlug = `${dateParts[0]}-${dateParts[1]}`;
  
  return `${nameSlug}-${dateSlug}`;
}

async function main() {
  try {
    // Read events JSON
    const eventsContent = await fs.readFile(EVENTS_JSON, 'utf-8');
    const events = JSON.parse(eventsContent);

    // Add IDs to events that don't have them
    const updatedEvents = events.map(event => {
      if (!event.id) {
        return {
          id: generateEventId(event),
          ...event
        };
      }
      return event;
    });

    // Save updated events
    await fs.writeFile(EVENTS_JSON, JSON.stringify(updatedEvents, null, 2));
    console.log('Events file updated successfully');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
