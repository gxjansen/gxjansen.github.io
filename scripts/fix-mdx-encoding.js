import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to clean content
function cleanContent(content) {
  return content
    // Remove BOM and other invisible characters
    .replace(/^\uFEFF/, '')
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    // Fix multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Ensure proper frontmatter spacing
    .replace(/---\n([\s\S]*?)---/, (match, frontmatter) => {
      // Clean frontmatter content
      const cleanFrontmatter = frontmatter
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .join('\n');
      return `---\n${cleanFrontmatter}\n---\n\n`;
    });
}

// Process specific files
const files = [
  'data-driven-decisions-meets-psychology.mdx',
  'building-your-optimization-technology-stack.mdx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '../src/content/presentations', file);
  
  try {
    // Read file with explicit utf8 encoding
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Clean and normalize content
    const cleanedContent = cleanContent(content);
    
    // Write back to file
    fs.writeFileSync(filePath, cleanedContent, 'utf8');
    console.log(`Updated: ${file}`);
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});
