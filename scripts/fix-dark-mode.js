#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Color mappings for hardcoded values to Tailwind classes
const colorMappings = {
  // Text colors
  '#000000': 'text-base-900 dark:text-base-100',
  '#ffffff': 'text-base-100 dark:text-base-900',
  '#22c55e': 'text-primary-500',
  
  // Background colors
  'background-color: #ffffff': 'bg-base-100 dark:bg-base-900',
  'background-color: #000000': 'bg-base-900 dark:bg-base-100',
  'background-color: #22c55e': 'bg-primary-500',
  'background-color: #ff4136': 'bg-red-500',
};

// Text classes that need dark mode variants
const textClassMappings = {
  'text-black': 'text-base-900 dark:text-base-100',
  'text-white': 'text-base-100 dark:text-base-900',
  'text-gray-': {
    'text-gray-400': 'text-base-400 dark:text-base-500',
    'text-gray-500': 'text-base-500 dark:text-base-400',
    'text-gray-600': 'text-base-600 dark:text-base-300',
    'text-gray-700': 'text-base-700 dark:text-base-200',
  },
  'text-base-': {
    'text-base-50': 'text-base-50 dark:text-base-950',
    'text-base-100': 'text-base-100 dark:text-base-900',
    'text-base-200': 'text-base-200 dark:text-base-800',
    'text-base-300': 'text-base-300 dark:text-base-700',
    'text-base-400': 'text-base-400 dark:text-base-500',
    'text-base-500': 'text-base-500 dark:text-base-400',
    'text-base-600': 'text-base-600 dark:text-base-300',
    'text-base-700': 'text-base-700 dark:text-base-200',
    'text-base-800': 'text-base-800 dark:text-base-200',
    'text-base-900': 'text-base-900 dark:text-base-100',
    'text-base-950': 'text-base-950 dark:text-base-50',
    'text-base-content': 'text-base-900 dark:text-base-100',
  },
};

// Shadow and gradient mappings
const shadowMappings = {
  'box-shadow: 0 0 0 1px rgba(2552552550.1) inset': 'shadow-[inset_0_0_0_1px] shadow-base-200/10 dark:shadow-base-800/10',
  'background-color: #ff4136': 'bg-red-500',
};

async function findAstroFiles(dir) {
  const files = await fs.readdir(dir);
  const astroFiles = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      astroFiles.push(...(await findAstroFiles(filePath)));
    } else if (file.endsWith('.astro')) {
      astroFiles.push(filePath);
    }
  }

  return astroFiles;
}

function fixTextClasses(line) {
  let newLine = line;

  // Fix text classes
  Object.entries(textClassMappings).forEach(([baseClass, replacement]) => {
    if (typeof replacement === 'string') {
      // Simple replacement
      const regex = new RegExp(`class="([^"]*?)\\b${baseClass}\\b([^"]*?)"`, 'g');
      if (regex.test(line) && !line.includes('dark:')) {
        newLine = newLine.replace(regex, `class="$1${replacement}$2"`);
      }
    } else {
      // Complex replacement with specific variants
      Object.entries(replacement).forEach(([specific, fullReplacement]) => {
        const regex = new RegExp(`class="([^"]*?)\\b${specific}\\b([^"]*?)"`, 'g');
        if (regex.test(line) && !line.includes('dark:')) {
          newLine = newLine.replace(regex, `class="$1${fullReplacement}$2"`);
        }
      });
    }
  });

  return newLine;
}

function fixShadowsAndGradients(line) {
  let newLine = line;
  
  // Fix shadow and gradient patterns
  Object.entries(shadowMappings).forEach(([pattern, replacement]) => {
    if (line.includes(pattern)) {
      newLine = newLine.replace(
        /style="([^"]*)"/g,
        (match, style) => {
          const newStyle = style.replace(pattern, '').trim();
          return newStyle ? `style="${newStyle}" class="${replacement}"` : `class="${replacement}"`;
        }
      );
    }
  });
  
  return newLine;
}

function fixHardcodedColors(line) {
  let newLine = fixShadowsAndGradients(line);

  // Fix hardcoded colors in style attributes
  Object.entries(colorMappings).forEach(([color, replacement]) => {
    const styleRegex = new RegExp(`style="[^"]*${color}[^"]*"`, 'g');
    if (styleRegex.test(line)) {
      newLine = newLine.replace(
        /style="([^"]*)"/g,
        (match, style) => {
          const newStyle = style.replace(color, '');
          return newStyle.trim() ? `style="${newStyle}"` : `class="${replacement}"`;
        }
      );
    }
  });

  // Fix hardcoded hex colors
  const hexColorRegex = /#([0-9a-fA-F]{3}){1,2}\b/g;
  let match;
  while ((match = hexColorRegex.exec(line)) !== null) {
    const color = match[0].toLowerCase();
    if (colorMappings[color]) {
      newLine = newLine.replace(color, `{/* Replaced ${color} */} ${colorMappings[color]}`);
    }
  }

  return newLine;
}

async function fixFile(filePath, dryRun = false) {
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;
  const newLines = lines.map(line => {
    const originalLine = line;
    let newLine = fixTextClasses(line);
    newLine = fixHardcodedColors(newLine);
    
    if (newLine !== originalLine) {
      modified = true;
      if (dryRun) {
        console.log(`\nIn ${path.relative(process.cwd(), filePath)}:`);
        console.log('- ' + originalLine.trim());
        console.log('+ ' + newLine.trim());
      }
    }
    
    return newLine;
  });

  if (modified && !dryRun) {
    await fs.writeFile(filePath, newLines.join('\n'));
    console.log(`✅ Fixed ${path.relative(process.cwd(), filePath)}`);
  }

  return modified;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const srcDir = path.join(process.cwd(), 'src');
  const astroFiles = await findAstroFiles(srcDir);
  let modifiedCount = 0;

  console.log(`\n${dryRun ? 'Checking' : 'Fixing'} dark mode issues...\n`);

  for (const file of astroFiles) {
    const wasModified = await fixFile(file, dryRun);
    if (wasModified) modifiedCount++;
  }

  if (dryRun) {
    console.log(`\nFound ${modifiedCount} files that need dark mode fixes.`);
    console.log('Run without --dry-run to apply the changes.');
  } else {
    console.log(`\nFixed dark mode issues in ${modifiedCount} files.`);
  }
}

main().catch(console.error);
