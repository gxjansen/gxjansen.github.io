# Podcast Feed Implementation Plan

## Overview
Create a unified podcast feed that aggregates and displays the latest episodes from multiple podcast RSS feeds in a card-based layout.

Embed this in the exi

## Data Structure

### Podcast Episode Type
```typescript
interface PodcastEpisode {
  title: string;
  description: string;
  pubDate: Date;
  duration: string;
  audioUrl: string;
  podcastName: string; // Source podcast name
  imageUrl?: string;   // Episode or podcast cover image
  link: string;        // Link to episode page
}
```

## Implementation Steps

### 1. RSS Feed Integration

#### Development Environment
Create `src/data/sample-podcast-data.json` containing recent episodes from the podcasts for local development:
```typescript
const samplePodcastData: PodcastEpisode[] = [/* sample episodes */];
```

#### Production Environment
Create a Netlify Function `functions/getPodcastFeeds.js` that will:
- Fetch RSS feeds from the provided URLs:
  * https://feeds.transistor.fm/sheeptank 
  * https://feeds.transistor.fm/cro-cafe 
  * https://feeds.transistor.fm/cro-cafe-nl
- Parse XML responses using `fast-xml-parser`
- Transform feed data into our PodcastEpisode interface
- Merge episodes from different feeds
- Sort by publication date
- Return the latest 20 episodes

### 2. Component Architecture

#### PodcastCard Component
Create a new component `src/components/PodcastCard.astro`:
```typescript
interface Props {
  episode: PodcastEpisode;
}
```
Display:
- Podcast/Episode image
- Episode title
- Podcast name
- Publication date
- Duration
- Brief description (truncated)
- Play/Listen button linking to the episode

#### PodcastFeed Component
Create a new component `src/components/PodcastFeed.astro`:
```typescript
interface Props {
  episodes: PodcastEpisode[];
}
```
Features:
- Render PodcastCard components in a single column layout
- Handle loading states
- Implement error handling for failed feed fetches

### 3. Page Implementation
Update `/src/pages/podcasts/index.astro`:

```typescript
// Development vs Production data fetching
const episodes = import.meta.env.PROD 
  ? await fetch('/.netlify/functions/getPodcastFeeds').then(r => r.json())
  : await import('../../data/sample-podcast-data.json').then(m => m.default);
```

- Pass episode data to PodcastFeed component
- Implement page layout and header
- Add metadata and SEO elements

### 4. Styling
- Use Tailwind classes for consistent styling
- Adapt card design from events page
- Ensure responsive layout
- Implement hover states and transitions
- Maintain dark theme consistency

### 5. Error Handling
- Implement graceful fallbacks for failed feed fetches
- Add placeholder images for missing episode artwork
- Handle missing or malformed feed data

## Required Packages
Already available:
- date-fns: For date formatting

Need to add to Netlify Function:
- node-fetch: For fetching RSS feeds
- fast-xml-parser: For parsing RSS XML data

## Build Process
1. Development:
   - Uses local sample data
   - Fast development cycle
   - No CORS issues

2. Production:
   - Netlify Function fetches and parses RSS feeds
   - Function runs on build to generate static content
   - Page rebuilds periodically via Netlify webhooks

## Next Steps
1. Create sample podcast data file
2. Implement components
3. Create Netlify Function
4. Set up build hooks
5. Test in both development and production environments

## Local Development Testing
To test the implementation locally:
1. Use sample data that mirrors production RSS feed structure
2. Implement components and styling
3. Test page layout and responsiveness
4. Verify error states using modified sample data

## Production Deployment
1. Deploy Netlify Function
2. Set up build hooks for periodic updates
3. Monitor feed fetching and parsing
4. Verify production environment behavior
