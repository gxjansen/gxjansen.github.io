/**
 * Paths through gui.do: the single "next step" CTA at the bottom of every
 * slashpage and post (NextStep.astro), so visitors move on towards getting to
 * know Guido and following his work instead of looping between two pages.
 *
 * - `targets`: one pitch per destination, reused by every page that links to
 *   it. A page can override the copy for one target (`overrides`).
 * - `pages`: per route a stage and an ordered list of candidate targets. The
 *   first candidate the visitor hasn't seen this session is shown (decided
 *   client-side from sessionStorage); without JS the first one shows.
 * - Posts use `next` from their frontmatter, else their cluster's chain.
 *
 * Rules, enforced by src/data/__tests__/paths.test.ts: every target and page
 * exists, the first candidate never points back at the page itself nor at an
 * earlier stage (posts are stage-neutral), and the last candidate is an Act
 * step. Design notes: Workspaces/brand/2026-11-10-gui-do-paths-design.md.
 */
import { countryCount, talksCount } from "./siteStats";

export type Stage = "discover" | "know" | "trust" | "act";

export interface NextTarget {
  href: string;
  heading: string;
  body: string;
  button: string;
}

export type CopyOverride = Partial<Omit<NextTarget, "href">>;

export interface PagePath {
  stage: Stage;
  next: TargetKey[];
  overrides?: Partial<Record<TargetKey, CopyOverride>>;
}

