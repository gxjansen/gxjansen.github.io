import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the CSV file
const csvPath = path.join(__dirname, '../presentations.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true
});

// Group presentations by title
const presentationsByTitle = new Map();
records.forEach(record => {
  if (!record.Name) return;
  
  const title = record.Name.toLowerCase().trim();
  if (!presentationsByTitle.has(title)) {
    presentationsByTitle.set(title, []);
  }
  presentationsByTitle.get(title).push(record);
});

// Find duplicates
console.log('Duplicate presentations:');
let hasDuplicates = false;

presentationsByTitle.forEach((presentations, title) => {
  if (presentations.length > 1) {
    hasDuplicates = true;
    console.log(`\n${presentations[0].Name}:`);
    presentations.forEach(p => {
      console.log(`- ${p.Slug} (Featured: ${p.Featured})`);
    });
  }
});

if (!hasDuplicates) {
  console.log('No duplicate presentations found.');
}
