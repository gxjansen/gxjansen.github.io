/**
 * Curated homepage content (2026 redesign).
 *
 * Ported from the redesign prototype's data model. Articles are pulled live
 * from the `post` content collection in index.astro; the brand strip reuses
 * the CompanyLogos component. Everything here is editorial copy that has no
 * collection of its own (yet): stats, pillars, engagements, training summaries,
 * projects, talks, and the seeded activity fallback.
 *
 * `accent` values map to Rosé Pine tokens (--color-<accent>) and drive each
 * card's `--ac` hook.
 */

export type Accent = "gold" | "foam" | "pine" | "iris" | "love" | "rose";

export interface Stat {
  n: string;
  l: string;
}

export interface Pillar {
  k: string;
  d: string;
  /** full tabler icon path, including the `tabler/` prefix (e.g. `tabler/outline/brain`) */
  icon: string;
}

export interface Engagement {
  t: string;
  d: string;
  icon: string;
  accent: Accent;
  cta: string;
  url: string;
}

export interface TrainingCard {
  t: string;
  sub: string;
  level: string;
  fmt: string;
  url: string;
  accent: Accent;
  points: string[];
}

export interface Project {
  t: string;
  d: string;
  tag: string;
  url: string;
  accent: Accent;
}

export interface Talk {
  t: string;
  venue: string;
  year: string;
  fmt: string;
  loc: string;
  url: string;
}

export interface ActivityItem {
  type: "post" | "repost" | "review" | "code" | "event";
  app: string;
  time: string;
  kind: string;
  text?: string;
  title?: string;
  sub?: string;
  rating?: number;
  hasImage?: boolean;
  who?: string;
  likes?: number;
  replies?: number;
  reposts?: number;
  /** Thumbnail URL for posts that embed an image. */
  imageUrl?: string;
  imageAlt?: string;
  /** Source URL (live items link to the original post/review/etc.). */
  url?: string;
}

export interface Testimonial {
  q: string;
  who: string;
  role: string;
  context?: string;
}

export const heroCopy = {
  kicker: "Hi, I'm Guido 👋",
  // The emphasised phrase is wrapped on render.
  headline: "I build community functions for tech products.",
  emphasis: "community functions",
  lead: `For ${yearsBuilding}+ years I've helped tech teams turn <strong>developer &amp; customer intelligence</strong> into product strategy, grounded in cognitive psychology and a habit of testing my assumptions. I help build communities, and the teams that run them.`,
};

// Build-time stats — single source of truth lives in ./siteStats.
import { yearsBuilding, countryCount, talksCount } from "./siteStats";
export { yearsBuilding, countryCount };
// Back-compat alias for existing call sites on this page.
export const speakingCount = talksCount;

export const stats: Stat[] = [
  { n: `${yearsBuilding}+`, l: "years building communities" },
  { n: "500+", l: "experiments run" },
  { n: `${speakingCount}`, l: "events spoken at" },
  { n: `${countryCount}`, l: "countries presented in" },
];

export const pillars: Pillar[] = [
  {
    k: "Cognitive psychology",
    d: "Why developers and customers actually behave the way they do.",
    icon: "tabler/outline/brain",
  },
  {
    k: "Business experimentation",
    d: "500+ A/B tests at Randstad & JDE. Measure what matters, prove what works.",
    icon: "tabler/filled/flask",
  },
  {
    k: "Community building",
    d: "Helped grow the Joomla!, Magento, CRO.CAFE and Spryker communities.",
    icon: "tabler/outline/users-group",
  },
  {
    k: "(AI) automation",
    d: "Reliable AI workflows and local-first tooling that earns its keep.",
    icon: "tabler/outline/robot",
  },
  {
    k: "Open tech",
    d: "User freedom over lock-in. Building on open standards like AT Protocol.",
    icon: "tabler/outline/lock-open",
  },
];

