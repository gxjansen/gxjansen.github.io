#!/usr/bin/env node

/**
 * Standard.site Publish Script
 *
 * Syncs blog posts to ATProto as site.standard.document records.
 * Uses post slug as the record key for deterministic AT-URIs.
 *
 * Handles:
 *   - Creating new document records for new posts
 *   - Updating existing records for edited posts
 *   - Deleting records for removed/drafted posts
 *
 * Usage:
 *   npm run standard-site:publish             # sync all posts
 *   npm run standard-site:publish -- --dry-run # preview changes
 *
 * Environment variables:
 *   BLUESKY_APP_PASSWORD - App password from https://bsky.app/settings/app-passwords
 *
 * Designed to run as part of the Netlify build command.
 *
 * --------------------------------------------------------------------------
 * Auth: deliberate app-password exception
 * --------------------------------------------------------------------------
 * The general rule is OAuth, never app passwords, for atproto automation. This
 * script is a conscious, scoped exception, decided 2026-06-15:
 *   - It's the site owner's own automation writing the owner's own
 *     site.standard.document records to the owner's own PDS. No third parties.
 *   - The secret lives only in the Netlify build environment, never in this
 *     repo.
 *   - The OAuth alternative (interactive auth -> rotating refresh token) is a
 *     poor fit for ephemeral CI and would force a periodic manual re-login that
 *     breaks the build until done. Not worth it here.
 * Hardening expected of BLUESKY_APP_PASSWORD:
 *   - a DEDICATED app password (e.g. named "netlify-standard-site-publish"), so
 *     it can be revoked in isolation, not a shared one.
 *   - set only as a Netlify environment variable.
 * If this script ever writes on behalf of anyone other than the owner, switch
 * to OAuth.
 */

import { AtpAgent } from '@atproto/api';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://gui.do';
const HANDLE = 'gui.do';
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'post');
const CONFIG_FILE = path.join(__dirname, '..', 'src', 'config', 'standardSite.json');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  return { dryRun: args.includes('--dry-run') };
}

// Load environment variables from .env.local (for local dev)
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

// Load the Standard.site config
async function loadConfig() {
  try {
    const content = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return { enabled: false, did: '', publicationUri: '' };
  }
}

