// scripts/copy-flags.mjs
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyFlags() {
    const projectRoot = path.join(__dirname, '..');
    const sourcePath = path.join(projectRoot, 'node_modules/svg-country-flags/svg');
    // Simplify the target path
    const targetPath = process.env.NETLIFY 
        ? path.join(projectRoot, '_flags') // Simplified path
        : path.join(projectRoot, 'public/_flags');

    try {
        // Create target directory if it doesn't exist
        await fs.mkdir(targetPath, { recursive: true });

        // Read all SVG files from source
        const files = await fs.readdir(sourcePath);
        const svgFiles = files.filter(file => file.endsWith('.svg'));

        // Copy each SVG file
        for (const file of svgFiles) {
            const sourceFile = path.join(sourcePath, file);
            const targetFile = path.join(targetPath, file);
            await fs.copyFile(sourceFile, targetFile);
        }

        console.log('✅ Successfully copied flag SVGs to:', targetPath);
    } catch (error) {
        console.error('Error copying flags:', error);
        process.exit(1);
    }
}

copyFlags();