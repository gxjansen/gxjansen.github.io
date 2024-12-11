import fs from 'fs/promises';

const EVENTS_JSON = 'src/data/events.json';

async function main() {
  try {
    // Read events JSON
    const eventsContent = await fs.readFile(EVENTS_JSON, 'utf-8');
    const events = JSON.parse(eventsContent);

    // Initialize relatedPresentationSlugs for events that don't have it
    const updatedEvents = events.map(event => {
      if (!event.relatedPresentationSlugs) {
        return {
          ...event,
          relatedPresentationSlugs: []
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
