
import { XMLParser } from 'fast-xml-parser';

const PODCAST_FEEDS = [
  'https://feeds.transistor.fm/sheeptank',
  'https://feeds.transistor.fm/cro-cafe',
  'https://feeds.transistor.fm/cro-cafe-nl'
];

const CACHE_TTL = 3600; // Cache for 1 hour
const FETCH_TIMEOUT = 5000; // 5 second timeout for feed fetches

// Fetch with timeout
const fetchWithTimeout = async (url, timeout) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Function to extract episode ID from enclosure URL
const getEpisodeId = (item) => {
  if (item.enclosure && item.enclosure["@_url"]) {
    const match = item.enclosure["@_url"].match(/https:\/\/media\.transistor\.fm\/([^/]+)/);
    return match ? match[1] : null;
  }
  return null;
};

// Parse feed with error handling
const parseFeed = async (feedUrl) => {
  try {
    const response = await fetchWithTimeout(feedUrl, FETCH_TIMEOUT);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    
    const result = parser.parse(xml);
    const channel = result.rss.channel;
    const items = channel.item || [];
    
    return items.map(item => {
      const episodeId = getEpisodeId(item);
      return {
        title: item.title,
        description: item.description,
        pubDate: item.pubDate,
        duration: item['itunes:duration'] || '',
        link: episodeId ? `https://share.transistor.fm/e/${episodeId}` : '',
        podcastName: channel.title
      };
    });
  } catch (error) {
    console.error(`Error fetching feed ${feedUrl}:`, error);
    return [];
  }
};

export const handler = async (event, context) => {
  try {
    // Set response headers with strong caching
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour in browser and CDN
      'Surrogate-Control': 'max-age=3600', // Additional CDN-specific cache
      'stale-while-revalidate': '86400' // Allow serving stale content for up to 24 hours while revalidating
    };

    // Fetch all feeds in parallel with error handling for each
    const allEpisodes = (await Promise.all(
      PODCAST_FEEDS.map(url => parseFeed(url))
    )).flat();

    // Sort episodes by date
    const sortedEpisodes = allEpisodes.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    // Get latest 20 episodes
    const latestEpisodes = sortedEpisodes.slice(0, 20);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(latestEpisodes)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch podcast feeds',
        message: error.message 
      })
    };
  }
};
