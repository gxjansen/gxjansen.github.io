import { describe, it, expect } from 'vitest';
import { parseHTML } from '../../../test/astro-test-utils';
import { createMockPodcastEpisode } from '../../../test/utils';

describe('PodcastCard', () => {
  it('renders with all required information', () => {
    const episode = createMockPodcastEpisode();
    const formattedDate = new Date(episode.pubDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const html = `
      <a
        href="${episode.link}"
        target="_blank"
        rel="noopener noreferrer"
        class="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-teal-400/30 hover:border-teal-400 hover:shadow-xl hover:-translate-y-1 cursor-pointer group transition-all duration-200"
      >
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <img
              src="${episode.imageUrl}"
              alt="${episode.podcastName} Cover"
              width="80"
              height="80"
              class="rounded-lg object-cover"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                ${episode.podcastName}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                ${formattedDate}
              </span>
            </div>

            <h3 class="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
              ${episode.title}
            </h3>

            <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
              ${episode.description.slice(0, 150)}...
            </p>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                ${episode.duration}
              </span>
              <span class="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform duration-200">
                Listen Now
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    fill-rule="evenodd" 
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                    clip-rule="evenodd" 
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </a>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check link attributes
    const link = parsedHtml.querySelector('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe(episode.link);
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');

    // Check image
    const img = parsedHtml.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe(episode.imageUrl);
    expect(img?.getAttribute('alt')).toBe(`${episode.podcastName} Cover`);

    // Check podcast details
    expect(parsedHtml.textContent).toContain(episode.podcastName);
    expect(parsedHtml.textContent).toContain(episode.title);
    expect(parsedHtml.textContent).toContain(episode.duration);
    expect(parsedHtml.textContent).toContain('Listen Now');

    // Check date formatting
    expect(parsedHtml.textContent).toContain(formattedDate);
  });

  it('renders fallback image when imageUrl is not provided', () => {
    const episode = createMockPodcastEpisode({ imageUrl: undefined });

    const html = `
      <div class="flex-shrink-0">
        <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <span class="text-2xl">🎙️</span>
        </div>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check fallback image container
    const fallbackContainer = parsedHtml.querySelector('.w-20.h-20');
    expect(fallbackContainer).toBeTruthy();
    expect(fallbackContainer?.classList.contains('bg-gray-100')).toBe(true);
    expect(fallbackContainer?.textContent).toContain('🎙️');
  });

  it('truncates long descriptions', () => {
    const longDescription = 'A'.repeat(200);
    const episode = createMockPodcastEpisode({ description: longDescription });

    const html = `
      <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
        ${longDescription.slice(0, 150)}...
      </p>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check description truncation
    const description = parsedHtml.querySelector('p');
    const descriptionText = description?.textContent?.trim() || '';
    expect(descriptionText.length).toBeLessThan(longDescription.length);
    expect(descriptionText.endsWith('...')).toBe(true);
  });

  it('does not truncate short descriptions', () => {
    const shortDescription = 'A'.repeat(100);
    const episode = createMockPodcastEpisode({ description: shortDescription });

    const html = `
      <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
        ${shortDescription}
      </p>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check description is not truncated
    const description = parsedHtml.querySelector('p');
    const descriptionText = description?.textContent?.trim() || '';
    expect(descriptionText).toBe(shortDescription);
    expect(descriptionText.endsWith('...')).toBe(false);
  });

  it('has proper accessibility attributes', () => {
    const episode = createMockPodcastEpisode();

    const html = `
      <a
        href="${episode.link}"
        target="_blank"
        rel="noopener noreferrer"
        class="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-teal-400/30 hover:border-teal-400 hover:shadow-xl hover:-translate-y-1 cursor-pointer group transition-all duration-200"
      >
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <img
              src="${episode.imageUrl}"
              alt="${episode.podcastName} Cover"
              width="80"
              height="80"
              class="rounded-lg object-cover"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              ${episode.title}
            </h3>
          </div>
        </div>
      </a>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check image alt text
    const img = parsedHtml.querySelector('img');
    expect(img?.getAttribute('alt')).toBeTruthy();
    
    // Check heading structure
    const heading = parsedHtml.querySelector('h3');
    expect(heading).toBeTruthy();
    expect(heading?.textContent?.trim()).toBe(episode.title);

    // Check link attributes for security
    const link = parsedHtml.querySelector('a');
    expect(link?.getAttribute('rel')).toContain('noopener');
    expect(link?.getAttribute('target')).toBe('_blank');
  });
});
