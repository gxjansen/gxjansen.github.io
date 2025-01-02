import { describe, it, expect } from 'vitest';
import { parseHTML } from '../../test/astro-test-utils';
import { createMockLayoutProps } from '../../test/utils';

describe('BaseHead', () => {
  it('includes required meta tags', () => {
    const props = createMockLayoutProps();
    
    const markup = `
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="color-scheme" content="dark light" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0f172a" />
        
        <!-- Accessibility meta tags -->
        <meta name="format-detection" content="telephone=no" />
        <meta name="format-detection" content="date=no" />
        <meta name="format-detection" content="address=no" />
        <meta name="format-detection" content="email=no" />
      </head>
    `.trim();

    const parsedHtml = parseHTML(markup);
    
    // Check charset and viewport
    expect(parsedHtml.querySelector('meta[charset="utf-8"]')).toBeTruthy();
    expect(parsedHtml.querySelector('meta[name="viewport"]')?.getAttribute('content'))
      .toBe('width=device-width, initial-scale=1.0, viewport-fit=cover');

    // Check color scheme
    expect(parsedHtml.querySelector('meta[name="color-scheme"]')?.getAttribute('content'))
      .toBe('dark light');

    // Check theme colors
    const themeColors = parsedHtml.querySelectorAll('meta[name="theme-color"]');
    expect(themeColors.length).toBe(2);
    expect(themeColors[0].getAttribute('media')).toBe('(prefers-color-scheme: light)');
    expect(themeColors[0].getAttribute('content')).toBe('#ffffff');
    expect(themeColors[1].getAttribute('media')).toBe('(prefers-color-scheme: dark)');
    expect(themeColors[1].getAttribute('content')).toBe('#0f172a');

    // Check accessibility meta tags
    const formatDetection = parsedHtml.querySelectorAll('meta[name="format-detection"]');
    expect(formatDetection.length).toBe(4);
    expect(formatDetection[0].getAttribute('content')).toBe('telephone=no');
    expect(formatDetection[1].getAttribute('content')).toBe('date=no');
    expect(formatDetection[2].getAttribute('content')).toBe('address=no');
    expect(formatDetection[3].getAttribute('content')).toBe('email=no');
  });

  it('handles font loading optimization', () => {
    const markup = `
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossorigin />
        <link 
          href="https://api.fontshare.com/v2/css?f[]=poppins@400,500,600,700&display=swap"
          rel="stylesheet"
          media="print"
          onload="this.media='all'"
        />
        <noscript>
          <link
            href="https://api.fontshare.com/v2/css?f[]=poppins@400,500,600,700&display=swap"
            rel="stylesheet"
          />
        </noscript>
      </head>
    `.trim();

    const parsedHtml = parseHTML(markup);
    
    // Check preconnect
    const preconnect = parsedHtml.querySelector('link[rel="preconnect"]');
    expect(preconnect?.getAttribute('href')).toBe('https://api.fontshare.com');
    expect(preconnect?.hasAttribute('crossorigin')).toBe(true);

    // Check main font loading
    const fontLink = parsedHtml.querySelector('link[media="print"]');
    expect(fontLink?.getAttribute('href')).toContain('poppins@400,500,600,700');
    expect(fontLink?.getAttribute('onload')).toBe("this.media='all'");

    // Check noscript fallback
    const noscriptContent = parsedHtml.querySelector('noscript')?.innerHTML || '';
    expect(noscriptContent).toContain('poppins@400,500,600,700');
  });

  it('includes favicon setup', () => {
    const markup = `
      <head>
        <link rel="icon" href="/favicons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#22c55e" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
        <meta name="theme-color" content="#22c55e" />
      </head>
    `.trim();

    const parsedHtml = parseHTML(markup);
    
    // Check basic favicon
    expect(parsedHtml.querySelector('link[rel="icon"][href="/favicons/favicon.ico"]')).toBeTruthy();
    expect(parsedHtml.querySelector('link[rel="shortcut icon"]')).toBeTruthy();

    // Check apple touch icon
    const appleIcon = parsedHtml.querySelector('link[rel="apple-touch-icon"]');
    expect(appleIcon?.getAttribute('sizes')).toBe('180x180');
    expect(appleIcon?.getAttribute('href')).toBe('/favicons/apple-touch-icon.png');

    // Check PNG icons
    const pngIcons = parsedHtml.querySelectorAll('link[type="image/png"]');
    expect(pngIcons.length).toBe(2);
    expect(pngIcons[0].getAttribute('sizes')).toBe('32x32');
    expect(pngIcons[1].getAttribute('sizes')).toBe('16x16');

    // Check manifest and browser config
    expect(parsedHtml.querySelector('link[rel="manifest"]')).toBeTruthy();
    expect(parsedHtml.querySelector('meta[name="msapplication-config"]')).toBeTruthy();
  });

  it('includes theme change script', () => {
    const markup = `
      <head>
        <script>
          function initTheme() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            let colorTheme = localStorage.getItem("colorTheme");
            
            function applyTheme(theme) {
              if (theme === "dark") {
                document.documentElement.classList.add("dark");
                document.documentElement.style.colorScheme = "dark";
              } else {
                document.documentElement.classList.remove("dark");
                document.documentElement.style.colorScheme = "light";
              }
            }

            if (!colorTheme) {
              colorTheme = prefersDark.matches ? "dark" : "light";
              localStorage.setItem("colorTheme", colorTheme);
            }
            applyTheme(colorTheme);

            prefersDark.addEventListener("change", (e) => {
              if (!localStorage.getItem("colorTheme")) {
                const newTheme = e.matches ? "dark" : "light";
                applyTheme(newTheme);
                localStorage.setItem("colorTheme", newTheme);
              }
            });
          }

          initTheme();
          document.addEventListener("astro:after-swap", initTheme);
        </script>
      </head>
    `.trim();

    const parsedHtml = parseHTML(markup);
    
    const script = parsedHtml.querySelector('script');
    expect(script?.textContent).toContain('function initTheme()');
    expect(script?.textContent).toContain('prefers-color-scheme: dark');
    expect(script?.textContent).toContain('localStorage.getItem("colorTheme")');
    expect(script?.textContent).toContain('document.documentElement.classList');
    expect(script?.textContent).toContain('astro:after-swap');
  });

  it('handles SEO meta tags', () => {
    const props = createMockLayoutProps({
      type: 'blog',
      title: 'Test Blog Post',
      description: 'This is a test blog post',
      noindex: true
    });
    
    const markup = `
      <head>
        <title>${props.title}</title>
        <meta name="description" content="${props.description}" />
        <meta name="robots" content="noindex" />
        <meta property="og:title" content="${props.title}" />
        <meta property="og:description" content="${props.description}" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${props.title}" />
        <meta name="twitter:description" content="${props.description}" />
        <link rel="sitemap" href="/sitemap-index.xml" />
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

    // Check sitemap
    expect(parsedHtml.querySelector('link[rel="sitemap"]')?.getAttribute('href')).toBe('/sitemap-index.xml');
  });
});