// Read and parse MDX frontmatter for a single post
async function readPost(slug) {
  const postPath = path.join(POSTS_DIR, slug, 'index.mdx');

  let content = await fs.readFile(postPath, 'utf-8');
  content = content.replace(/\r\n/g, '\n');

  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const body = content.slice(frontmatterMatch[0].length);

  const get = (key) => {
    const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'));
    return match ? match[1] : null;
  };

  const draftMatch = frontmatter.match(/^draft:\s*(true|false)\s*$/m);
  const isDraft = draftMatch ? draftMatch[1] === 'true' : false;

  // Extract categories/tags
  const categoriesMatch = frontmatter.match(/^categories:\s*\n((?:\s+-\s+.+\n?)*)/m);
  let tags = [];
  if (categoriesMatch) {
    tags = categoriesMatch[1]
      .split('\n')
      .map(line => line.replace(/^\s+-\s+/, '').replace(/^["']|["']$/g, '').trim())
      .filter(Boolean);
  }

  // Extract plain text from body (strip MDX/markdown syntax)
  let stripped = body
    .replace(/import\s+.*?from\s+['"].*?['"]\s*;?\s*/g, '')
    .replace(/export\s+.*?;?\s*/g, '');
  // Loop HTML tag removal until stable to handle incomplete multi-char sequences
  let prev;
  do { prev = stripped; stripped = stripped.replace(/<[^>]+>/g, ''); } while (stripped !== prev);
  const textContent = stripped
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_~`]+/g, '')
    .replace(/>\s+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    slug,
    title: get('title'),
    pubDate: get('pubDate'),
    updatedDate: get('updatedDate'),
    description: get('description'),
    blueskyUri: get('blueskyUri'),
    isDraft,
    tags,
    textContent,
  };
}

// Resolve a frontmatter blueskyUri (a bsky.app web URL or an at:// URI) to an
// AT-URI, resolving handle -> DID when needed. Returns null if unparseable.
async function blueskyUriToAtUri(uri) {
  if (uri.startsWith('at://')) return uri;
  const m = uri.match(/bsky\.app\/profile\/([^/]+)\/post\/([^/?#]+)/);
  if (!m) return null;
  let authority = m[1];
  const rkey = m[2];
  if (!authority.startsWith('did:')) {
    // Time-box the network call so a slow/hanging Bluesky API never stalls the
    // Netlify build; degrade gracefully by returning null on any failure.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const r = await fetch(
        `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(authority)}`,
        { signal: controller.signal },
      );
      if (!r.ok) return null;
      const data = await r.json();
      if (!data?.did) return null;
      authority = data.did;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }
  return `at://${authority}/app.bsky.feed.post/${rkey}`;
}

// Fetch the CID for a post AT-URI (bskyPostRef needs both uri and cid).
async function fetchPostCid(atUri) {
  // Time-box the network call so a slow/hanging Bluesky API never stalls the
  // Netlify build; degrade gracefully by returning null on any failure.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const r = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(atUri)}&depth=0`,
      { signal: controller.signal },
    );
    if (!r.ok) return null;
    const data = await r.json();
    return data?.thread?.post?.cid ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// Get all post slugs
async function getAllPostSlugs() {
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  const slugs = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      try {
        await fs.access(path.join(POSTS_DIR, entry.name, 'index.mdx'));
        slugs.push(entry.name);
      } catch {
        // Skip directories without index.mdx
      }
    }
  }

  return slugs;
}

async function main() {
  const { dryRun } = parseArgs();

  console.log('\nStandard.site Publish');
  console.log('='.repeat(50));

  const config = await loadConfig();
  if (!config.enabled) {
    console.log('Standard.site not enabled yet. Run: npm run standard-site:setup');
    process.exit(0);
  }

  const { did, publicationUri } = config;
  console.log(`Publication: ${publicationUri}`);

  // Read all posts
  const slugs = await getAllPostSlugs();
  const posts = [];
  const publishedSlugs = new Set();

  for (const slug of slugs) {
    try {
      const post = await readPost(slug);
      if (!post || post.isDraft) continue;
      posts.push(post);
      publishedSlugs.add(slug);
    } catch (err) {
      console.error(`  Error reading ${slug}: ${err.message}`);
    }
  }

  console.log(`Found ${posts.length} published posts`);

  if (dryRun) {
    console.log('\n[DRY RUN] Would sync the following posts:');
    for (const post of posts) {
      console.log(`  + ${post.slug}: ${post.title}`);
    }
    console.log('\n[DRY RUN] Would also delete records for posts no longer published.');
    process.exit(0);
  }

  // Load credentials
  await loadEnv();
  const password = process.env.BLUESKY_APP_PASSWORD;

  if (!password) {
    console.log('No BLUESKY_APP_PASSWORD set, skipping Standard.site publish.');
    process.exit(0);
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

  // Get existing document records to detect deletes
  console.log('Fetching existing records...');
  const existingRecords = new Map();
  let cursor;
  do {
    const res = await agent.api.com.atproto.repo.listRecords({
      repo: did,
      collection: 'site.standard.document',
      limit: 100,
      cursor,
    });
    for (const record of res.data.records) {
      const rkey = record.uri.split('/').pop();
      existingRecords.set(rkey, record);
    }
    cursor = res.data.cursor;
  } while (cursor);

  console.log(`Existing records on PDS: ${existingRecords.size}`);

  // Sync: create/update posts
  let created = 0;
  let updated = 0;
  let deleted = 0;
  let unchanged = 0;
  let failed = 0;

  for (const post of posts) {
    const rkey = post.slug;
    const existing = existingRecords.get(rkey);

    const record = {
      $type: 'site.standard.document',
      site: publicationUri,
      title: post.title,
      path: `/post/${post.slug}/`,
      publishedAt: new Date(post.pubDate).toISOString(),
      textContent: post.textContent.slice(0, 100000),
    };

    if (post.description) record.description = post.description;
    if (post.updatedDate) record.updatedAt = new Date(post.updatedDate).toISOString();
    if (post.tags.length > 0) record.tags = post.tags;

    // Comments link (Juttu): site.standard.document.bskyPostRef ties this article
    // to a Bluesky post whose reply thread is the comment section. Preserve any
    // ref already on the record (e.g. linked in-widget via #comments-setup) so a
    // content edit here never wipes it; a frontmatter `blueskyUri` is
    // authoritative when present.
    let bskyPostRef = existing?.value?.bskyPostRef ?? undefined;
    if (post.blueskyUri) {
      const atUri = await blueskyUriToAtUri(post.blueskyUri);
      if (atUri && atUri !== bskyPostRef?.uri) {
        const cid = await fetchPostCid(atUri);
        if (cid) {
          bskyPostRef = { uri: atUri, cid };
        } else {
          console.warn(`  ! ${post.slug}: could not resolve CID for ${post.blueskyUri} (leaving comments unlinked)`);
        }
      }
    }
    if (bskyPostRef) record.bskyPostRef = bskyPostRef;

    // Check if update is needed by comparing all synced fields.
    // textContent and tags MUST be included: body-only edits (the common
    // case) leave title/description/dates untouched, so omitting them here
    // makes every body change look "unchanged" and the record never re-syncs.
    if (existing) {
      const val = existing.value;
      const same = val.title === record.title
        && val.path === record.path
        && val.publishedAt === record.publishedAt
        && val.description === record.description
        && val.updatedAt === record.updatedAt
        && val.textContent === record.textContent
        && JSON.stringify(val.tags || []) === JSON.stringify(record.tags || [])
        && JSON.stringify(val.bskyPostRef || null) === JSON.stringify(record.bskyPostRef || null);

      if (same) {
        unchanged++;
        continue;
      }
    }

    try {
      await agent.api.com.atproto.repo.putRecord({
        repo: did,
        collection: 'site.standard.document',
        rkey,
        record,
      });

      if (existing) {
        console.log(`  Updated: ${post.slug}`);
        updated++;
      } else {
        console.log(`  Created: ${post.slug}`);
        created++;
      }
    } catch (err) {
      console.error(`  Failed ${post.slug}: ${err.message}`);
      failed++;
    }
  }

  // Delete records for posts that no longer exist or are now drafts
  for (const [rkey] of existingRecords) {
    if (!publishedSlugs.has(rkey)) {
      try {
        await agent.api.com.atproto.repo.deleteRecord({
          repo: did,
          collection: 'site.standard.document',
          rkey,
        });
        console.log(`  Deleted: ${rkey}`);
        deleted++;
      } catch (err) {
        console.error(`  Failed to delete ${rkey}: ${err.message}`);
        failed++;
      }
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Created: ${created}, Updated: ${updated}, Unchanged: ${unchanged}, Deleted: ${deleted}, Failed: ${failed}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