export const engagements: Engagement[] = [
  {
    t: "Retainer",
    d: "Ongoing community strategy, DevRel leadership or fractional community-function work. Typically 1–2 days/week over 3–6 months.",
    icon: "tabler/outline/users-group",
    accent: "pine",
    cta: "Talk about a retainer",
    url: "/retainer/",
  },
  {
    t: "Training",
    d: "Bespoke in-company workshops on Agentic Engineering or Building on AT Protocol. Public cohorts run a few times a year.",
    icon: "tabler/outline/bolt",
    accent: "iris",
    cta: "Book a training",
    url: "/training/",
  },
  {
    t: "Event speaker",
    d: `Keynotes and workshops at your conference, company event or developer meetup. ${countryCount} countries, ${speakingCount} talks so far.`,
    icon: "tabler/filled/microphone",
    accent: "rose",
    cta: "Invite me to speak",
    url: "/speaker/",
  },
];

export const trainingCards: TrainingCard[] = [
  {
    t: "Agentic Engineering",
    sub: "Build reliable AI workflows that actually ship",
    level: "Intermediate",
    fmt: "Workshop · in-company or cohort",
    url: "/training/agentic-engineering/",
    accent: "iris",
    points: [
      "Design multi-step AI pipelines that don't hallucinate in production",
      "Prompting, tool use, evaluation loops and human-in-the-loop patterns",
      "Hands-on: participants ship a working workflow by end of day",
    ],
  },
  {
    t: "Intro to Building on AT Protocol",
    sub: "Open social tech for developers",
    level: "Beginner / intermediate",
    fmt: "Workshop · half or full day",
    url: "/training/atproto/",
    accent: "foam",
    points: [
      "What AT Protocol actually is, and why it matters for your product",
      "Set up a PDS, create records, wire a simple Bluesky client",
      "How communities on open networks are different (and why that's an advantage)",
    ],
  },
];

export const projects: Project[] = [
  {
    t: "Sifa",
    d: "Portable professional identity on AT Protocol. A track record built from real community contributions.",
    tag: "Building",
    url: "https://sifa.id",
    accent: "pine",
  },
  {
    t: "Barazo",
    d: "Open-source community forums where members own their data. Log in with Bluesky; reputation follows you.",
    tag: "Building",
    url: "/post/introducing-barazo-community-forums/",
    accent: "rose",
  },
  {
    t: "CRO.CAFE",
    d: "200+ conversations on growth, experimentation & optimization. One of the longest-running CRO podcasts.",
    tag: "Hosting",
    url: "https://www.cro.cafe",
    accent: "gold",
  },
];

export const talks: Talk[] = [
  {
    t: "From optimisation to ecosystem thinking",
    venue: "ATmosphere Conf",
    year: "2026",
    fmt: "Talk",
    loc: "Vancouver, CA",
    url: "/presentations/",
  },
  {
    t: "Communities that matter to the business",
    venue: "Meet Magento NL",
    year: "2025",
    fmt: "Keynote",
    loc: "Amsterdam, NL",
    url: "/presentations/",
  },
  {
    t: "The psychology of contribution",
    venue: "DevRelCon",
    year: "2025",
    fmt: "Keynote",
    loc: "London, UK",
    url: "/presentations/",
  },
  {
    t: "Anti-fragile communities",
    venue: "Spryker Excite",
    year: "2024",
    fmt: "Workshop",
    loc: "Berlin, DE",
    url: "/presentations/",
  },
  {
    t: "7 hard-learned lessons for reliable AI workflows",
    venue: "ProductTank",
    year: "2025",
    fmt: "Talk",
    loc: "Amsterdam, NL",
    url: "/presentations/",
  },
  {
    t: "Proving the monetary value of A/B testing",
    venue: "Conversion Hotel",
    year: "2024",
    fmt: "Keynote",
    loc: "Texel, NL",
    url: "/presentations/",
  },
];

export const aboutQuote: Testimonial = {
  q: "Guido has a rare ability to translate community insights into tangible business intelligence, and to bring the business closer to the community.",
  who: "Svitlana Kulynych",
  role: "Head of Learning Experience, Spryker",
  context: "worked with me at Spryker",
};

/**
 * Seeded activity fallback — real recent items from sifa.id/p/gui.do/activity.
 * Used when the live Sifa fetch is unavailable so the feed never blank-renders.
 */
