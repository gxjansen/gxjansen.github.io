import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import AutoImport from "astro-auto-import";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import netlify from "@astrojs/netlify";
import * as fs from 'node:fs';
import * as path from 'node:path';
import { contentValidationPlugin } from './src/utils/content-validation-plugin.ts';

// https://astro.build/config
export default defineConfig({
  site: "https://gui.do",
  output: "static",
  viewTransitions: {
    fallback: true // Enable fallback animations for browsers that don't support view transitions
  },
  adapter: netlify({
    imageCDN: false
  }),
  image: {
    responsiveStyles: true,
    breakpoints: [360, 640, 768, 1024, 1280, 1600, 1920],
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        svg: {
          enabled: true
        }
      }
    }
  },
  // i18n configuration must match src/config/translations.json.ts
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  // Redirects configuration using Astro's native redirects
  redirects: {
    // External redirects
    '/kit': { destination: 'https://kit.co/gxjansen', status: 301 },
    '/call': { destination: 'https://app.reclaim.ai/m/gxjansen/flexible-quick-meeting', status: 301 },
    '/youtube': { destination: 'https://www.youtube.com/c/GuidoJansen', status: 301 },
    '/video': { destination: 'https://www.youtube.com/c/GuidoJansen', status: 301 },
    
    // Internal redirects
    '/admin': { destination: '/keystatic', status: 301 },
    '/guidojansen': { destination: '/about', status: 301 },
    '/post/*': { destination: '/post/:splat', status: 301 },
    '/persuasive-ecommerce': { destination: '/', status: 301 },
    '/instagram': { destination: '/social', status: 301 },
    '/howtoweb': { destination: '/presentations/data-driven-decisions-meets-psychology', status: 301 },
    '/cards': { destination: '/cognitive-biases', status: 301 },
    '/bigger': { destination: '/presentations/still-a-b-testing-your-buttons-you-need-to-think-much-bigger', status: 301 },
    '/audio': { destination: '/podcasts', status: 301 },
    '/index.php': { destination: '/', status: 301 },
    '/images/*': { destination: '/', status: 301 },
    '/CV': { destination: '/cv', status: 301 },
    '/hireme': { destination: '/about', status: 301 },
    '/theme/contact-us/contact-us': { destination: '/about', status: 301 },
    '/theme/contact': { destination: '/about', status: 301 },
    '/presentation/*': { destination: '/presentations/:splat', status: 301 }
  },
  markdown: {
    shikiConfig: {
      theme: "dracula",
      wrap: true
    }
  },
  integrations: [
    AutoImport({
      imports: [
        "@components/Admonition/Admonition.astro"
      ]
    }),
    mdx({
      // Configure MDX to be more lenient
      extendMarkdownConfig: true,
      optimize: false,
      experimentalLayout: false
    }),
    react(),
    keystatic(),
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/conference-terms'),
      changefreq: 'weekly',
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en'
        }
      }
    }),
    contentValidationPlugin()
  ],

  vite: {
    build: {
      cssCodeSplit: true,
      cssMinify: 'lightningcss',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
    },
    ssr: {
      external: ['sharp']
    },
    css: {
      devSourcemap: true,
    },
    plugins: [
      {
        name: 'robots-txt',
        writeBundle: {
          sequential: true,
          order: 'post',
          handler() {
            let robotsContent;
            const sitemapUrl = process.env.ASTRO_MODE === 'production'
              ? 'https://gui.do/sitemap.xml'
              : 'https://dev.gui.do/sitemap.xml';

            if (process.env.ASTRO_MODE === 'production') {
                robotsContent = `User-agent: *\nDisallow: /conference-terms\n\nSitemap: ${sitemapUrl}`;
            } else {
              robotsContent = `User-agent: *\nDisallow: /\n\nSitemap: ${sitemapUrl}`;
            }
            
            // Ensure the dist directory exists
            const distDir = path.join(process.cwd(), 'dist');
            if (!fs.existsSync(distDir)) {
              fs.mkdirSync(distDir, { recursive: true });
            }

            // Write the robots.txt file
            fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsContent);
          }
        }
      }
    ]
  }
});
