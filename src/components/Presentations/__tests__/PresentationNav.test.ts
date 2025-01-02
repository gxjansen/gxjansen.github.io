import { describe, it, expect } from 'vitest';
import { parseHTML } from '../../../test/astro-test-utils';

describe('PresentationNav', () => {
  const mockPresentations = [
    {
      slug: 'presentation-1',
      data: { title: 'Presentation 1' }
    },
    {
      slug: 'presentation-2',
      data: { title: 'Presentation 2' }
    },
    {
      slug: 'presentation-3',
      data: { title: 'Presentation 3' }
    }
  ];

  it('renders navigation for middle presentation', () => {
    const html = `
      <nav class="border-t border-base-200 dark:border-base-800 mt-12 pt-8">
        <div class="flex justify-between items-center">
          <a href="/presentations" class="text-base-600 dark:text-base-400 hover:text-primary-500 dark:hover:text-primary-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <path d="M15 6l-6 6l6 6" />
            </svg>
            Back to Presentation Overview
          </a>
        </div>

        <div class="flex justify-between items-center mt-8 gap-4">
          <a href="/presentations/presentation-1" class="flex-1 p-4 rounded-lg border border-base-200 dark:border-base-800 hover:border-primary-500 dark:hover:border-primary-400 group">
            <span class="text-sm text-base-500 dark:text-base-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                <path d="M15 6l-6 6l6 6" />
              </svg>
              Previous
            </span>
            <p class="font-medium mt-1 text-base-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 line-clamp-2">
              Presentation 1
            </p>
          </a>

          <a href="/presentations/presentation-3" class="flex-1 p-4 rounded-lg border border-base-200 dark:border-base-800 hover:border-primary-500 dark:hover:border-primary-400 group text-right">
            <span class="text-sm text-base-500 dark:text-base-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 flex items-center gap-1 justify-end">
              Next
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                <path d="M9 6l6 6l-6 6" />
              </svg>
            </span>
            <p class="font-medium mt-1 text-base-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 line-clamp-2">
              Presentation 3
            </p>
          </a>
        </div>
      </nav>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check overview link
    const overviewLink = parsedHtml.querySelector('a[href="/presentations"]');
    expect(overviewLink).toBeTruthy();
    expect(overviewLink?.textContent).toContain('Back to Presentation Overview');

    // Check previous link
    const prevLink = parsedHtml.querySelector('a[href="/presentations/presentation-1"]');
    expect(prevLink).toBeTruthy();
    expect(prevLink?.textContent).toContain('Previous');
    expect(prevLink?.textContent).toContain('Presentation 1');

    // Check next link
    const nextLink = parsedHtml.querySelector('a[href="/presentations/presentation-3"]');
    expect(nextLink).toBeTruthy();
    expect(nextLink?.textContent).toContain('Next');
    expect(nextLink?.textContent).toContain('Presentation 3');
  });

  it('renders navigation for first presentation', () => {
    const html = `
      <nav class="border-t border-base-200 dark:border-base-800 mt-12 pt-8">
        <div class="flex justify-between items-center">
          <a href="/presentations" class="text-base-600 dark:text-base-400 hover:text-primary-500 dark:hover:text-primary-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <path d="M15 6l-6 6l6 6" />
            </svg>
            Back to Presentation Overview
          </a>
        </div>

        <div class="flex justify-between items-center mt-8 gap-4">
          <a href="/presentations/presentation-2" class="flex-1 p-4 rounded-lg border border-base-200 dark:border-base-800 hover:border-primary-500 dark:hover:border-primary-400 group text-right">
            <span class="text-sm text-base-500 dark:text-base-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 flex items-center gap-1 justify-end">
              Next
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                <path d="M9 6l6 6l-6 6" />
              </svg>
            </span>
            <p class="font-medium mt-1 text-base-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 line-clamp-2">
              Presentation 2
            </p>
          </a>
        </div>
      </nav>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Should not have previous link
    const prevLink = parsedHtml.querySelector('a:has(.previous)');
    expect(prevLink).toBeFalsy();

    // Should have next link
    const nextLink = parsedHtml.querySelector('a[href="/presentations/presentation-2"]');
    expect(nextLink).toBeTruthy();
    expect(nextLink?.textContent).toContain('Next');
    expect(nextLink?.textContent).toContain('Presentation 2');
  });

  it('renders navigation for last presentation', () => {
    const html = `
      <nav class="border-t border-base-200 dark:border-base-800 mt-12 pt-8">
        <div class="flex justify-between items-center">
          <a href="/presentations" class="text-base-600 dark:text-base-400 hover:text-primary-500 dark:hover:text-primary-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <path d="M15 6l-6 6l6 6" />
            </svg>
            Back to Presentation Overview
          </a>
        </div>

        <div class="flex justify-between items-center mt-8 gap-4">
          <a href="/presentations/presentation-2" class="flex-1 p-4 rounded-lg border border-base-200 dark:border-base-800 hover:border-primary-500 dark:hover:border-primary-400 group">
            <span class="text-sm text-base-500 dark:text-base-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                <path d="M15 6l-6 6l6 6" />
              </svg>
              Previous
            </span>
            <p class="font-medium mt-1 text-base-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 line-clamp-2">
              Presentation 2
            </p>
          </a>
        </div>
      </nav>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Should have previous link
    const prevLink = parsedHtml.querySelector('a[href="/presentations/presentation-2"]');
    expect(prevLink).toBeTruthy();
    expect(prevLink?.textContent).toContain('Previous');
    expect(prevLink?.textContent).toContain('Presentation 2');

    // Should not have next link
    const nextLink = parsedHtml.querySelector('a:has(.next)');
    expect(nextLink).toBeFalsy();
  });

  it('has proper accessibility attributes', () => {
    const html = `
      <nav class="border-t border-base-200 dark:border-base-800 mt-12 pt-8">
        <div class="flex justify-between items-center">
          <a href="/presentations" class="text-base-600 dark:text-base-400 hover:text-primary-500 dark:hover:text-primary-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6l6 6" />
            </svg>
            Back to Presentation Overview
          </a>
        </div>
      </nav>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check if nav element exists
    const nav = parsedHtml.querySelector('nav');
    expect(nav).toBeTruthy();

    // Check if SVG icons are properly hidden from screen readers
    const svgIcons = parsedHtml.querySelectorAll('svg');
    svgIcons.forEach(icon => {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });

    // Check if links have descriptive text
    const links = parsedHtml.querySelectorAll('a');
    links.forEach(link => {
      expect(link.textContent?.trim()).not.toBe('');
    });
  });
});
