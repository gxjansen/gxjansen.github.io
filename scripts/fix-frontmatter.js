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

  // Fix frontmatter closing delimiter
  if (content.includes('---\n') && !content.includes('---\n\n')) {
    // Add newline after frontmatter closing delimiter
    content = content.replace(/---\n([^\n])/, '---\n\n$1');
    
    // Fix any remaining issues with frontmatter
    content = content.replace(/\]---\n/, ']\n---\n\n');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
    updated++;
  }
});

console.log('\nSummary:');
console.log(`Updated ${updated} files`);
console.log(`Total files processed: ${files.length}`);
