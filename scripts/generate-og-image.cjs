/**
 * Generate OpenGraph image for the site
 * Uses rose-pine dark theme colors and guido.webp avatar
 *
 * Run: node scripts/generate-og-image.js
 */

const sharp = require('sharp');
const path = require('path');

// Rose Pine dark theme colors
const colors = {
  base: '#191724',
  surface: '#1f1d2e',
  text: '#e0def4',
  subtle: '#908caa',
  gold: '#f6c177',
  rose: '#ebbcba',
  pine: '#31748f',
  foam: '#9ccfd8',
};

const WIDTH = 1200;
const HEIGHT = 630;
const AVATAR_SIZE = 280;

async function generateOGImage() {
  const avatarPath = path.join(__dirname, '../public/images/guido.webp');
  const outputPath = path.join(__dirname, '../public/images/og-default.png');

  // Create circular avatar with border
  const avatar = await sharp(avatarPath)
    .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover' })
    .composite([{
      input: Buffer.from(`
        <svg width="${AVATAR_SIZE}" height="${AVATAR_SIZE}">
          <circle cx="${AVATAR_SIZE/2}" cy="${AVATAR_SIZE/2}" r="${AVATAR_SIZE/2}" fill="white"/>
        </svg>
      `),
      blend: 'dest-in'
    }])
    .toBuffer();

  // Create the SVG overlay with text
  const svgOverlay = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
        </style>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" fill="${colors.base}"/>

      <!-- Subtle gradient overlay -->
      <rect width="100%" height="100%" fill="url(#grad)" opacity="0.3"/>
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.pine};stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:${colors.rose};stop-opacity:0.1" />
        </linearGradient>
      </defs>

      <!-- Decorative elements -->
      <circle cx="50" cy="50" r="200" fill="${colors.pine}" opacity="0.05"/>
      <circle cx="1150" cy="580" r="250" fill="${colors.rose}" opacity="0.05"/>

      <!-- Name -->
      <text x="${WIDTH/2 + 80}" y="${HEIGHT/2 - 40}"
            font-family="Inter, system-ui, sans-serif"
            font-size="64"
            font-weight="700"
            fill="${colors.text}"
            text-anchor="middle">
        Guido X Jansen
      </text>

      <!-- Tagline -->
      <text x="${WIDTH/2 + 80}" y="${HEIGHT/2 + 30}"
            font-family="Inter, system-ui, sans-serif"
            font-size="28"
            font-weight="400"
            fill="${colors.subtle}"
            text-anchor="middle">
        Community Strategy &amp; Ecosystem Building
      </text>

      <!-- Website -->
      <text x="${WIDTH/2 + 80}" y="${HEIGHT/2 + 90}"
            font-family="Inter, system-ui, sans-serif"
            font-size="24"
            font-weight="600"
            fill="${colors.pine}"
            text-anchor="middle">
        gui.do
      </text>
    </svg>
  `;

  // Create base image and composite
  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: colors.base
    }
  })
    .composite([
      // SVG overlay with text
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
      // Avatar on the left side
      {
        input: avatar,
        top: Math.floor((HEIGHT - AVATAR_SIZE) / 2),
        left: 100,
      },
      // Border ring around avatar
      {
        input: Buffer.from(`
          <svg width="${AVATAR_SIZE + 8}" height="${AVATAR_SIZE + 8}">
            <circle cx="${(AVATAR_SIZE + 8)/2}" cy="${(AVATAR_SIZE + 8)/2}" r="${(AVATAR_SIZE + 4)/2}"
                    fill="none" stroke="${colors.pine}" stroke-width="4"/>
          </svg>
        `),
        top: Math.floor((HEIGHT - AVATAR_SIZE) / 2) - 4,
        left: 96,
      }
    ])
    .png()
    .toFile(outputPath);

  console.log(`OG image generated: ${outputPath}`);
}

generateOGImage().catch(console.error);
