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

let featured = [];
let notFeatured = [];

files.forEach(file => {
  const filePath = path.join(presentationsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract frontmatter
  const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const isFeatured = frontmatter.includes('isFeatured: true');
    const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : file;

    if (isFeatured) {
      featured.push({ file, title });
    } else {
      notFeatured.push({ file, title });
    }
  }
});

console.log('Featured presentations:');
featured.forEach(p => console.log(`- ${p.title} (${p.file})`));

console.log('\nNot featured presentations:');
notFeatured.forEach(p => console.log(`- ${p.title} (${p.file})`));

console.log('\nSummary:');
console.log(`Featured: ${featured.length}`);
console.log(`Not featured: ${notFeatured.length}`);
console.log(`Total: ${files.length}`);
