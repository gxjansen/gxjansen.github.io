/**
 * Training course content (2026). Two courses Guido runs as in-company
 * workshops or public cohorts. Drives the /training overview and the
 * /training/[course] detail pages.
 */
import type { Accent } from "@data/homeContent";

export interface ForWho {
  icon: string; // tabler icon (full path)
  t: string;
  d: string;
}
export interface AgendaBlock {
  time: string;
  t: string;
  d: string;
}
export interface Course {
  slug: string;
  t: string;
  sub: string;
  level: string;
  fmt: string;
  accent: Accent;
  points: string[];
  forWho: ForWho[];
  outcomes: string[];
  whyMe: string;
  agenda: AgendaBlock[];
}

export const courses: Course[] = [
  {
    slug: "agentic-engineering",
    t: "Agentic Engineering",
    sub: "Build reliable AI workflows that actually ship",
    level: "Intermediate",
    fmt: "Workshop · in-company or cohort",
    accent: "iris",
    points: [
      "Design multi-step AI pipelines that don't hallucinate in production",
      "Prompting, tool use, evaluation loops and human-in-the-loop patterns",
      "Hands-on: participants ship a working workflow by end of day",
    ],
    forWho: [
      {
        icon: "tabler/outline/code",
        t: "Dev teams & engineering orgs",
        d: 'Teams who want to move from "AI demos" to reliable, production-ready automation.',
      },
      {
        icon: "tabler/outline/bolt",
        t: "Tech leads & architects",
        d: "Strategic framing: where agentic engineering fits in your stack and where it will break.",
      },
      {
        icon: "tabler/outline/brain",
        t: "AI-adjacent engineers",
        d: "Engineers already experimenting with LLMs who want to harden their approach.",
      },
    ],
    outcomes: [
      "A working agentic pipeline — built during the session, tested against real inputs.",
      "Prompting patterns that reduce hallucination in multi-step workflows.",
      "Evaluation loop design: how to know when your AI workflow is working.",
      "Human-in-the-loop checkpoints: where automation earns trust and where it doesn't.",
      "A shared mental model for where AI adds leverage and where it doesn't.",
      "Practical tool-use patterns: APIs, code execution, search, browser.",
    ],
    whyMe:
      "I've built and deployed AI workflows in production — including the pipelines that power parts of Sifa. I've also run 500+ business experiments, so I approach AI the same way: measure the outcome, not the output. This workshop comes from real-world practice, not demo projects or slide decks.",
    agenda: [
      {
        time: "Morning",
        t: "Architecture & anti-patterns",
        d: "What makes agentic workflows fail. Mental models for multi-step pipelines. Prompting for reliability.",
      },
      {
        time: "Afternoon",
        t: "Build day",
        d: "Each participant designs and ships a working pipeline against their own use case. Group review + retro.",
      },
    ],
  },
  {
    slug: "atproto",
    t: "Intro to Building on AT Protocol",
    sub: "Open social tech for developers",
    level: "Beginner / intermediate",
    fmt: "Workshop · half or full day",
    accent: "foam",
    points: [
      "What the AT Protocol actually is — and why it matters for your product",
      "Set up a PDS, create records, wire a simple Bluesky client",
      "How communities on open networks are different (and why that's an advantage)",
    ],
    forWho: [
      {
        icon: "tabler/outline/code",
        t: "Developers & indie builders",
        d: "Anyone who wants to build on open social infrastructure instead of locked-in APIs.",
      },
      {
        icon: "tabler/outline/users-group",
        t: "Community & DevRel teams",
        d: "People thinking about portable identity, cross-platform reputation and community data ownership.",
      },
      {
        icon: "tabler/outline/world",
        t: "Product & engineering leads",
        d: "Teams evaluating the AT Protocol as an infrastructure choice for their next product.",
      },
    ],
    outcomes: [
      "A working Bluesky client or PDS record built during the session.",
      "A clear mental model of AT Protocol's data model, lexicons and DID system.",
      "Understanding of how community features like follows, feeds and notifications work under the hood.",
      'A practical sense of what "user-owned data" actually means in code.',
      "Context on the ecosystem: which apps are building on it and why.",
    ],
    whyMe:
      "I've been building on the AT Protocol since early 2023. Sifa (portable professional identity on atproto) and Barazo (open community forums) are both production projects on the network. I spoke at ATmosphere Conf 2026 in Vancouver. I know where the sharp edges are.",
    agenda: [
      {
        time: "Morning",
        t: "Protocol architecture",
        d: "DIDs, PDS, AppView, lexicons. What makes AT Protocol different from ActivityPub and why that matters.",
      },
      {
        time: "Afternoon",
        t: "Build session",
        d: "Wire a simple Bluesky client or publish custom records. Work with your own PDS. Ship something.",
      },
    ],
  },
];

export const courseBySlug = (slug: string) =>
  courses.find((c) => c.slug === slug);
