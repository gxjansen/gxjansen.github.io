import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import crypto from 'crypto';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get presentations directory
const presentationsDir = path.join(__dirname, '../src/content/presentations');
const imagesDir = path.join(__dirname, '../public/images/presentations');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(imagesDir, filename);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded: ${filename}`);
          resolve(filename);
        });

        fileStream.on('error', (err) => {
          console.error(`Error writing ${filename}: ${err.message}`);
          reject(err);
        });
      } else {
        console.error(`Failed to download ${filename}: ${response.statusCode}`);
        reject(new Error(`HTTP Status ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`Error downloading ${filename}: ${err.message}`);
      reject(err);
    });
  });
}

// Function to generate a filename from URL
function generateFilename(url) {
  const urlHash = crypto.createHash('md5').update(url).digest('hex').slice(0, 8);
  const extension = path.extname(url).split('?')[0] || '.jpg';
  return `presentation-${urlHash}${extension}`;
}

// Process all MDX files
async function processFiles() {
  const files = fs.readdirSync(presentationsDir)
    .filter(file => file.endsWith('.mdx'));

  const urlToFilename = new Map();
  let updated = 0;
  let downloaded = 0;

  for (const file of files) {
    const filePath = path.join(presentationsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Extract image URL from frontmatter
    const imageMatch = content.match(/image:\s*"(https:\/\/[^"]+)"/);
    if (imageMatch) {
      const imageUrl = imageMatch[1];
      let localPath;

      if (urlToFilename.has(imageUrl)) {
        localPath = urlToFilename.get(imageUrl);
      } else {
        const filename = generateFilename(imageUrl);
        try {
          await downloadImage(imageUrl, filename);
          downloaded++;
          localPath = `/images/presentations/${filename}`;
          urlToFilename.set(imageUrl, localPath);
        } catch (error) {
          console.error(`Failed to process ${imageUrl}: ${error.message}`);
          continue;
        }
      }

      // Update the content with local path
      content = content.replace(
        /image:\s*"https:\/\/[^"]+"/,
        `image: "${localPath}"`
      );

      fs.writeFileSync(filePath, content);
      updated++;
      console.log(`Updated: ${file}`);
    }
  }

  console.log('\nSummary:');
  console.log(`Downloaded ${downloaded} images`);
  console.log(`Updated ${updated} files`);
  console.log(`Total files processed: ${files.length}`);

  // Save the URL mapping
  const mappingPath = path.join(__dirname, '../src/data/presentation-image-mapping.json');
  const mapping = Object.fromEntries(urlToFilename);
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`Mapping saved to: ${mappingPath}`);
}

// Run the script
processFiles().catch(console.error);