export const targets = {
  about: {
    href: "/about/",
    heading: "Who's behind this site",
    body: "Hi, I'm Guido. Cognitive psychologist turned community builder, with 20+ years across DevRel and online communities.",
    button: "More about me",
  },
  appearances: {
    href: "/appearances/",
    heading: "Hear me elsewhere",
    body: "Podcasts, videos and articles where I was the guest.",
    button: "See appearances",
  },
  canon: {
    href: "/canon/",
    heading: "The stuff that shaped me",
    body: "Books, comics, thinkers, TV and games I return to. The canon behind how I think.",
    button: "Browse the canon",
  },
  colophon: {
    href: "/colophon/",
    heading: "Curious how this site is built?",
    body: "I documented the tools and open source projects that keep gui.do running.",
    button: "See the colophon",
  },
  contact: {
    href: "/contact/",
    heading: "Say hello",
    body: "Book a call, DM me, or invite me to speak.",
    button: "Get in touch",
  },
  crocafe: {
    href: "/podcasts/",
    heading: "Digging into CRO?",
    body: "I hosted 250+ podcast episodes on experimentation and conversion optimization.",
    button: "Browse CRO.CAFE episodes",
  },
  domains: {
    href: "/domains/",
    heading: "I own too many domains",
    body: "Not all of them have a job... The full list, plus what I actually use them for, lives here.",
    button: "See the domains",
  },
  events: {
    href: "/events/",
    heading: "Where I'll be, where I've been",
    body: "Every event I'm speaking at or organizing. {talksCount} talks across {countryCount} countries so far.",
    button: "See all events",
  },
  follow: {
    href: "/follow/",
    heading: "Where to follow me",
    body: "I'm most active on Bluesky, but RSS and the newsletter work too. Pick whatever fits.",
    button: "Follow along",
  },
  green: {
    href: "/green/",
    heading: "How I waste less",
    body: "What I do to use less energy, water and stuff.",
    button: "See /green",
  },
  newsletter: {
    href: "/newsletter/",
    heading: "An occasional e-mail",
    body: "I send occasional e-mails about Big Tech alternatives and personal news. Self-hosted, zero tracking, unsubscribe anytime.",
    button: "Get the newsletter",
  },
  now: {
    href: "/now/",
    heading: "What I'm up to now",
    body: "What I read, build and post these days, pulled live from the open social web.",
    button: "See what I'm doing",
  },
  "post-ai-slop": {
    href: "/post/ai-slop-reputation/",
    heading: "AI slop is drowning communities",
    body: "Moderation can't keep up with the flood. I wrote about a structural fix: contribution history that travels with you across platforms.",
    button: "Read the post",
  },
  "post-antifragile-communities": {
    href: "/post/start-building-anti-fragile-communities/",
    heading: "Build communities that survive change",
    body: "I've spent 20 years building communities around open source platforms. They feel invincible until they collapse, so I wrote about making them stronger from change instead.",
    button: "Read the post",
  },
  "post-antifragile-stack": {
    href: "/post/practical-guide-to-building-antifragile-tech-stack/",
    heading: "How I choose my tools",
    body: "Seven principles for picking tech that won't lock you in. The framework behind everything on my /uses page.",
    button: "Read the guide",
  },
  "post-atmosphere-conf": {
    href: "/post/atmosphere-conf-2026/",
    heading: "370 people in Vancouver, 1000+ online",
    body: "I went to ATmosphere Conf 2026 and wrote up the highlights: an internet where users own their data.",
    button: "Read my notes",
  },
  "post-barazo": {
    href: "/post/introducing-barazo-community-forums/",
    heading: "Barazo: forums where members own their data",
    body: "I'm building an open source forum on AT Protocol. Members log in with Bluesky, posts live on their own data server, and reputation travels between communities.",
    button: "Read about Barazo",
  },
  "post-bigtech-update": {
    href: "/post/bigtech-independence-update-cleaning-house-for-local-ai/",
    heading: "BigTech independence: three months later",
    body: "I wrote about leaving BigTech a while back. This is what actually changed since, and the local AI setup I'm building now.",
    button: "Read the update",
  },
  "post-identity": {
    href: "/post/atproto-series-02-your-identity-isnt-your-username/",
    heading: "Your username isn't your identity",
    body: "I wrote about why your handle is just a label, and your identity is a key you own. Rename freely, prove it with your own domain.",
    button: "Read the post",
  },
  "post-own-network": {
    href: "/post/atproto-series-01-you-dont-own-your-network/",
    heading: "Who actually owns your network?",
    body: "Every platform move costs your community members and history. I wrote about why that's architecture, not bad luck.",
    button: "Read the post",
  },
  "post-reduced-bigtech": {
    href: "/post/how-i-reduced-my-bigtech-dependencies-in-2025/",
    heading: "Reduce your Big Tech dependencies",
    body: "I wrote a detailed guide on how I cut Big Tech subscriptions and vendor lock-in in 2025, with open source and privacy-friendly alternatives.",
    button: "Read the guide",
  },
  projects: {
    href: "/projects/",
    heading: "What I'm building",
    body: "I build indie and community projects: Sifa ID, Barazo, n8n Pulse. Mostly open source.",
    button: "See my projects",
  },
  retainer: {
    href: "/retainer/",
    heading: "Need a community lead, but not full-time?",
    body: "I help companies build their community and ecosystem, either as an advisor or hands-on. No community lead required on your end.",
    button: "See retainer options",
  },
  slashes: {
    href: "/slashes/",
    heading: "More small pages live here",
    body: "I keep a bunch of small personal pages on this site: now, uses, colophon, that sort of thing.",
    button: "See all slashpages",
  },
  speaker: {
    href: "/speaker/",
    heading: "Need a speaker for your event?",
    body: "I talk about community, the open social web, and antifragile tech. Everything you need to book me is here!",
    button: "View speaker info",
  },
  uses: {
    href: "/uses/",
    heading: "What I use and why",
    body: "The gear, apps and services I run, why I picked them, what I dropped. And much of it self-hosted.",
    button: "See my /uses page",
  },
  verify: {
    href: "/verify/",
    heading: "Is this really me?",
    body: "Domain + AT Protocol proof that accounts claiming to be me actually are.",
    button: "See the proof",
  },
} satisfies Record<string, NextTarget>;

export type TargetKey = keyof typeof targets;

/** Act steps: where a path ends. Newsletter is the main goal, follow second. */
export const ACT_TARGETS: readonly TargetKey[] = [
  "newsletter",
  "follow",
  "contact",
];

/** Stage of a target, derived from the page it points to. Posts and the
 *  CRO.CAFE archive are stage-neutral (undefined). */
export function targetStage(key: TargetKey): Stage | undefined {
  return pages[targets[key].href]?.stage;
}

