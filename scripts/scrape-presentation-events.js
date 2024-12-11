import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import csv from 'csv-parse/sync';

// Configuration
const PRESENTATIONS_CSV = 'presentations.csv';
const EVENTS_JSON = 'src/data/events.json';
const BASE_URL = 'https://www.gui.do/presentation/';

async function readPresentations() {
  const fileContent = await fs.readFile(PRESENTATIONS_CSV, 'utf-8');
  const records = csv.parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });
  return records;
}

async function readEvents() {
  const fileContent = await fs.readFile(EVENTS_JSON, 'utf-8');
  return JSON.parse(fileContent);
}

async function scrapeEventInfo(browser, slug) {
  const page = await browser.newPage();
  await page.goto(`${BASE_URL}${slug}`, { waitUntil: 'networkidle0' });

  // Extract event information from the page
  const eventInfo = await page.evaluate(() => {
    // Find event details section - this selector needs to be updated based on the actual page structure
    const eventSection = document.querySelector('.event-details');
    if (!eventSection) return null;

    return {
      name: eventSection.querySelector('.event-name')?.textContent,
      date: eventSection.querySelector('.event-date')?.textContent,
      location: eventSection.querySelector('.event-location')?.textContent
    };
  });

  await page.close();
  return eventInfo;
}

async function main() {
  try {
    // Read presentations and events
    const presentations = await readPresentations();
    const events = await readEvents();

    // Launch browser
    const browser = await puppeteer.launch();

    // Process each presentation
    for (const presentation of presentations) {
      if (!presentation.Slug) continue;

      console.log(`Processing presentation: ${presentation.Slug}`);
      const eventInfo = await scrapeEventInfo(browser, presentation.Slug);

      if (eventInfo) {
        // Find matching event in events.json
        const matchingEvent = events.find(event => 
          event.name === eventInfo.name && 
          event.date === eventInfo.date
        );

        if (matchingEvent) {
          // Add presentation slug to event's relatedPresentationSlugs if not already present
          if (!matchingEvent.relatedPresentationSlugs.includes(presentation.Slug)) {
            matchingEvent.relatedPresentationSlugs.push(presentation.Slug);
          }
        }
      }
    }

    await browser.close();

    // Save updated events
    await fs.writeFile(EVENTS_JSON, JSON.stringify(events, null, 2));
    console.log('Events file updated successfully');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
