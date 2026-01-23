#!/usr/bin/env node

/**
 * Bluesky Link Script
 *
 * Posts a blog article to Bluesky and updates the post's frontmatter with the AT URI.
 *
 * Usage:
 *   npm run bluesky:link -- --slug "my-post-slug"
 *   npm run bluesky:link -- --slug "my-post-slug" --dry-run
 *
 * Environment variables (from .env.local):
 *   BLUESKY_HANDLE - Your Bluesky handle (e.g., gui.do)
 *   BLUESKY_APP_PASSWORD - App password from https://bsky.app/settings/app-passwords
 */

import { BskyAgent, RichText } from '@atproto/api';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://gui.do';
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'post');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const result = { slug: null, dryRun: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug' && args[i + 1]) {
      result.slug = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      result.dryRun = true;
    }
  }

  return result;
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
        process.env[key] = value;
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

// Read and parse MDX frontmatter
async function readPost(slug) {
  const postPath = path.join(POSTS_DIR, slug, 'index.mdx');

  try {
    let content = await fs.readFile(postPath, 'utf-8');
    // Normalize line endings to Unix-style
    content = content.replace(/\r\n/g, '\n');

    // Parse frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      throw new Error('Could not parse frontmatter');
    }

    const frontmatter = frontmatterMatch[1];
    const body = content.slice(frontmatterMatch[0].length);

    // Extract title
    const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/^["']|["']$/g, '') : null;

    // Check for existing blueskyUri
    const uriMatch = frontmatter.match(/^blueskyUri:\s*(.+)$/m);
    const existingUri = uriMatch ? uriMatch[1].replace(/^["']|["']$/g, '') : null;

    return {
      path: postPath,
      content,
      frontmatter,
      body,
      title,
      existingUri
    };
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Post not found: ${slug}\nLooking in: ${postPath}`);
    }
    throw err;
  }
}

// Update the MDX file with the blueskyUri
async function updatePost(postData, blueskyUri) {
  const { path: postPath, content, frontmatter } = postData;

  // Add blueskyUri to frontmatter
  const newFrontmatter = frontmatter.trimEnd() + `\nblueskyUri: "${blueskyUri}"`;
  const newContent = content.replace(
    /^---\n[\s\S]*?\n---/,
    `---\n${newFrontmatter}\n---`
  );

  await fs.writeFile(postPath, newContent, 'utf-8');
}

// Create a Bluesky post with link embed
async function createBlueskyPost(agent, title, url) {
  // Create rich text with the URL
  const text = `${title}\n\n${url}`;
  const rt = new RichText({ text });
  await rt.detectFacets(agent);

  // Fetch link card data for embed
  let embed = undefined;
  try {
    // Use Bluesky's link card resolver
    const cardData = await agent.app.bsky.embed.external.main({
      external: {
        uri: url,
        title: title,
        description: `Read the full article at ${SITE_URL}`
      }
    });
    embed = {
      $type: 'app.bsky.embed.external',
      external: {
        uri: url,
        title: title,
        description: `Read the full article at ${SITE_URL}`
      }
    };
  } catch (err) {
    console.log('Note: Could not create link card embed, posting without it');
  }

  // Create the post
  const response = await agent.post({
    text: rt.text,
    facets: rt.facets,
    embed,
    createdAt: new Date().toISOString()
  });

  return response.uri;
}

async function main() {
  const { slug, dryRun } = parseArgs();

  if (!slug) {
    console.error('Usage: npm run bluesky:link -- --slug "post-slug" [--dry-run]');
    process.exit(1);
  }

  console.log(`\nBluesky Link Script`);
  console.log(`${'='.repeat(50)}`);

  // Read the post
  console.log(`\nReading post: ${slug}`);
  const postData = await readPost(slug);

  if (!postData.title) {
    console.error('Error: Could not extract title from frontmatter');
    process.exit(1);
  }

  console.log(`Title: ${postData.title}`);

  if (postData.existingUri) {
    console.log(`\nWarning: Post already has a blueskyUri:`);
    console.log(`  ${postData.existingUri}`);
    console.log('\nTo update, first remove the existing blueskyUri from the frontmatter.');
    process.exit(1);
  }

  const postUrl = `${SITE_URL}/post/${slug}/`;
  console.log(`URL: ${postUrl}`);

  if (dryRun) {
    console.log('\n[DRY RUN] Would post to Bluesky:');
    console.log(`  "${postData.title}"`);
    console.log(`  ${postUrl}`);
    console.log('\n[DRY RUN] Would update frontmatter with blueskyUri');
    process.exit(0);
  }

  // Load environment and check credentials
  await loadEnv();

  const handle = process.env.BLUESKY_HANDLE;
  const password = process.env.BLUESKY_APP_PASSWORD;

  if (!handle || !password) {
    console.error('\nError: Missing Bluesky credentials');
    console.error('Please create .env.local with:');
    console.error('  BLUESKY_HANDLE=your-handle.bsky.social');
    console.error('  BLUESKY_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx');
    console.error('\nGet an app password at: https://bsky.app/settings/app-passwords');
    process.exit(1);
  }

  // Login to Bluesky
  console.log(`\nLogging in as ${handle}...`);
  const agent = new BskyAgent({ service: 'https://bsky.social' });

  try {
    await agent.login({ identifier: handle, password });
  } catch (err) {
    console.error('Error: Failed to login to Bluesky');
    console.error(err.message);
    process.exit(1);
  }

  // Create the post
  console.log('Creating Bluesky post...');
  const blueskyUri = await createBlueskyPost(agent, postData.title, postUrl);

  console.log(`\nBluesky post created!`);
  console.log(`AT URI: ${blueskyUri}`);

  // Convert AT URI to web URL for display
  const webUrl = blueskyUri
    .replace('at://', 'https://bsky.app/profile/')
    .replace('/app.bsky.feed.post/', '/post/');
  console.log(`Web URL: ${webUrl}`);

  // Update the frontmatter
  console.log('\nUpdating frontmatter...');
  await updatePost(postData, blueskyUri);

  console.log(`\n${'='.repeat(50)}`);
  console.log('Done! Next steps:');
  console.log(`  1. git add src/content/post/${slug}/index.mdx`);
  console.log(`  2. git commit -m "Link ${slug} to Bluesky"`);
  console.log(`  3. git push`);
  console.log('\nAfter deploy, comments will be enabled on the post.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
