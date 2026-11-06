/**
 * Data for /colophon: what gui.do is built with, grouped. Names and links
 * only; the page adds the count of the remaining packages from package.json.
 */

export interface ColophonItem {
  name: string;
  url?: string;
}

export interface ColophonGroup {
  name: string;
  items: ColophonItem[];
}

export const REPO_URL = "https://github.com/gxjansen/gxjansen.github.io";

export const colophon: ColophonGroup[] = [
  {
    name: "Built with",
    items: [
      { name: "Astro", url: "https://astro.build" },
      { name: "Tailwind CSS", url: "https://tailwindcss.com" },
      { name: "MDX", url: "https://mdxjs.com" },
      { name: "React", url: "https://react.dev" },
    ],
  },
  {
    name: "Design",
    items: [
      {
        name: "Atkinson Hyperlegible Next",
        url: "https://www.brailleinstitute.org/freefont/",
      },
      {
        name: "Schibsted Grotesk",
        url: "https://fonts.google.com/specimen/Schibsted+Grotesk",
      },
      {
        name: "LiebeHeide",
        url: "https://liebefonts.com/fonts/liebeheide-vector",
      },
      { name: "Rosé Pine", url: "https://rosepinetheme.com" },
      { name: "Tabler Icons", url: "https://tabler.io/icons" },
      { name: "Simple Icons", url: "https://simpleicons.org" },
    ],
  },
  {
    name: "Data from the open social web",
    items: [
      { name: "AT Protocol", url: "https://atproto.com" },
      { name: "Sifa ID", url: "https://sifa.id" },
      { name: "Bluesky", url: "https://bsky.app" },
      { name: "Bookhive", url: "https://bookhive.buzz" },
      { name: "Grain", url: "https://grain.social" },
      { name: "Popfeed", url: "https://popfeed.social" },
      { name: "Standard.site", url: "https://standard.site" },
    ],
  },
  {
    name: "Self-hosted",
    items: [
      { name: "Umami", url: "https://umami.is" },
      { name: "Listmonk", url: "https://listmonk.app" },
      { name: "Juttu", url: "https://juttu.app" },
      { name: "ALTCHA", url: "https://altcha.org" },
    ],
  },
  {
    name: "Hosting and source",
    items: [
      { name: "Netlify", url: "https://www.netlify.com" },
      { name: "GitHub", url: REPO_URL },
    ],
  },
];