export const activitySeed: ActivityItem[] = [
  {
    type: "post",
    app: "bluesky",
    time: "2h",
    text: "@zzstoatzz.io 👋",
    kind: "Reply",
    likes: 6,
    replies: 1,
    reposts: 0,
  },
  {
    type: "review",
    app: "popfeed",
    time: "3h",
    title: "Invincible",
    sub: "TV · Prime Video",
    rating: 8,
    kind: "Reviewed a show",
  },
  {
    type: "review",
    app: "popfeed",
    time: "3h",
    title: "Deadpool & Wolverine",
    sub: "Film · Shawn Levy",
    rating: 10,
    kind: "Reviewed a film",
  },
  {
    type: "post",
    app: "bluesky",
    time: "3h",
    text: "Little smurf 💙",
    kind: "Post",
    hasImage: true,
    likes: 31,
    replies: 4,
    reposts: 2,
  },
  {
    type: "review",
    app: "popfeed",
    time: "5h",
    title: "Thor: Ragnarok",
    sub: "Film · Taika Waititi",
    rating: 10,
    kind: "Reviewed a film",
  },
  {
    type: "post",
    app: "bluesky",
    time: "10h",
    text: "So how do I get into @teal.fm? Or are you all just rawdogging your music listens straight into your own PDS?",
    kind: "Post",
    likes: 18,
    replies: 7,
    reposts: 1,
  },
  {
    type: "post",
    app: "bluesky",
    time: "22h",
    text: "Companies and governments scanning every piece of content and requiring ID scans — you are absolutely mental. There are better ways to protect kids.",
    kind: "Quote post",
    likes: 204,
    replies: 23,
    reposts: 41,
  },
  {
    type: "code",
    app: "tangled",
    time: "1d",
    title: "sifa-sdk",
    sub: "Merged PR #42 · activity stream client",
    kind: "Pushed code",
  },
  {
    type: "repost",
    app: "bluesky",
    time: "2d",
    text: "CODETV × atproto: a new episode on building on open networks.",
    kind: "Reposted",
    who: "zeu.dev",
  },
  {
    type: "event",
    app: "events",
    time: "1w",
    title: "ATmosphere Conf 2026",
    sub: "Spoke · Vancouver, CA",
    kind: "Attended & spoke",
  },
];

/** App-source registry → display label + accent token (matches --color-app-*). */
export const APP_REGISTRY: Record<string, { label: string; color: string }> = {
  bluesky: { label: "Bluesky", color: "var(--color-app-bluesky)" },
  popfeed: { label: "Popfeed", color: "var(--color-app-popfeed)" },
  tangled: { label: "Tangled", color: "var(--color-app-tangled)" },
  github: { label: "GitHub", color: "var(--color-app-github)" },
  standard: { label: "Standard", color: "var(--color-app-standard)" },
  whitewind: { label: "WhiteWind", color: "var(--color-app-whitewind)" },
  leaflet: { label: "Leaflet", color: "var(--color-app-leaflet)" },
  crate: { label: "Crate", color: "var(--color-app-crate)" },
  frontpage: { label: "Frontpage", color: "var(--color-app-frontpage)" },
  smokesignal: { label: "Smoke Signal", color: "var(--color-app-smokesignal)" },
  atmorsvp: { label: "ATmosphere", color: "var(--color-app-atmorsvp)" },
  events: { label: "Events", color: "var(--color-app-atmorsvp)" },
  flashes: { label: "Flashes", color: "var(--color-app-flashes)" },
  grain: { label: "Grain", color: "var(--color-app-grain)" },
  bookhive: { label: "Bookhive", color: "var(--color-app-bookhive)" },
  spark: { label: "Spark", color: "var(--color-app-spark)" },
  plyr: { label: "Plyr", color: "var(--color-app-plyr)" },
};

/**
 * App-source → icon name (astro-icon). Monochrome marks that tint with the app
 * accent (currentColor). bluesky/github are Tabler brand icons; popfeed/tangled
 * are extracted from sifa-web (src/icons/apps). smokesignal/bookhive mirror the
 * generic icons Sifa uses (CalendarBlank / BookOpen) via Tabler equivalents.
 * Unknown apps fall back to the coloured dot.
 */
export const APP_ICON: Record<string, string> = {
  bluesky: "tabler/brand-bluesky",
  github: "tabler/filled/brand-github",
  popfeed: "apps/popfeed",
  tangled: "apps/tangled",
  smokesignal: "tabler/outline/calendar",
  bookhive: "tabler/outline/book",
};
