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

  // Check if there's no newline between frontmatter and content
  if (content.includes('---\n') && !content.includes('---\n\n')) {
    // Add newline after frontmatter
    content = content.replace(/---\n([^\n])/, '---\n\n$1');
    fs.writeFileSync(filePath, content);
    updated++;
    console.log(`Updated: ${file}`);
  }
});

console.log('\nSummary:');
console.log(`Updated ${updated} files`);
console.log(`Total files processed: ${files.length}`);
