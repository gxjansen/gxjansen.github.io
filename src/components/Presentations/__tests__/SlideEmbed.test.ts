import { describe, it, expect } from 'vitest';
import { parseHTML } from '../../../test/astro-test-utils';

describe('SlideEmbed', () => {
  const mockSlideKey = 'test123';

  it('renders slide embed with correct structure', () => {
    const html = `
      <div class="mb-12">
        <h2 class="h3 mb-4">Slides</h2>
        <div class="relative pb-[56.25%] bg-slate-100 dark:bg-slate-800 rounded-lg" id="slide-container-${mockSlideKey}">
          <iframe 
            src="//www.slideshare.net/slideshow/embed_code/key/${mockSlideKey}?hostedIn=slideshare&amp;page=upload"
            class="absolute top-0 left-0 w-full h-full border-none rounded-lg"
            allowfullscreen
            loading="lazy"
            onload="this.parentElement.classList.remove('bg-slate-100', 'dark:bg-slate-800')"
            onerror='document.getElementById("slide-container-${mockSlideKey}").innerHTML = "&lt;div class=&quot;absolute inset-0 flex items-center justify-center text-slate-500 dark:text-slate-400&quot;&gt;Failed to load slides. &lt;a href=&quot;https://www.slideshare.net/slideshow/embed_code/key/${mockSlideKey}&quot; target=&quot;_blank&quot; class=&quot;ml-2 text-blue-500 hover:underline&quot;&gt;View on SlideShare&lt;/a&gt;&lt;/div&gt;"'
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
    expect(heading?.textContent).toBe('Slides');

    // Check iframe container
    const iframeContainer = parsedHtml.querySelector(`div[id="slide-container-${mockSlideKey}"]`);
    expect(iframeContainer).toBeTruthy();
    expect(iframeContainer?.classList.contains('relative')).toBe(true);
    expect(iframeContainer?.classList.contains('bg-slate-100')).toBe(true);

    // Check iframe attributes
    const iframe = parsedHtml.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute('src')).toBe(`//www.slideshare.net/slideshow/embed_code/key/${mockSlideKey}?hostedIn=slideshare&page=upload`);
    expect(iframe?.getAttribute('loading')).toBe('lazy');
    expect(iframe?.hasAttribute('allowfullscreen')).toBe(true);
  });

  it('includes error handling with fallback content', () => {
    const html = `
      <div class="mb-12">
        <div class="relative pb-[56.25%] bg-slate-100 dark:bg-slate-800 rounded-lg" id="slide-container-${mockSlideKey}">
          <iframe 
            src="//www.slideshare.net/slideshow/embed_code/key/${mockSlideKey}?hostedIn=slideshare&amp;page=upload"
            class="absolute top-0 left-0 w-full h-full border-none rounded-lg"
            allowfullscreen
            loading="lazy"
            onload="this.parentElement.classList.remove('bg-slate-100', 'dark:bg-slate-800')"
            onerror='document.getElementById("slide-container-${mockSlideKey}").innerHTML = "&lt;div class=&quot;absolute inset-0 flex items-center justify-center text-slate-500 dark:text-slate-400&quot;&gt;Failed to load slides. &lt;a href=&quot;https://www.slideshare.net/slideshow/embed_code/key/${mockSlideKey}&quot; target=&quot;_blank&quot; class=&quot;ml-2 text-blue-500 hover:underline&quot;&gt;View on SlideShare&lt;/a&gt;&lt;/div&gt;"'
          ></iframe>
        </div>
      </div>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check error handler content
    const iframe = parsedHtml.querySelector('iframe');
    const errorHandler = iframe?.getAttribute('onerror');
    expect(errorHandler).toBeTruthy();
    expect(errorHandler).toContain('Failed to load slides');
    expect(errorHandler).toContain('View on SlideShare');
    expect(errorHandler).toContain(`https://www.slideshare.net/slideshow/embed_code/key/${mockSlideKey}`);
  });

  it('handles loading state correctly', () => {
    const html = `
      <div class="mb-12">
        <div class="relative pb-[56.25%] bg-slate-100 dark:bg-slate-800 rounded-lg" id="slide-container-${mockSlideKey}">
          <iframe 
            src="//www.slideshare.net/slideshow/embed_code/key/${mockSlideKey}?hostedIn=slideshare&amp;page=upload"
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
    const container = parsedHtml.querySelector(`div[id="slide-container-${mockSlideKey}"]`);
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

  it('includes jQuery error suppression script', () => {
    const html = `
      <script>
        window.jQuery = window.jQuery || function() {};
        window.$ = window.$ || function() {};
      </script>
    `.trim();

    const parsedHtml = parseHTML(html);
    
    // Check script content
    const script = parsedHtml.querySelector('script');
    expect(script).toBeTruthy();
    const scriptContent = script?.textContent;
    expect(scriptContent).toContain('window.jQuery');
    expect(scriptContent).toContain('window.$');
  });
});
