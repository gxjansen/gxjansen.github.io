import * as fs from 'node:fs';
import * as path from 'node:path';

// Cache for content availability status
let availabilityCache: Record<string, boolean> | null = null;

// Load availability status from the generated JSON file
function loadAvailabilityStatus(): Record<string, boolean> {
  if (availabilityCache) {
    return availabilityCache;
  }

  try {
    const statusPath = path.join(process.cwd(), 'src', 'data', 'content-availability.json');
    if (fs.existsSync(statusPath)) {
      const content = fs.readFileSync(statusPath, 'utf-8');
      availabilityCache = JSON.parse(content);
      return availabilityCache;
    }
  } catch (error) {
    console.warn('Could not load content availability status:', error);
  }

  // Return empty object if no status file exists (all content assumed available)
  return {};
}

// Check if a specific URL is available
export function isContentAvailable(url: string): boolean {
  const status = loadAvailabilityStatus();
  
  // If URL is not in the status object, assume it's available (hasn't been checked)
  return status[url] !== false;
}

// Check if a YouTube video is available
export function isYouTubeVideoAvailable(videoUrl: string): boolean {
  return isContentAvailable(videoUrl);
}

// Check if a Spotify episode is available
export function isSpotifyEpisodeAvailable(episodeId: string): boolean {
  const url = `https://open.spotify.com/episode/${episodeId}`;
  return isContentAvailable(url);
}

// Check if an article is available
export function isArticleAvailable(articleUrl: string): boolean {
  return isContentAvailable(articleUrl);
}

// Filter press coverage items to only include available content
export function filterAvailableContent<T extends {
  youtubeLink?: string;
  spotifyEmbedId?: string;
  articleUrl?: string;
}>(items: T[]): T[] {
  return items.filter(item => {
    // Check YouTube availability
    if (item.youtubeLink && !isYouTubeVideoAvailable(item.youtubeLink)) {
      return false;
    }
    
    // Check Spotify availability
    if (item.spotifyEmbedId && !isSpotifyEpisodeAvailable(item.spotifyEmbedId)) {
      return false;
    }
    
    // Check article availability
    if (item.articleUrl && !item.youtubeLink && !item.spotifyEmbedId) {
      if (!isArticleAvailable(item.articleUrl)) {
        return false;
      }
    }
    
    return true;
  });
}

// Get availability report for debugging
export function getAvailabilityReport(): {
  total: number;
  available: number;
  unavailable: number;
  unavailableUrls: string[];
} {
  const status = loadAvailabilityStatus();
  const entries = Object.entries(status);
  const unavailableUrls = entries
    .filter(([_, available]) => !available)
    .map(([url]) => url);
  
  return {
    total: entries.length,
    available: entries.filter(([_, available]) => available).length,
    unavailable: unavailableUrls.length,
    unavailableUrls
  };
}