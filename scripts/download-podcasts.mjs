#!/usr/bin/env node
/**
 * One-time script to download podcast MP3 files from RSS feeds
 * Run with: node scripts/download-podcasts.mjs
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'public', 'audio', 'podcasts');

// Episode mappings: Spotify ID -> RSS feed + search criteria
const EPISODES = [
  {
    spotifyId: '1JQOINF7985dcVMc9C6bKD',
    title: 'An Overheated Dutch Guy',
    rssUrl: 'http://magetalk.com/feed',
    searchTerms: ['overheated', 'dutch', 'guido'],
    publicationDate: '2020-08-25',
    filename: 'magetalk-overheated-dutch-guy.mp3'
  },
  {
    spotifyId: '7hbnazzIfprpRGTDPINaoc',
    title: 'De meest gestelde vragen over experimenten',
    rssUrl: 'https://growth-lab.captivate.fm/rssfeed',
    searchTerms: ['experimenten', 'guido'],
    publicationDate: '2022-01-19',
    filename: 'growth-lab-experimenten.mp3'
  },
  {
    spotifyId: '45DMHmImVV74DceRBnRE5c',
    title: 'Dutchento Interview',
    rssUrl: 'https://feeds.transistor.fm/dutchento',
    searchTerms: ['ben marks', 'adobe', 'interview'],
    publicationDate: '2018-04-17',
    filename: 'dutchento-interview-ben-marks.mp3'
  },
  {
    spotifyId: '7tIP7Fz3IfDXKMX5M8lUnG',
    title: 'Dutchento origins',
    rssUrl: 'https://feeds.transistor.fm/dutchento',
    searchTerms: ['origins', 'sander mangel', 'dutchento'],
    publicationDate: '2017-08-18',
    filename: 'dutchento-origins.mp3'
  },
  {
    spotifyId: '5UJuKMx1f8mNzJqELQA0Wx',
    title: 'Glibberige aansmeertechnieken',
    rssUrl: 'https://rss.art19.com/met-nerds-om-tafel',
    searchTerms: ['glibberig', 'aansmeertechnieken', 'guido'],
    publicationDate: '2020-01-05',
    filename: 'mnot-glibberige-aansmeertechnieken.mp3'
  },
  {
    spotifyId: '2MaVKAIBT9EvW8JicDMBvM',
    title: 'MageTalk Episode 45',
    rssUrl: 'http://magetalk.com/feed',
    searchTerms: ['episode 45', 'netherdutch'],
    publicationDate: '2015-06-05',
    filename: 'magetalk-episode-45.mp3'
  },
  {
    spotifyId: '5EFVmi3Pjga34RMQkRhrH5',
    title: 'Meeting Guido X Jansen',
    rssUrl: 'https://anchor.fm/s/1f579e18/podcast/rss',
    searchTerms: ['guido', 'jansen', 'cognitive'],
    publicationDate: '2019-04-08',
    filename: 'digital-explained-guido-jansen.mp3'
  },
  {
    spotifyId: '3ZW2obcTEHpo7urYLqJr2g',
    title: 'Psychology Behind User Engagement',
    rssUrl: 'https://feeds.buzzsprout.com/1677508.rss',
    searchTerms: ['psychology', 'user engagement', 'guido'],
    publicationDate: '2024-04-04',
    filename: 'nohacks-psychology-user-engagement.mp3'
  },
  {
    spotifyId: '0RnLDa3osFqoymR6d05J1l',
    title: 'SaaS, PaaS, IaaS en open-source e-commerce platformen',
    rssUrl: 'https://feeds.soundcloud.com/users/soundcloud:users:1036aborting-frmwrk/sounds.rss',
    searchTerms: ['saas', 'paas', 'guido', 'open-source'],
    publicationDate: '2022-06-16',
    filename: 'frmwrk-saas-paas-iaas.mp3',
    // Fallback: try Springcast
    fallbackRss: 'https://feed.pod.co/op-weg-naar-20-miljoen'
  },
  {
    spotifyId: '3KMHHpQ39ZJTjyab08Y8Tx',
    title: 'The psychology of cognitive customer behavior',
    rssUrl: 'https://feeds.transistor.fm/talk-commerce',
    searchTerms: ['psychology', 'cognitive', 'guido'],
    publicationDate: '2022-01-20',
    filename: 'talk-commerce-psychology-cognitive.mp3'
  }
];

/**
 * Parse RSS XML and extract episodes
 */
function parseRss(xmlText) {
  const episodes = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemXml = match[1];

    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i);
    const enclosureMatch = itemXml.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*>/i);
    const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);

    if (titleMatch && enclosureMatch) {
      episodes.push({
        title: titleMatch[1].trim(),
        pubDate: pubDateMatch ? pubDateMatch[1] : '',
        audioUrl: enclosureMatch[1],
        description: descMatch ? descMatch[1].substring(0, 500) : ''
      });
    }
  }

  return episodes;
}

