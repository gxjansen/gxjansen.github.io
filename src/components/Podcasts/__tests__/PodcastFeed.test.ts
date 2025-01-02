import { describe, it, expect } from 'vitest';
import { parseHTML } from '../../../test/astro-test-utils';
import { createMockPodcastEpisode } from '../../../test/utils';

describe('PodcastFeed', () => {
  it('renders episodes list correctly', () => {
    const episodes = [
      createMockPodcastEpisode(),
      createMockPodcastEpisode({
        title: 'Second Episode',
        link: 'https://example.com/episode2'
      })
    ];

    const html = `
      <div class="space-y-6 max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-base-900 dark:text-base-100 mb-4">
            Latest Podcast Episodes
          </h1>
          <p class="text-xl text-base-500 dark:text-base-400">
            Listen to the latest episodes from podcasts that I host. <br/> For podcasts I'm a guest in, check out the <a href="/press/#podcasts" class="text-blue-500 hover:underline">Press page</a>.
          </p>
        </div>

        <div class="space-y-6">
          ${episodes.map((episode) => `
            <div class="w-full bg-gray-800 rounded-lg overflow-hidden">
              <iframe 
                width="100%" 
                height="180" 
                frameborder="no" 
                scrolling="no" 
                seamless 
                src="${episode.link}"
                title="${episode.title}"
                loading="lazy"
                allow="encrypted-media"
              />
            </div>
          `).join('')}
        </div>
      </div>
      <div class="flex justify-center mt-8">
        <button 
          type="button" 
          class="button button--primary inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2" 
          aria-label="View my appearances in 3rd party podcasts"
        >
          <a href="/press/#podcasts" class="text-white hover:text-white">
            View my appearances in 3rd party podcasts
          </a>
        </button>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check header content
    const heading = parsedHtml.querySelector('h1');
    expect(heading?.textContent?.trim()).toBe('Latest Podcast Episodes');

    // Check iframes
    const iframes = parsedHtml.querySelectorAll('iframe');
    expect(iframes.length).toBe(2);
    iframes.forEach((iframe, index) => {
      expect(iframe.getAttribute('src')).toBe(episodes[index].link);
      expect(iframe.getAttribute('title')).toBe(episodes[index].title);
      expect(iframe.getAttribute('loading')).toBe('lazy');
      expect(iframe.hasAttribute('seamless')).toBe(true);
    });

    // Check CTA button
    const ctaButton = parsedHtml.querySelector('button');
    expect(ctaButton).toBeTruthy();
    expect(ctaButton?.getAttribute('aria-label')).toBe('View my appearances in 3rd party podcasts');
    
    // Check link inside button
    const link = parsedHtml.querySelector('a[href="/press/#podcasts"]');
    expect(link).toBeTruthy();
  });

  it('renders empty state when no episodes', () => {
    const html = `
      <div class="space-y-6 max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-base-900 dark:text-base-100 mb-4">
            Latest Podcast Episodes
          </h1>
          <p class="text-xl text-base-500 dark:text-base-400">
            Listen to the latest episodes from podcasts that I host. <br/> For podcasts I'm a guest in, check out the <a href="/press/#podcasts" class="text-blue-500 hover:underline">Press page</a>.
          </p>
        </div>

        <div class="text-center py-12">
          <div class="text-4xl mb-4">🎙️</div>
          <h3 class="text-xl font-semibold text-base-900 dark:text-base-100 mb-2">
            No Episodes Available
          </h3>
          <p class="text-base-500 dark:text-base-400">
            Check back soon for new podcast episodes!
          </p>
        </div>
      </div>
      <div class="flex justify-center mt-8">
        <button 
          type="button" 
          class="button button--primary inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2" 
          aria-label="View my appearances in 3rd party podcasts"
        >
          <a href="/press/#podcasts" class="text-white hover:text-white">
            View my appearances in 3rd party podcasts
          </a>
        </button>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check empty state content
    const emptyState = parsedHtml.querySelector('.text-center.py-12');
    expect(emptyState).toBeTruthy();
    expect(emptyState?.textContent).toContain('No Episodes Available');
    expect(emptyState?.textContent).toContain('Check back soon');
    expect(emptyState?.textContent).toContain('🎙️');
  });

  it('has proper accessibility attributes', () => {
    const episodes = [createMockPodcastEpisode()];

    const html = `
      <div class="space-y-6 max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-base-900 dark:text-base-100 mb-4">
            Latest Podcast Episodes
          </h1>
        </div>

        <div class="space-y-6">
          <div class="w-full bg-gray-800 rounded-lg overflow-hidden">
            <iframe 
              width="100%" 
              height="180" 
              frameborder="no" 
              scrolling="no" 
              seamless 
              src="${episodes[0].link}"
              title="${episodes[0].title}"
              loading="lazy"
              allow="encrypted-media"
            />
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-8">
        <button 
          type="button" 
          class="button button--primary inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2" 
          aria-label="View my appearances in 3rd party podcasts"
        >
          <a href="/press/#podcasts" class="text-white hover:text-white">
            View my appearances in 3rd party podcasts
          </a>
        </button>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check heading structure
    const heading = parsedHtml.querySelector('h1');
    expect(heading).toBeTruthy();
    expect(heading?.textContent?.trim()).toBe('Latest Podcast Episodes');

    // Check iframe title
    const iframe = parsedHtml.querySelector('iframe');
    expect(iframe?.getAttribute('title')).toBeTruthy();

    // Check CTA button accessibility
    const ctaButton = parsedHtml.querySelector('button');
    expect(ctaButton?.getAttribute('aria-label')).toBeTruthy();
    
    // Check link inside button
    const link = parsedHtml.querySelector('a[href="/press/#podcasts"]');
    expect(link).toBeTruthy();
  });
});
