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

// Create a map of slug to featured status
const featuredMap = new Map();
records.forEach(record => {
  featuredMap.set(record.Slug, record.Featured === 'true');
});

// Get presentations directory
const presentationsDir = path.join(__dirname, '../src/content/presentations');

// Process all MDX files
const files = fs.readdirSync(presentationsDir)
  .filter(file => file.endsWith('.mdx'));

let updated = 0;
let featured = 0;

files.forEach(file => {
  const filePath = path.join(presentationsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Get slug from filename (remove .mdx)
  const slug = file.replace('.mdx', '');
  const shouldBeFeatured = featuredMap.get(slug);

  if (shouldBeFeatured) {
    featured++;
  }

  // Check if isFeatured needs to be updated
  if (content.includes('isFeatured: true') && !shouldBeFeatured) {
    content = content.replace('isFeatured: true', 'isFeatured: false');
    fs.writeFileSync(filePath, content);
    updated++;
    console.log(`Updated ${file}: removed featured flag`);
  } else if (content.includes('isFeatured: false') && shouldBeFeatured) {
    content = content.replace('isFeatured: false', 'isFeatured: true');
    fs.writeFileSync(filePath, content);
    updated++;
    console.log(`Updated ${file}: added featured flag`);
  }
});

console.log('\nSummary:');
console.log(`Updated ${updated} files`);
console.log(`Total featured presentations: ${featured}`);
console.log(`Total files processed: ${files.length}`);
