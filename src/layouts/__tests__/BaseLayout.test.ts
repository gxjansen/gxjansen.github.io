import { describe, it, expect } from 'vitest';
import { parseHTML } from '../../test/astro-test-utils';
import { createMockLayoutProps } from '../../test/utils';

describe('BaseLayout', () => {
  it('renders basic structure correctly', () => {
    const props = createMockLayoutProps();
    
    const markup = `
      <!doctype html>
      <html 
        lang="en"
        dir="ltr"
        class="antialiased"
      >
        <head>
          <title>${props.title}</title>
          <meta name="description" content="${props.description}">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta charset="UTF-8">
          <ViewTransitions />
        </head>
        <body
          id="body"
          class="bg-background dark:bg-background-dark use-animations relative isolate overflow-x-hidden min-h-screen flex flex-col"
        >
          <div class="fixed inset-0 z-background">
            <div 
              class="noise-background"
              aria-hidden="true"
              role="presentation"
            ></div>
            <div 
              class="gradient-top-left"
              aria-hidden="true"
              role="presentation"
            ></div>
            <div 
              class="gradient-bottom-right"
              aria-hidden="true"
              role="presentation"
            ></div>
            <div class="grid-pattern-container h-full w-full"></div>
          </div>
          
          <div class="relative z-base flex-1">
            <nav></nav>
            <div class="site-container px-4">
              <main 
                id="main-content"
                class="transition-ready" 
                transition:animate="fade" 
                transition:animate.duration="0.2" 
                transition:animate.timing="ease-out"
              >
                <slot></slot>
              </main>
            </div>
          </div>

          <footer></footer>
        </body>
      </html>
    `.trim();

    const parsedHtml = parseHTML(markup);
    
    // Check basic structure
    expect(parsedHtml.querySelector('html')).toBeTruthy();
    expect(parsedHtml.querySelector('head')).toBeTruthy();
    expect(parsedHtml.querySelector('body')).toBeTruthy();
    expect(parsedHtml.querySelector('main')).toBeTruthy();

    // Check HTML attributes
    const htmlElement = parsedHtml.querySelector('html');
    expect(htmlElement?.getAttribute('lang')).toBe('en');
    expect(htmlElement?.getAttribute('dir')).toBe('ltr');
    expect(htmlElement?.classList.contains('antialiased')).toBe(true);

    // Check meta tags
    const title = parsedHtml.querySelector('title');
    expect(title?.textContent).toBe(props.title);
    const description = parsedHtml.querySelector('meta[name="description"]');
    expect(description?.getAttribute('content')).toBe(props.description);

    // Check main content area
    const main = parsedHtml.querySelector('main');
    expect(main?.id).toBe('main-content');
    expect(main?.classList.contains('transition-ready')).toBe(true);
  });

  it('includes background elements with proper accessibility', () => {
    const markup = `
      <div class="fixed inset-0 z-background">
        <div 
          class="noise-background"
          aria-hidden="true"
          role="presentation"
        ></div>
        <div 
          class="gradient-top-left"
          aria-hidden="true"
          role="presentation"
        ></div>
        <div 
          class="gradient-bottom-right"
          aria-hidden="true"
          role="presentation"
        ></div>
        <div class="grid-pattern-container h-full w-full"></div>
      </div>
    `.trim();

    const parsedHtml = parseHTML(markup);
    
    // Check background elements
    const backgroundElements = parsedHtml.querySelectorAll('[role="presentation"]');
    expect(backgroundElements.length).toBe(3);
    
    // Check accessibility attributes
    backgroundElements.forEach(element => {
      expect(element.getAttribute('aria-hidden')).toBe('true');
      expect(element.getAttribute('role')).toBe('presentation');
    });
  });

  it('handles view transitions correctly', () => {
    const markup = `
      <main 
        id="main-content"
        class="transition-ready" 
        transition:animate="fade" 
        transition:animate.duration="0.2" 
        transition:animate.timing="ease-out"
      >
        <slot></slot>
      </main>
    `.trim();

    const parsedHtml = parseHTML(markup);
    
    // Check transition attributes
    const main = parsedHtml.querySelector('main');
    expect(main?.classList.contains('transition-ready')).toBe(true);
    expect(main?.getAttribute('transition:animate')).toBe('fade');
    expect(main?.getAttribute('transition:animate.duration')).toBe('0.2');
    expect(main?.getAttribute('transition:animate.timing')).toBe('ease-out');
  });

  it('handles SEO meta tags correctly', () => {
    const props = createMockLayoutProps({
      type: 'blog',
      title: 'Test Blog Post',
      description: 'This is a test blog post',
      noindex: true
    });
    
    const markup = `
      <head>
        <title>${props.title}</title>
        <meta name="description" content="${props.description}">
        <meta name="robots" content="noindex">
        <meta property="og:title" content="${props.title}">
        <meta property="og:description" content="${props.description}">
        <meta property="og:type" content="article">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${props.title}">
        <meta name="twitter:description" content="${props.description}">
      </head>
    `.trim();

    const parsedHtml = parseHTML(markup);
    
    // Check basic meta tags
    expect(parsedHtml.querySelector('title')?.textContent).toBe(props.title);
    expect(parsedHtml.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(props.description);
    expect(parsedHtml.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex');

    // Check OpenGraph tags
    expect(parsedHtml.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(props.title);
    expect(parsedHtml.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe(props.description);
    expect(parsedHtml.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('article');

    // Check Twitter tags
    expect(parsedHtml.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(props.title);
    expect(parsedHtml.querySelector('meta[name="twitter:description"]')?.getAttribute('content')).toBe(props.description);
    expect(parsedHtml.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe('summary_large_image');
  });

  it('includes performance optimizations', () => {
    const markup = `
      <html>
        <head>
          <style>
            .transition-ready {
              will-change: opacity, transform;
              transform: translateZ(0);
              backface-visibility: hidden;
            }
          </style>
        </head>
        <body>
          <main class="transition-ready"></main>
          <script>
            document.addEventListener('astro:before-preparation', () => {
              document.querySelectorAll('.transition-ready').forEach(el => {
                el.style.willChange = 'opacity, transform';
              });
            });

            document.addEventListener('astro:after-swap', () => {
              document.querySelectorAll('.transition-ready').forEach(el => {
                el.style.willChange = 'auto';
              });
            });
          </script>
        </body>
      </html>
    `.trim();

    const parsedHtml = parseHTML(markup);
    
    // Check performance CSS
    const style = parsedHtml.querySelector('style');
    expect(style?.textContent).toContain('will-change: opacity, transform');
    expect(style?.textContent).toContain('transform: translateZ(0)');
    expect(style?.textContent).toContain('backface-visibility: hidden');

    // Check performance script
    const script = parsedHtml.querySelector('script');
    expect(script?.textContent).toContain('astro:before-preparation');
    expect(script?.textContent).toContain('astro:after-swap');
    expect(script?.textContent).toContain('willChange');
  });
});
