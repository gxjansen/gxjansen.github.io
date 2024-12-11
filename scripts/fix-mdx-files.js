import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get presentations directory
const presentationsDir = path.join(__dirname, '../src/content/presentations');

// Process all MDX files
const files = fs.readdirSync(presentationsDir)
  .filter(file => file.endsWith('.mdx'));

let updated = 0;

files.forEach(file => {
  const filePath = path.join(presentationsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix frontmatter formatting
  if (content.includes('---\n') && !content.includes('---\n\n')) {
    content = content.replace(/---\n([^\n])/, '---\n\n$1');
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
    updated++;
  }

  // Ensure all required fields are present
  const frontmatter = content.match(/---([\s\S]*?)---/)[1];
  const missingFields = [];

  // Check required fields
  if (!frontmatter.includes('title:')) missingFields.push('title');
  if (!frontmatter.includes('duration:')) missingFields.push('duration');
  if (!frontmatter.includes('isWorkshop:')) missingFields.push('isWorkshop');
  if (!frontmatter.includes('isFeatured:')) missingFields.push('isFeatured');
  if (!frontmatter.includes('image:')) missingFields.push('image');
  if (!frontmatter.includes('relatedEventSlugs:')) missingFields.push('relatedEventSlugs');

  if (missingFields.length > 0) {
    console.log(`\nWarning: ${file} is missing required fields:`, missingFields);
  }
});

console.log('\nSummary:');
console.log(`Updated ${updated} files`);
console.log(`Total files processed: ${files.length}`);
