import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

const PODCAST_FEEDS = [
  'https://feeds.transistor.fm/sheeptank',
  'https://feeds.transistor.fm/cro-cafe',
  'https://feeds.transistor.fm/cro-cafe-nl'
];

export const handler = async () => {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });

    // Fetch all feeds
    const feedPromises = PODCAST_FEEDS.map(async (feedUrl) => {
      const response = await fetch(feedUrl);
      const xml = await response.text();
      const result = parser.parse(xml);
      
      // Extract episodes from the feed
      const channel = result.rss.channel;
      const items = channel.item || [];
      
      // Map items to our episode format
      return items.map(item => ({
        title: item.title,
        description: item.description,
        pubDate: item.pubDate,
        duration: item['itunes:duration'] || '',
        link: item.link,
        podcastName: channel.title
      }));
    });

    // Wait for all feeds to be fetched and parsed
    const allEpisodes = await Promise.all(feedPromises)
      .then(results => results.flat())
      .catch(error => {
        console.error('Error processing feeds:', error);
        return [];
      });

    // Sort episodes by date
    const sortedEpisodes = allEpisodes.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    // Return only the latest 20 episodes
    const latestEpisodes = sortedEpisodes.slice(0, 20);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // Allow CORS during development
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(latestEpisodes)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch podcast feeds' })
    };
  }
};
