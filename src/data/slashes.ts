/**
 * Slash pages (https://slashpages.net): the canonical pages listed on
 * /slashes/, plus the alias slugs that redirect to them.
 *
 * This file is the single source of truth for both. astro.config.mjs turns the
 * aliases into Netlify redirects via slashRedirects(), and src/pages/slashes.astro
 * renders the canonical list. src/data/__tests__/slashes.test.ts checks that
 * every page has a route and every alias anchor exists in its page source.
 *
 * Aliases redirect with a 302 on purpose: an alias that points at a section
 * today (/languages -> /cv/#languages) can become its own page later by moving
 * it here, without browsers holding on to a cached 301.
 */

import { currentItems } from "./uses";

const selfHostedCount = currentItems.filter((i) =>
  i.traits?.includes("selfHosted"),
).length;

export interface SlashAlias {
  /** Path segment without slashes, e.g. "languages". */
  slug: string;
  /** Optional element id on the canonical page to deeplink to. */
  anchor?: string;
}

export interface SlashPage {
  /** Path segment without slashes, e.g. "cv". */
  slug: string;
  /** Listed in the top group on /slashes/ instead of "Also on gui.do". */
  featured?: boolean;
  /** One-line description shown on /slashes/. */
  description: string;
  /**
   * Listed like a page, but the slug redirects (302) to this path instead of
   * having its own route: a filtered or sectioned view of another page, e.g.
   * "/uses/?f=selfHosted#uses-filter". Aliases redirect here too.
   */
  redirectTo?: string;
  aliases?: SlashAlias[];
}

export const slashPages: SlashPage[] = [
  // Featured on /slashes: the slashpages.net ones plus a few of my own.
  {
    slug: "about",
    featured: true,
    description: "Who I am: community builder, cognitive psychologist, DevRel.",
  },
  {
    slug: "now",
    featured: true,
    description:
      "What I'm reading, building and posting lately, live from the open social web.",
  },
  {
    slug: "uses",
    featured: true,
    description:
      "My gear, apps and services, why I picked them, what I dropped.",
  },
  {
    slug: "cv",
    featured: true,
    description: "My résumé, auto-generated from my Sifa ID.",
    aliases: [{ slug: "languages", anchor: "languages" }],
  },
  {
    slug: "appearances",
    featured: true,
    description: "Media appearances and interviews.",
  },
  {
    slug: "bookshelf",
    featured: true,
    description:
      "What I'm reading, what's next, what's finished, via my Bookhive feed.",
  },
  {
    slug: "ama",
    featured: true,
    description: "Ask me anything anonymously; I answer on Bluesky.",
  },
  {
    slug: "contact",
    featured: true,
    description: "Book a call, DM me, or invite me to speak.",
    aliases: [{ slug: "hello" }],
  },
  {
    slug: "follow",
    featured: true,
    description: "Every way to keep up: newsletter, RSS, socials.",
    aliases: [
      { slug: "subscribe" },
      { slug: "feeds" },
      { slug: "elsewhere", anchor: "elsewhere" },
    ],
  },
  {
    slug: "verify",
    featured: true,
    description: "Proof that accounts elsewhere are really mine.",
  },
  {
    slug: "defaults",
    featured: true,
    description:
      "My default app per category: mail, notes, browser, code, music.",
    redirectTo: "/uses/#defaults",
  },
  {
    slug: "self-hosting",
    featured: true,
    description: `The ${selfHostedCount} things I run myself, filtered from /uses.`,
    redirectTo: "/uses/?f=selfHosted#uses-filter",
    aliases: [{ slug: "self-hosted" }, { slug: "hosted" }],
  },
  {
    // /photos is itself a 302 to Grain (public/_redirects) until it becomes a
    // real page; pointing at /photos/ means this follows along automatically.
    slug: "photo",
    featured: true,
    description: "My photos since 2005, about 7,200 of them, on Grain.",
    redirectTo: "/photos/",
    aliases: [{ slug: "pic" }],
  },
  {
    slug: "canon",
    featured: true,
    description: "Books, comics, thinkers and TV that shaped how I think.",
  },
  {
    slug: "green",
    featured: true,
    description: "What I do to waste less energy, water and stuff.",
  },
  {
    slug: "colophon",
    featured: true,
    description: "How I built this site, the tools and open source behind it.",
  },
  {
    slug: "blank",
    featured: true,
    description: "A page intentionally left blank.",
  },
  {
    slug: "slashes",
    featured: true,
    description: "You're looking at it.",
    aliases: [{ slug: "slash" }],
  },

  // Other top-level pages on gui.do.
  {
    slug: "projects",
    description:
      "Indie and community builds like Sifa, Barazo and n8n Pulse, mostly open source.",
  },
  {
    slug: "communities",
    description:
      "Communities I built from zero: Joomla!, Dutchento/Meet Magento, CRO.CAFE, Spryker.",
  },
  {
    slug: "post",
    description:
      "Articles on community, open tech, experiments and AI workflows.",
  },
  { slug: "presentations", description: "Talks and workshops I've given." },
  {
    slug: "events",
    description: "Where I'm speaking, organising or just showing up.",
  },
  {
    slug: "podcasts",
    description: "Sheeptank and CRO.CAFE: 250+ episodes as host and producer.",
  },
  {
    slug: "newsletter",
    description:
      "Occasional mail on Big Tech alternatives and personal news, zero tracking.",
  },
  {
    slug: "retainer",
    description:
      "Community and ecosystem help for companies without a community lead yet.",
  },
  {
    slug: "privacy",
    description: "How I handle data here: self-hosted, no tracking pixels.",
  },
];

/** Where a listed page lives: its own route, or its redirect target. */
export function pageHref(page: SlashPage): string {
  return page.redirectTo ?? `/${page.slug}/`;
}

/** Target URL for an alias: the canonical page, plus the anchor if set. */
export function aliasTarget(page: SlashPage, alias: SlashAlias): string {
  if (page.redirectTo) return page.redirectTo;
  return `/${page.slug}/${alias.anchor ? `#${alias.anchor}` : ""}`;
}

/** Astro `redirects` entries for every alias. */
export function slashRedirects(): Record<
  string,
  { destination: string; status: 302 }
> {
  const redirects: Record<string, { destination: string; status: 302 }> = {};
  for (const page of slashPages) {
    if (page.redirectTo) {
      redirects[`/${page.slug}`] = {
        destination: page.redirectTo,
        status: 302,
      };
    }
    for (const alias of page.aliases ?? []) {
      redirects[`/${alias.slug}`] = {
        destination: aliasTarget(page, alias),
        status: 302,
      };
    }
  }
  return redirects;
}
