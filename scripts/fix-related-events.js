import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get presentations directory
const presentationsDir = path.join(__dirname, '../src/content/presentations');

// Read all MDX files
const files = fs.readdirSync(presentationsDir)
  .filter(file => file.endsWith('.mdx'));

let updated = 0;

files.forEach(file => {
  const filePath = path.join(presentationsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if relatedEventSlugs is missing, null, or empty
  if (content.includes('relatedEventSlugs:') && 
      !content.includes('relatedEventSlugs: []')) {
    // Replace the line with proper empty array
    content = content.replace(
      /relatedEventSlugs:(\s*(?:null|\[\])?)/,
      'relatedEventSlugs: []'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
    updated++;
  }
});

console.log(`\nSummary:`);
console.log(`Updated ${updated} files`);
console.log(`Total files processed: ${files.length}`);
