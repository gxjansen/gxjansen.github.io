import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sanitizeHtml from 'sanitize-html';

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

  // Check for HTML tags
  if (content.includes('<p>') || content.includes('<br>') || content.includes('<a ')) {
    console.log(`Found HTML tags in: ${file}`);
    
    // Fix common HTML patterns
    content = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {}
    });
    // Fix multiple newlines
    content = content.replace(/\n{3,}/g, '\n\n')
      // Fix any double spaces
      .replace(/  +/g, ' ')
      // Fix any triple+ newlines
      .replace(/\n{3,}/g, '\n\n')
      // Trim whitespace
      .trim();

    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
    updated++;
  }
});

console.log('\nSummary:');
console.log(`Updated ${updated} files`);
console.log(`Total files processed: ${files.length}`);