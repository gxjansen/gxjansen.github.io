#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// File extensions that legitimately have no trailing slash
const fileExtensions = [
  '.xml', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
  '.ico', '.pdf', '.css', '.js', '.ts', '.woff', '.woff2', '.ttf',
  '.eot', '.mp4', '.webm', '.zip', '.txt', '.html', '.astro',
  '.webmanifest',
];

// Patterns to skip entirely
const skipPatterns = [
  /^\/\//, // protocol-relative URLs
  /^https?:/, // external URLs
  /^#/, // anchor-only links
  /^mailto:/, // email links
  /^\{/, // dynamic expressions we can't statically check
];

/**
 * Extract href values from a line of an .astro file.
 * Matches href="/path", href={`/path`}, and href={'/path'}.
 */
function extractHrefs(line) {
  const hrefs = [];

  // Static: href="/path"
  const staticRegex = /href="(\/[^"]*?)"/g;
  let match;
  while ((match = staticRegex.exec(line)) !== null) {
    hrefs.push(match[1]);
  }

  // Template literal: href={`/path`}
  const templateRegex = /href=\{`(\/[^`]*?)`\}/g;
  while ((match = templateRegex.exec(line)) !== null) {
    hrefs.push(match[1]);
  }

  return hrefs;
}

/**
 * Extract markdown link paths from .mdx content.
 * Matches [text](/path) patterns.
 */
function extractMarkdownLinks(line) {
  const links = [];
  const regex = /\]\((\/[^)]*?)\)/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    links.push(match[1]);
  }
  return links;
}

/**
 * Check if a path needs a trailing slash.
 * Returns true if the path is a violation (missing trailing slash).
 */
function needsTrailingSlash(href) {
  // Skip patterns we can't or shouldn't check
  if (skipPatterns.some(p => p.test(href))) return false;

  // Must start with /
  if (!href.startsWith('/')) return false;

  // Strip anchor/query for the path check
  const pathOnly = href.split(/[?#]/)[0];

  // Skip if path has a file extension
  if (fileExtensions.some(ext => pathOnly.endsWith(ext))) return false;

  // Skip root path
  if (pathOnly === '/') return false;

  // The path portion must end with /
  if (pathOnly.endsWith('/')) return false;

  // If there's an anchor or query, the path before it must end with /
  // e.g. /events#past-events is wrong, /events/#past-events is correct
  return true;
}

async function findFiles(dir, extensions) {
  const files = await fs.readdir(dir);
  const result = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      // Skip test directories and node_modules
      if (file === '__tests__' || file === '__snapshots__' || file === 'node_modules') continue;
      result.push(...(await findFiles(filePath, extensions)));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      result.push(filePath);
    }
  }

  return result;
}

async function checkFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];
  const isMdx = filePath.endsWith('.mdx');

  lines.forEach((line, index) => {
    const hrefs = isMdx
      ? [...extractHrefs(line), ...extractMarkdownLinks(line)]
      : extractHrefs(line);

    for (const href of hrefs) {
      if (needsTrailingSlash(href)) {
        violations.push({
          line: index + 1,
          href,
          text: line.trim(),
        });
      }
    }
  });

  return violations;
}

async function main() {
  const srcDir = path.join(process.cwd(), 'src');
  const files = await findFiles(srcDir, ['.astro', '.mdx']);
  let totalViolations = 0;

  console.log('\nTrailing Slash Check\n');

  for (const file of files) {
    const violations = await checkFile(file);
    if (violations.length > 0) {
      const relPath = path.relative(process.cwd(), file);
      console.log(`  ${relPath}`);
      for (const v of violations) {
        console.log(`    line ${v.line}: ${v.href}`);
      }
      totalViolations += violations.length;
    }
  }

  if (totalViolations === 0) {
    console.log('No violations found.\n');
    process.exit(0);
  } else {
    console.log(`\n${totalViolations} violation(s) found.\n`);
    process.exit(1);
  }
}

main().catch(console.error);
