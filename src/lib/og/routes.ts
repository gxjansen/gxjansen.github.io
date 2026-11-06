/* =====================================================================
   Route → OG card mapping.
   ---------------------------------------------------------------------
   Single source of truth shared by the /og endpoint (which PNG to
   generate) and Seo.astro (which og:image URL to emit). Keep the two in
   lockstep: every card the endpoint can render must be reachable here
   from a route, and vice-versa.

   URL shapes:
     /og/home.png
     /og/retainer.png
     /og/training.png
     /og/default.png
     /og/landing/<page>.png      (about, cv, events, …)
     /og/article/<slug>.png
     /og/talk/<slug>.png
   ===================================================================== */

/**
 * Landing pages that get the foam "landing" card. The H1/lead here are
 * card-sized headlines (short, editorial) — deliberately NOT the pages'
 * SEO meta titles, which are too long for a 1200×630 headline. `whoExtra`
 * appends a stat line to the byline where it reads naturally.
 */
export type LandingCardContent = {
  url: string;
  title: string;
  lead?: string;
  hand?: string;
  /** if true, append "{countries}, {talks}" to the byline at build time */
  showSpeakingStats?: boolean;
};

export const LANDING_PAGES: Record<string, LandingCardContent> = {
  about: {
    url: "gui.do/about",
    title: "Community, experimentation & open social tech",
    lead: "What I do, how I got here, and what I'm building now.",
    hand: "nice to meet you",
  },
  cv: {
    url: "gui.do/cv",
    title: "Two decades of building community functions",
    lead: "A track record in community, DevRel, experimentation and open tech.",
    hand: "the long version",
  },
  events: {
    url: "gui.do/events",
    title: "Where I'll be speaking next",
    lead: "Conferences, meetups and workshops on community, experimentation, AI & AT Protocol.",
    hand: "come say hi",
    showSpeakingStats: true,
  },
  speaker: {
    url: "gui.do/speaker",
    title: "Book me to speak at your event",
    lead: "Keynotes and workshops on community, experimentation and open social tech.",
    hand: "book me to speak",
    showSpeakingStats: true,
  },
  communities: {
    url: "gui.do/communities",
    title: "Communities I've built from zero",
    lead: "Joomla!, Meet Magento, CRO.CAFE, Spryker. Developer and technical communities.",
    hand: "communities I run",
  },
  projects: {
    url: "gui.do/projects",
    title: "Things I'm building",
    lead: "Sifa, Barazo, n8n Pulse and more. Most open source on GitHub.",
    hand: "mostly open source",
  },
  appearances: {
    url: "gui.do/appearances",
    title: "Where I've shown up",
    lead: "Podcasts, panels, blogs and videos I was invited into, plus a few articles and awards.",
    hand: "said things",
  },
  newsletter: {
    url: "gui.do/newsletter",
    title: "The newsletter I don't post on social",
    lead: "Big Tech alternatives, AI meets DevRel, automation tips and personal updates.",
    hand: "no spam, promise",
  },
  podcasts: {
    url: "gui.do/podcasts",
    title: "The podcasts I host & produce",
    lead: "Sheeptank, CRO.CAFE and more. 250+ episodes on community and experimentation.",
    hand: "give it a listen",
  },
  presentations: {
    url: "gui.do/presentations",
    title: "Talks & workshops",
    lead: "Keynotes and hands-on sessions on community, experimentation, AI & AT Protocol.",
    hand: "on stage",
    showSpeakingStats: true,
  },
  post: {
    url: "gui.do/post",
    title: "Writing on community, experimentation & open tech",
    lead: "Field notes, essays and how-tos from building community functions.",
    hand: "field notes",
  },
  now: {
    url: "gui.do/now",
    title: "What I'm doing right now",
    lead: "Posts, reading and building, pulled live from the open social web.",
    hand: "right now",
  },
  uses: {
    url: "gui.do/uses",
    title: "The tools I actually use",
    lead: "Hardware, software and services, why I picked them, and what I dropped.",
    hand: "my setup",
  },
  follow: {
    url: "gui.do/follow",
    title: "Follow Guido",
    lead: "Newsletter, RSS and the places I post. Pick what works.",
    hand: "keep up",
  },
  where: {
    url: "gui.do/where",
    title: "Where Guido is right now",
    lead: "Country reported by my own server, plus the flags of everywhere I've been.",
    hand: "right here",
  },
  colophon: {
    url: "gui.do/colophon",
    title: "Colophon",
    lead: "How gui.do is built, and the open source work it stands on.",
    hand: "the plumbing",
  },
  blank: {
    url: "gui.do/blank",
    title: "A page intentionally left blank.",
  },
  slashes: {
    url: "gui.do/slashes",
    title: "Every slash page on this site",
    lead: "An index of /now, /uses and friends, plus the short aliases that get you there.",
    hand: "slash index",
  },
  contact: {
    url: "gui.do/contact",
    title: "Get in touch",
    lead: "Book a call, send a DM, or invite me to speak at your event.",
    hand: "say hello",
  },
};

/**
 * Map a request pathname to its og:image URL. The pathname alone is
 * enough to pick the card — /post/* and /presentations/* are
 * unambiguous — so page `type` isn't needed here.
 */
export function ogImageForPath(pathname: string): string {
  const p = pathname.replace(/\/$/, "") || "/";

  // Blog posts → article card.
  if (p.startsWith("/post/")) {
    const slug = p.slice("/post/".length);
    return `/og/article/${slug}.png`;
  }
  // Presentations → talk card.
  if (p.startsWith("/presentations/") && p !== "/presentations") {
    const slug = p.slice("/presentations/".length);
    return `/og/talk/${slug}.png`;
  }

  // Explicit single-page cards.
  if (p === "/") return "/og/home.png";
  if (p === "/retainer") return "/og/retainer.png";
  // /training is temporarily hidden (its OG card is disabled in
  // /og/[...path].png.ts). Restore this line when the page returns:
  // if (p === "/training") return "/og/training.png";
  if (p === "/bookshelf") return "/og/bookshelf.png";

  // Landing pages (presentations index lives at /presentations).
  if (p === "/presentations") return "/og/landing/presentations.png";
  const landingSlug = p.replace(/^\//, "");
  if (LANDING_PAGES[landingSlug]) {
    return `/og/landing/${landingSlug}.png`;
  }

  // Everything else → fallback.
  return "/og/default.png";
}
