import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get presentations directory
const presentationsDir = path.join(__dirname, '../src/content/presentations');

// Process all MDX files
const files = fs.readdirSync(presentationsDir)
  .filter(file => file.endsWith('.mdx'));

let valid = 0;
let invalid = 0;

files.forEach(file => {
  const filePath = path.join(presentationsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  try {
    // Parse frontmatter
    const { data } = matter(content);
    
    // Log the parsed data
    console.log(`\n${file}:`);
    console.log('- title:', data.title);
    console.log('- duration:', data.duration);
    console.log('- image:', data.image);

    valid++;
  } catch (error) {
    console.error(`\nError parsing ${file}:`, error.message);
    console.log('Content:', content.slice(0, 200) + '...');
    invalid++;
  }
});

console.log('\nSummary:');
console.log(`Valid files: ${valid}`);
console.log(`Invalid files: ${invalid}`);
console.log(`Total files: ${files.length}`);
