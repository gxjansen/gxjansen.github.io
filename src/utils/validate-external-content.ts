import * as fs from 'node:fs';
import * as path from 'node:path';

interface ValidationResult {
  url: string;
  type: 'youtube' | 'spotify' | 'article';
  available: boolean;
  error?: string;
  statusCode?: number;
  timestamp: string;
}

interface ValidationReport {
  totalChecked: number;
  available: number;
  unavailable: number;
  results: ValidationResult[];
  timestamp: string;
}

// Validate YouTube video availability
async function validateYouTubeVideo(videoUrl: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    url: videoUrl,
    type: 'youtube',
    available: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Extract video ID from URL
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    if (!match) {
      result.error = 'Invalid YouTube URL format';
      return result;
    }

    const videoId = match[1];
    // Use YouTube oEmbed API which doesn't require authentication
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    result.statusCode = response.status;
    result.available = response.status === 200;
    
    if (!result.available) {
      result.error = `YouTube video not found (${response.status})`;
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return result;
}

// Validate Spotify episode availability
async function validateSpotifyEpisode(episodeId: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    url: `https://open.spotify.com/episode/${episodeId}`,
    type: 'spotify',
    available: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Use Spotify oEmbed API which doesn't require authentication
    const response = await fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/episode/${episodeId}`);
    
    result.statusCode = response.status;
    result.available = response.status === 200;
    
    if (!result.available) {
      result.error = `Spotify episode not found (${response.status})`;
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return result;
}

// Validate article URL availability
async function validateArticleUrl(url: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    url,
    type: 'article',
    available: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Use HEAD request to check availability without downloading full content
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ContentValidator/1.0)'
      }
    });
    
    result.statusCode = response.status;
    // Consider 2xx and 3xx as available (redirects are OK)
    result.available = response.status >= 200 && response.status < 400;
    
    if (!result.available) {
      result.error = `Article not accessible (${response.status})`;
    }
  } catch (error) {
    // For CORS or network errors, try a simple GET request
    try {
      const getResponse = await fetch(url, {
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ContentValidator/1.0)'
        }
      });
      
      result.statusCode = getResponse.status;
      result.available = getResponse.status >= 200 && getResponse.status < 400;
      
      if (!result.available) {
        result.error = `Article not accessible (${getResponse.status})`;
      }
    } catch (getError) {
      result.error = getError instanceof Error ? getError.message : 'Unknown error';
    }
  }

  return result;
}

// Main validation function
export async function validateExternalContent(items: Array<{
  title: string;
  youtubeLink?: string;
  spotifyEmbedId?: string;
  articleUrl?: string;
}>): Promise<ValidationReport> {
  const results: ValidationResult[] = [];
  let available = 0;
  let unavailable = 0;

  console.log(`Starting validation of ${items.length} items...`);

  for (const item of items) {
    // Validate YouTube videos
    if (item.youtubeLink) {
      const result = await validateYouTubeVideo(item.youtubeLink);
      results.push(result);
      if (result.available) available++;
      else unavailable++;
      
      console.log(`✓ Checked YouTube: ${item.title} - ${result.available ? 'Available' : 'Unavailable'}`);
    }

    // Validate Spotify episodes
    if (item.spotifyEmbedId) {
      const result = await validateSpotifyEpisode(item.spotifyEmbedId);
      results.push(result);
      if (result.available) available++;
      else unavailable++;
      
      console.log(`✓ Checked Spotify: ${item.title} - ${result.available ? 'Available' : 'Unavailable'}`);
    }

    // Validate articles
    if (item.articleUrl && !item.youtubeLink && !item.spotifyEmbedId) {
      const result = await validateArticleUrl(item.articleUrl);
      results.push(result);
      if (result.available) available++;
      else unavailable++;
      
      console.log(`✓ Checked Article: ${item.title} - ${result.available ? 'Available' : 'Unavailable'}`);
    }

    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const report: ValidationReport = {
    totalChecked: results.length,
    available,
    unavailable,
    results,
    timestamp: new Date().toISOString()
  };

  return report;
}

// Save validation report
export function saveValidationReport(report: ValidationReport, outputPath: string): void {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`\nValidation report saved to: ${outputPath}`);
  console.log(`Total checked: ${report.totalChecked}`);
  console.log(`Available: ${report.available}`);
  console.log(`Unavailable: ${report.unavailable}`);
  
  if (report.unavailable > 0) {
    console.log('\nUnavailable content:');
    report.results
      .filter(r => !r.available)
      .forEach(r => {
        console.log(`- ${r.type}: ${r.url} (${r.error})`);
      });
  }
}

// Create a validation cache/status file
export function createValidationStatus(report: ValidationReport): Record<string, boolean> {
  const status: Record<string, boolean> = {};
  
  report.results.forEach(result => {
    status[result.url] = result.available;
  });
  
  return status;
}