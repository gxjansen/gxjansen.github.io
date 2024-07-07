import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import AutoImport from "astro-auto-import";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import netlify from "@astrojs/netlify";

import compressor from "astro-compressor";
import * as fs from 'node:fs';
import * as path from 'node:path';


// https://astro.build/config
export default defineConfig({
  site: "https://gxjansen.github.io",
  output: "hybrid",
  adapter: netlify({
    imageCDN: false
  }),
  redirects: {
    "/admin": "/keystatic",
    "/press": "/",
    "/presentation": "/",
    "/events": "/",
    "/guidojansen": "/about",
    "/post/[...slug]": "/blog/[...slug]",
    "/kit": "https://kit.co/gxjansen",
    "/call": "https://app.reclaim.ai/m/gxjansen/flexible-quick-meeting",
    "/persuasive-ecommerce": "/",
    "/instagram": "/social",
    "/howtoweb": "/presentation/data-driven-decisions-meets-psychology",
    "/cards": "/cognitive-biases",
    "/bigger": "/presentation/still-a-b-testing-your-buttons-you-need-to-think-much-bigger",
    "/audio": "/podcasts",
    "/youtube": "https://www.youtube.com/c/GuidoJansen",
    "/video": "https://www.youtube.com/c/GuidoJansen",
    "/ddtt8": "/presentation/creating-an-optimization-culture",
    "/index.php": "/",
    "/images/(.*)": "/",
    "/CV": "/cv",
    "/hireme": "/about",
    "/theme/contact-us/contact-us": "/about",
    "/theme/contact": "/about",
    "presentations": "/presentation"
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
      // Shiki Themes: https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "dracula",
      wrap: true
    }
  },
  // trailingSlash: "always",
  integrations: [
  // example auto import component into mdx files
  AutoImport({
    imports: [
    // https://github.com/delucis/astro-auto-import
    "@components/Admonition/Admonition.astro"]
  }), mdx(), react(), keystatic(), tailwind(), sitemap(), compressor()],

// the following uses a Vite plugin to copy the appropriate robots.txt file to the dist folder during the build process, based on the current environment.
  build: {
    assets: 'astro-assets'
  },

  vite: {
    plugins: [
      {
        name: 'robots-txt',
        writeBundle: {
          sequential: true,
          order: 'post',
          handler() {
            let robotsContent;
            const sitemapUrl = process.env.ASTRO_MODE === 'production'
              ? 'https://www.gui.do/sitemap-index.xml'
              : 'https://dev.gui.do/sitemap-index.xml';

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