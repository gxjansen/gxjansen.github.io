#!/usr/bin/env node

/**
 * Post-build validation script for robots.txt
 * This script runs after the build to ensure robots.txt is properly configured
 * and the site is indexable by search engines.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist');
const robotsPath = path.join(distPath, 'robots.txt');

function validateRobotsTxt() {
  console.log('🤖 Validating robots.txt...');

  // Check if dist directory exists
  if (!fs.existsSync(distPath)) {
    console.error('❌ Dist directory not found. Please run build first.');
    process.exit(1);
  }

  // Check if robots.txt exists
  if (!fs.existsSync(robotsPath)) {
    console.error('❌ robots.txt not found in dist directory.');
    console.error('   Expected location:', robotsPath);
    process.exit(1);
  }

  console.log('✅ robots.txt file exists');

  // Read and validate content
  const content = fs.readFileSync(robotsPath, 'utf8');
  
  if (!content || content.trim().length === 0) {
    console.error('❌ robots.txt is empty');
    process.exit(1);
  }

  console.log('✅ robots.txt has content');

  // Check for User-agent directive
  if (!content.match(/User-agent:\s*\*/i)) {
    console.error('❌ robots.txt missing "User-agent: *" directive');
    process.exit(1);
  }

  console.log('✅ robots.txt has User-agent directive');

  // Check for sitemap
  const sitemapMatch = content.match(/Sitemap:\s*(.+)/i);
  if (!sitemapMatch) {
    console.error('❌ robots.txt missing Sitemap directive');
    process.exit(1);
  }

  const sitemapUrl = sitemapMatch[1].trim();
  
  // Validate sitemap URL
  if (!sitemapUrl.startsWith('https://gui.do/')) {
    console.error('❌ Sitemap URL should start with https://gui.do/');
    console.error('   Found:', sitemapUrl);
    process.exit(1);
  }

  if (!sitemapUrl.endsWith('sitemap-index.xml') && !sitemapUrl.endsWith('sitemap.xml')) {
    console.error('❌ Sitemap URL should end with sitemap-index.xml or sitemap.xml');
    console.error('   Found:', sitemapUrl);
    process.exit(1);
  }

  console.log('✅ robots.txt has valid sitemap URL:', sitemapUrl);

  // Check for site-wide blocking
  const lines = content.split('\n').map(line => line.trim());
  let currentUserAgent = '';
  let hasSiteWideBlock = false;
  
  for (const line of lines) {
    if (line.match(/^User-agent:/i)) {
      currentUserAgent = line;
    }
    
    if (currentUserAgent.match(/User-agent:\s*\*/i) && line.match(/^Disallow:\s*\/$/i)) {
      hasSiteWideBlock = true;
      break;
    }
  }

  if (hasSiteWideBlock) {
    console.error('❌ robots.txt contains site-wide blocking (Disallow: /)');
    console.error('   This will prevent search engines from indexing the entire site');
    process.exit(1);
  }

  console.log('✅ robots.txt does not block the entire site');

  // Check for Allow directive
  if (!content.match(/Allow:\s*\//i)) {
    console.warn('⚠️  robots.txt missing "Allow: /" directive (recommended for clarity)');
  } else {
    console.log('✅ robots.txt has Allow directive');
  }

  // Check if sitemap files exist
  const sitemapIndexPath = path.join(distPath, 'sitemap-index.xml');
  const sitemapDirectPath = path.join(distPath, 'sitemap-0.xml');

  if (fs.existsSync(sitemapIndexPath)) {
    console.log('✅ sitemap-index.xml exists');
  } else {
    console.warn('⚠️  sitemap-index.xml not found');
  }

  if (fs.existsSync(sitemapDirectPath)) {
    console.log('✅ sitemap-0.xml exists');
  } else {
    console.warn('⚠️  sitemap-0.xml not found');
  }

  console.log('\n🎉 robots.txt validation passed! Your site is properly configured for search engine indexing.');
  
  // Display the current robots.txt content for verification
  console.log('\n📄 Current robots.txt content:');
  console.log('---');
  console.log(content);
  console.log('---');
}

// Run validation
try {
  validateRobotsTxt();
} catch (error) {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
}