/**
 * Keyed by pathname with trailing slash. A trailing `*` matches every route
 * below it (`/events/*` covers `/events/<id>/`). Pages that are not listed
 * (home, /follow, /contact, /retainer) get no NextStep: the homepage keeps its
 * own CTAs, and the others are the action themselves (/retainer ends in its
 * scoping-call and application cards).
 */
export const pages: Record<string, PagePath> = {
  // Discover: side doors.
  "/where/": {
    stage: "discover",
    next: ["events", "speaker", "newsletter"],
    overrides: {
      events: {
        heading: "Most flags are from talks",
        body: "I've given {talksCount} talks across {countryCount} countries. Conferences and meetups, mostly.",
        button: "See all events",
      },
    },
  },
  "/uses/": {
    stage: "discover",
    next: ["post-antifragile-stack", "domains", "newsletter"],
  },
  "/green/": {
    stage: "discover",
    next: ["post-antifragile-stack", "uses", "newsletter"],
  },
  "/colophon/": { stage: "discover", next: ["uses", "green", "newsletter"] },
  "/domains/": {
    stage: "discover",
    next: ["verify", "post-identity", "follow"],
  },
  "/verify/": {
    stage: "discover",
    next: ["post-identity", "projects", "follow"],
  },
  "/bookshelf/": { stage: "discover", next: ["canon", "now", "newsletter"] },
  "/canon/": { stage: "discover", next: ["about", "now", "newsletter"] },
  "/ama/": { stage: "discover", next: ["now", "about", "newsletter"] },
  "/blank/": { stage: "discover", next: ["slashes", "about", "newsletter"] },
  "/slashes/": { stage: "discover", next: ["now", "about", "newsletter"] },
  "/podcasts/": {
    stage: "discover",
    next: ["appearances", "events", "newsletter"],
  },
  "/presentations/": {
    stage: "discover",
    next: ["events", "speaker", "newsletter"],
  },
  "/presentations/*": {
    stage: "discover",
    next: ["events", "speaker", "newsletter"],
  },
  "/post/": { stage: "discover", next: ["newsletter", "follow"] },
  "/privacy/": { stage: "discover", next: ["colophon", "newsletter"] },

  // Know: who Guido is and what he does now.
  "/about/": { stage: "know", next: ["now", "projects", "newsletter"] },
  "/now/": { stage: "know", next: ["projects", "events", "follow"] },
  "/projects/": {
    stage: "know",
    next: ["post-barazo", "post-own-network", "follow"],
  },
  "/communities/": {
    stage: "know",
    next: ["post-antifragile-communities", "retainer", "newsletter"],
  },
  "/events/": {
    stage: "know",
    next: ["speaker", "post-atmosphere-conf", "newsletter"],
  },
  "/events/*": { stage: "know", next: ["events", "speaker", "newsletter"] },
  "/series/atproto/": {
    stage: "know",
    next: ["newsletter", "follow"],
    overrides: {
      newsletter: {
        heading: "Get each episode in your inbox",
        body: "I'll send each part the morning it goes live, no checking back. After the series it settles into a periodic newsletter. If this resonates, you'll probably like the rest.",
      },
    },
  },

  // Trust: proof and professional pages.
  "/appearances/": {
    stage: "trust",
    next: ["speaker", "events", "newsletter"],
  },
  "/awards/": { stage: "trust", next: ["speaker", "events", "newsletter"] },
  "/cv/": { stage: "trust", next: ["retainer", "contact", "newsletter"] },
  "/speaker/": { stage: "trust", next: ["contact", "newsletter"] },
  "/services/*": {
    stage: "trust",
    next: ["speaker", "contact", "newsletter"],
  },

  // Act.
  "/newsletter/": { stage: "act", next: ["follow"] },
};

/** Post clusters: the chain a post falls back to without its own `next`. */
export const clusters = {
  atproto: ["post-own-network", "post-identity", "projects", "follow"],
  antifragileTech: [
    "post-antifragile-stack",
    "post-reduced-bigtech",
    "post-bigtech-update",
    "newsletter",
  ],
  community: [
    "post-antifragile-communities",
    "post-ai-slop",
    "post-barazo",
    "retainer",
    "newsletter",
  ],
  ai: ["post-bigtech-update", "post-antifragile-stack", "newsletter"],
  legacyCro: ["now", "crocafe", "about", "newsletter"],
  legacy: ["now", "about", "newsletter"],
} satisfies Record<string, TargetKey[]>;

