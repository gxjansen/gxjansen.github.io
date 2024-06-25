import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import compress from "@playform/compress";
import AutoImport from "astro-auto-import";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://gxjansen.github.io",
  output: "hybrid",
  adapter: netlify({
    imageCDN: false,
  }),
  redirects: {
    "/admin": "/keystatic",
  },
  // i18n configuration must match src/config/translations.json.ts
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      // Shiki Themes: https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "dracula",
      wrap: true,
    },
  },
  // trailingSlash: "always",
  integrations: [
    // example auto import component into mdx files
    AutoImport({
      imports: [
        // https://github.com/delucis/astro-auto-import
        "@components/Admonition/Admonition.astro",
      ],
    }),
    mdx(),
    react(),
    keystatic(),
    tailwind(),
    sitemap(),
    compress({
      HTML: {
        "html-minifier-terser": {
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          ignoreCustomComments: [],
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      },
    }),
  ],
});
