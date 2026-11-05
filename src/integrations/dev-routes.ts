/**
 * Dev-only routes under /internal: the AMA card gallery and the card/OG
 * renderers it uses to tune card art.
 *
 * They live outside src/pages and are injected only for non-production builds
 * (local dev, local builds, Netlify deploy previews and branch deploys). On a
 * Netlify production build (`CONTEXT=production`) the routes don't exist, so
 * gui.do returns a plain 404 and they stay out of the sitemap. Production must
 * not serve card.png: it renders any `?q=` text as an on-brand AMA card.
 */
import type { AstroIntegration } from "astro";

export const DEV_ROUTES = [
  {
    pattern: "/internal/ama/gallery",
    entrypoint: "./src/dev-routes/ama/gallery.astro",
  },
  {
    pattern: "/internal/ama/card.png",
    entrypoint: "./src/dev-routes/ama/card.png.ts",
  },
  {
    pattern: "/internal/ama/og.png",
    entrypoint: "./src/dev-routes/ama/og.png.ts",
  },
];

export function devRoutes(
  context: string | undefined = process.env.CONTEXT,
): AstroIntegration {
  return {
    name: "dev-routes",
    hooks: {
      "astro:config:setup": ({ injectRoute, logger }) => {
        if (context === "production") {
          logger.info("production build: /internal routes not included");
          return;
        }
        for (const route of DEV_ROUTES) injectRoute(route);
      },
    },
  };
}