export type Cluster = keyof typeof clusters;

const clusterBySlug: Record<string, Cluster> = {
  "atproto-series-01-you-dont-own-your-network": "atproto",
  "atproto-series-02-your-identity-isnt-your-username": "atproto",
  "atmosphere-conf-2026": "atproto",
  "standard-site-card-on-bluesky": "atproto",
  "doom-over-at-protocol": "atproto",
  "practical-guide-to-building-antifragile-tech-stack": "antifragileTech",
  "how-i-reduced-my-bigtech-dependencies-in-2025": "antifragileTech",
  "bigtech-independence-update-cleaning-house-for-local-ai": "antifragileTech",
  "self-hosted-github-runner-vps": "antifragileTech",
  "start-building-anti-fragile-communities": "community",
  "ai-slop-reputation": "community",
  "ditching-one-community-idea-per-month": "community",
  "introducing-barazo-community-forums": "community",
  "how-to-build-an-online-b2b-community": "community",
  "7-hard-learned-lessons-for-building-reliable-ai-workflows": "ai",
  "mid-to-long-term-concerns-with-ai-programming": "ai",
  "4-options-to-customize-your-llm": "ai",
  "beyond-code-software-developers-in-the-age-of-ai": "ai",
  "better-not-waste-it": "ai",
};

const CRO_CATEGORIES = new Set([
  "experimentation",
  "statistics",
  "psychology",
  "persuasion",
]);

/** Cluster for a post: explicit for current topics, else by era/category. */
export function postCluster(slug: string, categories: string[] = []): Cluster {
  const explicit = clusterBySlug[slug];
  if (explicit) return explicit;
  const cats = categories.map((c) => c.toLowerCase());
  if (cats.some((c) => c === "at protocol")) return "atproto";
  if (cats.some((c) => CRO_CATEGORIES.has(c))) return "legacyCro";
  return "legacy";
}

export function postSlugFromPath(pathname: string): string | undefined {
  return pathname.match(/^\/post\/([^/]+)\/?$/)?.[1];
}

/** Normalize to a pathname with a trailing slash, without query or hash. */
export function normalizePath(path: string): string {
  const p = path.split(/[?#]/)[0] || "/";
  return p.endsWith("/") ? p : `${p}/`;
}

/** The PagePath for a route, exact match first, then a `/prefix/*` rule. */
export function pathFor(pathname: string): PagePath | undefined {
  const p = normalizePath(pathname);
  if (pages[p]) return pages[p];
  const parent = p.replace(/[^/]+\/$/, "");
  return pages[`${parent}*`];
}

export interface ResolvedStep extends NextTarget {
  key: TargetKey;
}

function fill(text: string): string {
  return text
    .replaceAll("{talksCount}", String(talksCount))
    .replaceAll("{countryCount}", String(countryCount));
}

function resolve(
  keys: readonly TargetKey[],
  overrides: PagePath["overrides"] = {},
  self?: string,
): ResolvedStep[] {
  return keys
    .filter((key) => normalizePath(targets[key].href) !== self)
    .map((key) => {
      const t = { ...targets[key], ...overrides[key] };
      return {
        key,
        href: t.href,
        heading: fill(t.heading),
        body: fill(t.body),
        button: fill(t.button),
      };
    });
}

/** Ordered next steps for a slashpage or listing route (empty: no NextStep). */
export function stepsForPage(pathname: string): ResolvedStep[] {
  const path = pathFor(pathname);
  return path
    ? resolve(path.next, path.overrides, normalizePath(pathname))
    : [];
}

/** Ordered next steps for a post: frontmatter `next`, else its cluster. */
export function stepsForPost(
  slug: string,
  categories: string[] = [],
  next?: string[],
): ResolvedStep[] {
  const keys = next?.length
    ? next.map((k) => {
        if (!(k in targets))
          throw new Error(`Unknown next target "${k}" in post ${slug}`);
        return k as TargetKey;
      })
    : clusters[postCluster(slug, categories)];
  return resolve(keys, {}, `/post/${slug}/`);
}
