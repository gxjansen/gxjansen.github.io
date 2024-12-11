import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the image mapping
const mappingPath = path.join(__dirname, '../src/data/presentation-image-mapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

// Read the CSV file
const csvPath = path.join(__dirname, '../presentations.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true
});

// Update image paths
const updatedRecords = records.map(record => {
  if (record.Image && mapping[record.Image]) {
    return {
      ...record,
      Image: mapping[record.Image]
    };
  }
  return record;
});

// Convert back to CSV
const output = stringify(updatedRecords, {
  header: true,
  columns: Object.keys(records[0])
});

// Save the updated CSV
const backupPath = path.join(__dirname, '../presentations.backup.csv');
fs.copyFileSync(csvPath, backupPath);
fs.writeFileSync(csvPath, output);

console.log('CSV updated successfully!');
console.log('Original file backed up to:', backupPath);
console.log('Updated records:', updatedRecords.length);
