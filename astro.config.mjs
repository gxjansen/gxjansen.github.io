import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import compress from "@playform/compress";
import AutoImport from "astro-auto-import";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import netlify from "@astrojs/netlify";

import playformCompress from "@playform/compress";

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
  }), mdx(), react(), keystatic(), tailwind(), sitemap(), compress({
    HTML: {
      "html-minifier-terser": {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        ignoreCustomComments: [],
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }
  }), playformCompress()]
});