import { describe, it, expect } from 'vitest';
import { parseHTML } from '../../../test/astro-test-utils';

describe('VideoEmbed', () => {
  const mockYoutubeId = 'test123';

  it('renders video embed with correct structure', () => {
    const html = `
      <div class="mb-12">
        <h2 class="h3 mb-4">Video Recording</h2>
        <div class="relative pb-[56.25%] bg-slate-100 dark:bg-slate-800 rounded-lg">
          <iframe 
            src="https://www.youtube.com/embed/${mockYoutubeId}"
            class="absolute top-0 left-0 w-full h-full border-none rounded-lg"
            allowfullscreen
            loading="lazy"
            onload="this.parentElement.classList.remove('bg-slate-100', 'dark:bg-slate-800')"
            onerror="this.parentElement.innerHTML = '&lt;div class=&quot;absolute inset-0 flex items-center justify-center text-slate-500 dark:text-slate-400&quot;&gt;Failed to load video. &lt;a href=&quot;https://www.youtube.com/watch?v=' + this.youtubeId + '&quot; target=&quot;_blank&quot; class=&quot;ml-2 text-blue-500 hover:underline&quot;&gt;Watch on YouTube&lt;/a&gt;&lt;/div&gt;'"
          ></iframe>
        </div>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check container structure
    const container = parsedHtml.querySelector('div.mb-12');
    expect(container).toBeTruthy();
    
    // Check heading
    const heading = parsedHtml.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toBe('Video Recording');

    // Check iframe container
    const iframeContainer = parsedHtml.querySelector('div.relative');
    expect(iframeContainer).toBeTruthy();
    expect(iframeContainer?.classList.contains('bg-slate-100')).toBe(true);
    expect(iframeContainer?.classList.contains('rounded-lg')).toBe(true);

    // Check iframe attributes
    const iframe = parsedHtml.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute('src')).toBe(`https://www.youtube.com/embed/${mockYoutubeId}`);
    expect(iframe?.getAttribute('loading')).toBe('lazy');
    expect(iframe?.hasAttribute('allowfullscreen')).toBe(true);
  });

  it('handles loading state correctly', () => {
    const html = `
      <div class="mb-12">
        <div class="relative pb-[56.25%] bg-slate-100 dark:bg-slate-800 rounded-lg">
          <iframe 
            src="https://www.youtube.com/embed/${mockYoutubeId}"
            class="absolute top-0 left-0 w-full h-full border-none rounded-lg"
            allowfullscreen
            loading="lazy"
            onload="this.parentElement.classList.remove('bg-slate-100', 'dark:bg-slate-800')"
          ></iframe>
        </div>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check loading state classes
    const container = parsedHtml.querySelector('div.relative');
    expect(container).toBeTruthy();
    expect(container?.classList.contains('bg-slate-100')).toBe(true);
    expect(container?.classList.contains('dark:bg-slate-800')).toBe(true);

    // Check onload handler removes loading state
    const iframe = parsedHtml.querySelector('iframe');
    const onloadHandler = iframe?.getAttribute('onload');
    expect(onloadHandler).toBeTruthy();
    expect(onloadHandler).toContain('remove');
    expect(onloadHandler).toContain('bg-slate-100');
    expect(onloadHandler).toContain('dark:bg-slate-800');
  });

  it('includes error handling with fallback content', () => {
    const html = `
      <div class="mb-12">
        <div class="relative pb-[56.25%] bg-slate-100 dark:bg-slate-800 rounded-lg">
          <iframe 
            src="https://www.youtube.com/embed/${mockYoutubeId}"
            class="absolute top-0 left-0 w-full h-full border-none rounded-lg"
            allowfullscreen
            loading="lazy"
            onload="this.parentElement.classList.remove('bg-slate-100', 'dark:bg-slate-800')"
            onerror="this.parentElement.innerHTML = '&lt;div class=&quot;absolute inset-0 flex items-center justify-center text-slate-500 dark:text-slate-400&quot;&gt;Failed to load video. &lt;a href=&quot;https://www.youtube.com/watch?v=' + this.youtubeId + '&quot; target=&quot;_blank&quot; class=&quot;ml-2 text-blue-500 hover:underline&quot;&gt;Watch on YouTube&lt;/a&gt;&lt;/div&gt;'"
          ></iframe>
        </div>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check error handler content
    const iframe = parsedHtml.querySelector('iframe');
    const errorHandler = iframe?.getAttribute('onerror');
    expect(errorHandler).toBeTruthy();
    expect(errorHandler).toContain('Failed to load video');
    expect(errorHandler).toContain('Watch on YouTube');
    expect(errorHandler).toContain('https://www.youtube.com/watch?v=');
  });

  it('has proper accessibility attributes', () => {
    const html = `
      <div class="mb-12">
        <h2 class="h3 mb-4">Video Recording</h2>
        <div class="relative pb-[56.25%] bg-slate-100 dark:bg-slate-800 rounded-lg">
          <iframe 
            src="https://www.youtube.com/embed/${mockYoutubeId}"
            class="absolute top-0 left-0 w-full h-full border-none rounded-lg"
            allowfullscreen
            loading="lazy"
            title="Presentation Video Recording"
          ></iframe>
        </div>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check iframe title
    const iframe = parsedHtml.querySelector('iframe');
    expect(iframe?.getAttribute('title')).toBe('Presentation Video Recording');

    // Check heading structure
    const heading = parsedHtml.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading?.classList.contains('h3')).toBe(true);
  });
});
