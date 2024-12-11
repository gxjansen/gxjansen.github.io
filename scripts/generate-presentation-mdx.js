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

// Create presentations directory if it doesn't exist
const presentationsDir = path.join(__dirname, '../src/content/presentations');
if (!fs.existsSync(presentationsDir)) {
  fs.mkdirSync(presentationsDir, { recursive: true });
}

// Function to create MDX content
function createMDXContent(presentation) {
  const frontmatter = {
    title: presentation.Name,
    duration: presentation.Duration || '',
    intendedAudience: presentation['Intended audience'] || '',
    isWorkshop: presentation.Duration?.toLowerCase().includes('workshop') || false,
    isFeatured: presentation.Featured === 'true',
    image: presentation.Image || '',
    slideshareKey: presentation['Slideshare Key'] || '',
    youtubeId: presentation.Video ? new URL(presentation.Video).searchParams.get('v') : '',
    relatedEventSlugs: []
  };

  // Convert frontmatter to YAML
  const yamlFrontmatter = Object.entries(frontmatter)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => {
      if (typeof value === 'string') {
        // Escape quotes in strings
        const escapedValue = value.replace(/"/g, '\\"');
        return `${key}: "${escapedValue}"`;
      }
      return `${key}: ${value}`;
    })
    .join('\n');

  return `---
${yamlFrontmatter}
---

${presentation.Description || ''}`; 
}

// Process each presentation
let created = 0;
let skipped = 0;

records.forEach(record => {
  // Skip entries without essential data
  if (!record.Name || !record.Slug) {
    console.log(`Skipping presentation: ${record.Name || 'Unnamed'} (missing essential data)`);
    skipped++;
    return;
  }

  const mdxPath = path.join(presentationsDir, `${record.Slug}.mdx`);
  const mdxContent = createMDXContent(record);

  try {
    fs.writeFileSync(mdxPath, mdxContent);
    console.log(`Created: ${record.Slug}.mdx`);
    created++;
  } catch (error) {
    console.error(`Error creating ${record.Slug}.mdx:`, error);
    skipped++;
  }
});

console.log('\nSummary:');
console.log(`Created: ${created} files`);
console.log(`Skipped: ${skipped} entries`);
console.log(`Total: ${records.length} records processed`);