/**
 * Find episode by matching search terms and/or date
 */
function findEpisode(episodes, searchTerms, publicationDate) {
  const targetDate = new Date(publicationDate);

  // Score each episode
  const scored = episodes.map(ep => {
    let score = 0;
    const titleLower = ep.title.toLowerCase();
    const descLower = ep.description.toLowerCase();

    // Check search terms
    for (const term of searchTerms) {
      if (titleLower.includes(term.toLowerCase())) score += 10;
      if (descLower.includes(term.toLowerCase())) score += 5;
    }

    // Check date proximity (within 7 days = bonus)
    if (ep.pubDate) {
      const epDate = new Date(ep.pubDate);
      const daysDiff = Math.abs((epDate - targetDate) / (1000 * 60 * 60 * 24));
      if (daysDiff < 7) score += 20;
      if (daysDiff < 30) score += 10;
    }

    return { ...ep, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0] : null;
}

/**
 * Download a file from URL
 */
async function downloadFile(url, outputPath) {
  console.log(`  Downloading from: ${url}`);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; PodcastDownloader/1.0)'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  await writeFile(outputPath, Buffer.from(buffer));

  const sizeMB = (buffer.byteLength / (1024 * 1024)).toFixed(2);
  console.log(`  Saved: ${outputPath} (${sizeMB} MB)`);
}

/**
 * Main function
 */
async function main() {
  console.log('Podcast MP3 Downloader\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  const results = [];
  const errors = [];

  for (const episode of EPISODES) {
    console.log(`\n[${ EPISODES.indexOf(episode) + 1}/${EPISODES.length}] ${episode.title}`);

    const outputPath = join(OUTPUT_DIR, episode.filename);

    // Skip if already downloaded
    if (existsSync(outputPath)) {
      console.log('  Already exists, skipping...');
      results.push({ ...episode, status: 'exists', audioUrl: null });
      continue;
    }

    try {
      // Fetch RSS feed
      console.log(`  Fetching RSS: ${episode.rssUrl}`);
      const rssResponse = await fetch(episode.rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PodcastDownloader/1.0)'
        }
      });

      if (!rssResponse.ok) {
        throw new Error(`RSS fetch failed: ${rssResponse.status}`);
      }

      const rssText = await rssResponse.text();
      const episodes = parseRss(rssText);
      console.log(`  Found ${episodes.length} episodes in feed`);

      // Find matching episode
      const found = findEpisode(episodes, episode.searchTerms, episode.publicationDate);

      if (!found) {
        // Try fallback RSS if available
        if (episode.fallbackRss) {
          console.log(`  Not found, trying fallback RSS...`);
          const fallbackResponse = await fetch(episode.fallbackRss);
          if (fallbackResponse.ok) {
            const fallbackText = await fallbackResponse.text();
            const fallbackEpisodes = parseRss(fallbackText);
            const fallbackFound = findEpisode(fallbackEpisodes, episode.searchTerms, episode.publicationDate);
            if (fallbackFound) {
              await downloadFile(fallbackFound.audioUrl, outputPath);
              results.push({ ...episode, status: 'downloaded', audioUrl: fallbackFound.audioUrl });
              continue;
            }
          }
        }
        throw new Error('Episode not found in RSS feed');
      }

      console.log(`  Found: "${found.title}" (score: ${found.score})`);

      // Download the MP3
      await downloadFile(found.audioUrl, outputPath);
      results.push({ ...episode, status: 'downloaded', audioUrl: found.audioUrl });

    } catch (error) {
      console.error(`  ERROR: ${error.message}`);
      errors.push({ episode, error: error.message });
      results.push({ ...episode, status: 'error', error: error.message });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY\n');

  const downloaded = results.filter(r => r.status === 'downloaded').length;
  const existing = results.filter(r => r.status === 'exists').length;
  const failed = results.filter(r => r.status === 'error').length;

  console.log(`Downloaded: ${downloaded}`);
  console.log(`Already existed: ${existing}`);
  console.log(`Failed: ${failed}`);

  if (errors.length > 0) {
    console.log('\nFailed episodes:');
    for (const { episode, error } of errors) {
      console.log(`  - ${episode.title}: ${error}`);
    }
  }

  // Generate mapping for press-coverage.ts
  console.log('\n' + '='.repeat(60));
  console.log('Add to press-coverage.ts:\n');
  for (const result of results) {
    if (result.status !== 'error') {
      console.log(`// ${result.title}`);
      console.log(`audioFile: "/audio/podcasts/${result.filename}",`);
      console.log('');
    }
  }
}

main().catch(console.error);
