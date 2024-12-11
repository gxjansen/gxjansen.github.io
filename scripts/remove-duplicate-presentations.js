import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get presentations directory
const presentationsDir = path.join(__dirname, '../src/content/presentations');

// Duplicates to remove
const duplicatePairs = [
  {
    keep: 'grow-smart-or-die-fast.mdx',
    remove: '5-guiding-principles-to-not-f-k-up-modern-b2b-commerce.mdx'
  },
  {
    keep: 'why-becoming-a-marketplace-should-be-your-next-big-initiative.mdx',
    remove: 'why-marketplace-is-your-next-big-initiative.mdx'
  }
];

// Remove duplicate files
duplicatePairs.forEach(pair => {
  const removePath = path.join(presentationsDir, pair.remove);
  if (fs.existsSync(removePath)) {
    fs.unlinkSync(removePath);
    console.log(`Removed duplicate: ${pair.remove}`);
  }
});

console.log('\nDuplicate presentations removed.');
