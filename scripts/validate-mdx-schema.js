import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'yaml';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get presentations directory
const presentationsDir = path.join(__dirname, '../src/content/presentations');

// Required fields
const requiredFields = ['title'];
const optionalFields = ['duration', 'intendedAudience', 'isWorkshop', 'isFeatured', 'image', 'slideshareKey', 'youtubeId', 'relatedEventSlugs'];

// Process all MDX files
const files = fs.readdirSync(presentationsDir)
  .filter(file => file.endsWith('.mdx'));

let valid = 0;
let invalid = 0;

files.forEach(file => {
  const filePath = path.join(presentationsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  try {
    // Extract frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      throw new Error('No frontmatter found');
    }

    const frontmatter = parse(match[1]);

    // Check required fields
    const missingFields = requiredFields.filter(field => !frontmatter[field]);
    if (missingFields.length > 0) {
      console.log(`\n${file} is missing required fields:`, missingFields);
      invalid++;
      return;
    }

    // Check field types
    const typeErrors = [];
    if (frontmatter.isWorkshop !== undefined && typeof frontmatter.isWorkshop !== 'boolean') {
      typeErrors.push('isWorkshop should be boolean');
    }
    if (frontmatter.isFeatured !== undefined && typeof frontmatter.isFeatured !== 'boolean') {
      typeErrors.push('isFeatured should be boolean');
    }
    if (frontmatter.relatedEventSlugs && !Array.isArray(frontmatter.relatedEventSlugs)) {
      typeErrors.push('relatedEventSlugs should be array');
    }

    if (typeErrors.length > 0) {
      console.log(`\n${file} has type errors:`, typeErrors);
      invalid++;
      return;
    }

    valid++;
  } catch (error) {
    console.error(`\nError parsing ${file}:`, error.message);
    invalid++;
  }
});

console.log('\nSummary:');
console.log(`Valid files: ${valid}`);
console.log(`Invalid files: ${invalid}`);
console.log(`Total files processed: ${files.length}`);
