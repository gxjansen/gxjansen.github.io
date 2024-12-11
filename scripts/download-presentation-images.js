import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extract all image URLs from the CSV data
const images = [
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/62f56df1cea3730483fa1182_guido-4.jpg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/626158091f829d31e3edaa74_08.02.2022_Spryker_CEO_0346_cropped.jpg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/625410f4825dbcad12de47a5_604e4e003526e9d34e957d01_22712364_1482883478413510_1552031170266955862_o(1)-p-1080.jpeg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/645f365f71e299c55d12c182_wizard-glass%20orb.png',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/604e4dc47712d4c5c9c75efc_CEuhsyuWAAAD4rp.jpeg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/604e4ddf7f3b7844db557139_30239340682_ec5a339bc1_z.jpeg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/604e4dd72c8e12796600e152_22713202_1482878368414021_3313586431392520781_o(1).jpeg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/622f5bb1c640c748e3704f91_webstacks-ewXKiIezeTg-unsplash.jpg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/604e41807712d48b5ab72a2f_Cursor_and_A_B_Testing__Compute_required_Sample_Size__A-Priori__-_Public_version_-_Google_Sheets.jpeg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/625411088a543e72074c7c72_604e4de51a9e05740947ba5a_guido-(1).jpeg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/604e3e3f0f5a7432c48a2ee4_EIIjgGGWoAA388H.jpeg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/604e4ded09f6bb444f51e279_6825672821_a81a134b01_b.jpeg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/604e4db6dfcca5805f0d4085_maxresdefault-(9).jpeg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/604e4da733bbb6695269ff3f_square_color_w_mark_round_social.jpeg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/604e4dbc2dd1421d63c3f762_download.png',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/62f56d0a85a9216b6a9c9479_Untitled-2.jpg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/604e4df6033eb0d4715226e9_normal_photo_1504185187.jpeg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/62f56d5385742f56f6a86eef_guido-3.jpg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/6254111a693e7e72359dde44_604e4e0e5ba34005408e0ce3_12017468_1029916770374028_5067970769647306750_o-p-800.jpeg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/624a0dcc07e477004919eacd_0317_cropped.jpg',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/65c5544948af8f6d48d4ab52_spark-community-session.webp',
  'https://uploads-ssl.webflow.com/5a2472d2a1816d000132b7f0/62582f59602b76223fde050d_08.02.jpg'
].filter(Boolean); // Remove any undefined/null values

// Create a mapping of URLs to filenames
const urlToFilename = new Map();

// Function to generate a filename from URL
function generateFilename(url) {
  const urlHash = crypto.createHash('md5').update(url).digest('hex').slice(0, 8);
  const extension = path.extname(url);
  return `presentation-${urlHash}${extension}`;
}

// Function to download an image
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const filename = generateFilename(url);
    const filepath = path.join(__dirname, '../public/images/presentations', filename);
    
    // Store the mapping
    urlToFilename.set(url, `/images/presentations/${filename}`);
    
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

// Download all images and create the mapping file
async function processImages() {
  try {
    // Create the directory if it doesn't exist
    const dir = path.join(__dirname, '../public/images/presentations');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Download all images
    await Promise.all(images.map(url => downloadImage(url)));

    // Save the URL mapping to a file
    const mappingPath = path.join(__dirname, '../src/data/presentation-image-mapping.json');
    const mapping = Object.fromEntries(urlToFilename);
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));

    console.log('All images downloaded and mapping saved!');
    console.log(`Total images: ${images.length}`);
    console.log(`Mapping saved to: ${mappingPath}`);
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

// Run the script
processImages();
