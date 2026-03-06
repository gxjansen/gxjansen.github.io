#!/usr/bin/env node

/**
 * Standard.site Setup Script
 *
 * One-time script to create a site.standard.publication record on your PDS
 * and generate the config + .well-known verification file.
 *
 * Usage:
 *   npm run standard-site:setup
 *   npm run standard-site:setup -- --dry-run
 *
 * Environment variables (from .env.local):
 *   BLUESKY_APP_PASSWORD - App password from https://bsky.app/settings/app-passwords
 */

import { AtpAgent } from '@atproto/api';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://gui.do';
const HANDLE = 'gui.do';
const SITE_NAME = 'Guido Jansen';
const SITE_DESCRIPTION = 'Personal website of Guido Jansen - writing about technology, psychology, and e-commerce.';
const WELL_KNOWN_DIR = path.join(__dirname, '..', 'public', '.well-known');
const WELL_KNOWN_FILE = path.join(WELL_KNOWN_DIR, 'site.standard.publication');
const CONFIG_FILE = path.join(__dirname, '..', 'src', 'config', 'standardSite.json');

// Parse command line arguments
function parseArgs() {
  return { dryRun: process.argv.slice(2).includes('--dry-run') };
}

// Load environment variables from .env.local
async function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  try {
    const content = await fs.readFile(envPath, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

// Write both config files from a publication URI and DID
async function writeConfig(did, publicationUri) {
  // Write .well-known file
  await fs.mkdir(WELL_KNOWN_DIR, { recursive: true });
  await fs.writeFile(WELL_KNOWN_FILE, publicationUri + '\n', 'utf-8');
  console.log('  Created public/.well-known/site.standard.publication');

  // Write Astro config
  const config = { enabled: true, did, publicationUri };
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n', 'utf-8');
  console.log('  Updated src/config/standardSite.json');
}

async function main() {
  const { dryRun } = parseArgs();

  console.log('\nStandard.site Setup');
  console.log('='.repeat(50));

  if (dryRun) {
    console.log('\n[DRY RUN] Would create publication:');
    console.log(`  Name: ${SITE_NAME}`);
    console.log(`  URL: ${SITE_URL}`);
    console.log(`  Description: ${SITE_DESCRIPTION}`);
    console.log('\n[DRY RUN] Would write:');
    console.log('  public/.well-known/site.standard.publication');
    console.log('  src/config/standardSite.json');
    process.exit(0);
  }

  // Load environment and check credentials
  await loadEnv();
  const password = process.env.BLUESKY_APP_PASSWORD;

  if (!password) {
    console.error('\nError: Missing BLUESKY_APP_PASSWORD');
    console.error('Please create .env.local with:');
    console.error('  BLUESKY_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx');
    console.error('\nGet an app password at: https://bsky.app/settings/app-passwords');
    process.exit(1);
  }

  // Login
  console.log(`\nLogging in as ${HANDLE}...`);
  const agent = new AtpAgent({ service: 'https://bsky.social' });

  try {
    await agent.login({ identifier: HANDLE, password });
  } catch (err) {
    console.error('Error: Failed to login to Bluesky');
    console.error(err.message);
    process.exit(1);
  }

  const did = agent.session.did;
  console.log(`DID: ${did}`);

  // Check if a publication record already exists
  console.log('\nChecking for existing publication records...');
  try {
    const existing = await agent.api.com.atproto.repo.listRecords({
      repo: did,
      collection: 'site.standard.publication',
      limit: 10,
    });

    if (existing.data.records.length > 0) {
      const record = existing.data.records[0];
      console.log(`Found existing publication: ${record.value.name}`);
      console.log(`AT-URI: ${record.uri}`);

      await writeConfig(did, record.uri);

      console.log(`\n${'='.repeat(50)}`);
      console.log('Setup complete! Existing publication record reused.');
      console.log('\nNext steps:');
      console.log('  1. Commit the new files');
      console.log('  2. Add BLUESKY_APP_PASSWORD to Netlify env vars');
      console.log('  3. Deploy');
      process.exit(0);
    }
  } catch (err) {
    // Collection might not exist yet
  }

  // Create the publication record
  console.log('\nCreating publication record...');
  const response = await agent.api.com.atproto.repo.createRecord({
    repo: did,
    collection: 'site.standard.publication',
    record: {
      $type: 'site.standard.publication',
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      preferences: {
        showInDiscover: true,
      },
      createdAt: new Date().toISOString(),
    },
  });

  const publicationUri = response.data.uri;
  console.log(`Publication created: ${publicationUri}`);

  await writeConfig(did, publicationUri);

  console.log(`\n${'='.repeat(50)}`);
  console.log('Setup complete!');
  console.log('\nNext steps:');
  console.log('  1. Commit the new files');
  console.log('  2. Add BLUESKY_APP_PASSWORD to Netlify env vars');
  console.log('  3. Deploy');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
