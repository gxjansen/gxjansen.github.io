#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Text-related Tailwind classes that should have dark mode variants
const textClasses = [
  'text-black',
  'text-white',
  'text-gray-',
  'text-base-'
];

// Classes that don't need dark mode variants
const excludedPatterns = [
  // Brand colors that are consistent in both modes
  'text-primary-',
  'text-secondary-',
  'text-accent-',
  // Decorative elements
  'text-accent-1',
  'text-accent-2',
  'text-accent-3',
  'text-accent-4',
  // Semantic colors
  'text-info-',
  'text-success-',
  'text-warning-',
  'text-error-',
  // Gradients and complex patterns
  'bg-\\[radial-gradient',
  'bg-gradient-to-',
  'rgba\\(',  // Complex gradient patterns with rgba
  'circle_at_\\d+%_\\d+%rgba', // Complex radial gradient patterns
  // Browser UI elements
  'msapplication-TileColor',
  'theme-color'
];

// Color-related properties that might be hardcoded
const colorProperties = [
  'color:',
  'background-color:',
  'border-color:',
  'outline-color:',
  'text-decoration-color:',
];

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

function checkLine(line, lineNumber, filePath) {
  // Skip lines that match excluded patterns
  if (excludedPatterns.some(pattern => line.includes(pattern))) {
    return [];
  }
  const issues = [];

  // Check for text classes without dark mode variants
  textClasses.forEach(className => {
    const regex = new RegExp(`class="[^"]*\\b${className}[^"]*"`, 'g');
    if (regex.test(line)) {
      const darkModeRegex = new RegExp(`class="[^"]*\\bdark:${className}[^"]*"`, 'g');
      if (!darkModeRegex.test(line)) {
        issues.push({
          type: 'missing-dark-mode',
          line: lineNumber,
          text: line.trim(),
          suggestion: `Text class '${className}' found without dark mode variant`
        });
      }
    }
  });

  // Check for inline styles with color properties
  colorProperties.forEach(property => {
    const regex = new RegExp(`style="[^"]*${property}[^"]*"`, 'g');
    if (regex.test(line)) {
      issues.push({
        type: 'hardcoded-color',
        line: lineNumber,
        text: line.trim(),
        suggestion: 'Inline style contains hardcoded color. Consider using Tailwind classes instead.'
      });
    }
  });

  // Check for hardcoded hex colors
  const hexColorRegex = /#([0-9a-fA-F]{3}){1,2}\b/g;
  if (hexColorRegex.test(line)) {
    issues.push({
      type: 'hardcoded-hex',
      line: lineNumber,
      text: line.trim(),
      suggestion: 'Hardcoded hex color found. Consider using Tailwind color classes.'
    });
  }

  // Check for rgb/rgba colors
  const rgbColorRegex = /rgb\(.*?\)|rgba\(.*?\)/g;
  if (rgbColorRegex.test(line)) {
    issues.push({
      type: 'hardcoded-rgb',
      line: lineNumber,
      text: line.trim(),
      suggestion: 'Hardcoded RGB color found. Consider using Tailwind color classes.'
    });
  }

  return issues;
}

async function analyzeFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  const fileIssues = [];

  lines.forEach((line, index) => {
    const lineIssues = checkLine(line, index + 1, filePath);
    if (lineIssues.length > 0) {
      fileIssues.push(...lineIssues.map(issue => ({
        ...issue,
        file: path.relative(process.cwd(), filePath)
      })));
    }
  });

  return fileIssues;
}

async function main() {
  const srcDir = path.join(process.cwd(), 'src');
  const astroFiles = await findAstroFiles(srcDir);
  let allIssues = [];

  for (const file of astroFiles) {
    const issues = await analyzeFile(file);
    allIssues = allIssues.concat(issues);
  }

  // Group issues by file
  const issuesByFile = allIssues.reduce((acc, issue) => {
    if (!acc[issue.file]) {
      acc[issue.file] = [];
    }
    acc[issue.file].push(issue);
    return acc;
  }, {});

  // Print results
  console.log('\nDark Mode and Color Issues Report\n');

  if (allIssues.length === 0) {
    console.log('✅ No issues found!');
    return;
  }

  Object.entries(issuesByFile).forEach(([file, issues]) => {
    console.log(`\n📁 ${file}`);
    issues.forEach(issue => {
      console.log(`  Line ${issue.line}: ${issue.suggestion}`);
      console.log(`    ${issue.text}`);
      console.log();
    });
  });

  console.log(`\nTotal issues found: ${allIssues.length}`);
}

main().catch(console.error);
