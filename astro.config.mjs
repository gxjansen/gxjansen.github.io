import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import AutoImport from "astro-auto-import";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import netlify from "@astrojs/netlify";
import compressor from "astro-compressor";
import critters from "astro-critters";
import * as fs from 'node:fs';
import * as path from 'node:path';

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
    compressor(),
    critters({
      // Inline all styles from both internal and external stylesheets
      inlineThreshold: 0,
      // Preload external stylesheets
      preload: 'media',
      // Minimize the inlined CSS
      minimizeInlinedCSS: true,
      // Don't remove original stylesheets as they're needed for view transitions
      pruneSource: false
    })
  ],

  vite: {
    build: {
      cssCodeSplit: true,
      cssMinify: 'lightningcss',
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
