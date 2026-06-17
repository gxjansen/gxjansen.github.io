/**
 * Training course content (2026). Two courses Guido runs as in-company
 * workshops or public cohorts. Drives the /training overview and the
 * /training/[course] detail pages.
 *
 * The agentic-engineering course is co-led with Execuro (Denis Turkov) and
 * uses the extended optional fields below. The atproto course only uses the
 * base fields, so its detail page renders without the co-branded sections.
 */
import type { Accent } from "@data/homeContent";
import type { ImageMetadata } from "astro";
import denisPhoto from "@images/execuro/denis-turkov.png";
import guidoPhoto from "@images/hero/guido-speaking.jpg";

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

/** A pricing/format tier (Ignite, Accelerator, Bootcamp, Masterclass). */
export interface Format {
  name: string;
  duration: string;
  price: string;
  desc: string;
  deliverables?: string[];
  /** Optional flag so the page can mark the most-popular / free tier. */
  badge?: string;
}

/** A proof stat: n = number, l = label. */
export interface Proof {
  n: string;
  l: string;
}

/** A workshop instructor (Guido + Denis). */
export interface Instructor {
  name: string;
  role: string;
  bio: string;
  img?: ImageMetadata;
}

/** Co-led marker for the hero (partner name + link + one-line blurb). */
export interface CoLed {
  partner: string;
  partnerUrl: string;
  blurb: string;
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
  // --- optional, co-branded workshop fields (agentic-engineering only) ---
  tagline?: string;
  /** The core-message / "the shift" paragraph(s). */
  intro?: string[];
  coLed?: CoLed;
  notFor?: string[];
  formats?: Format[];
  proof?: Proof[];
  instructors?: Instructor[];
  guarantee?: string;
  prerequisites?: string[];
  security?: string;
}

export const courses: Course[] = [
  {
    slug: "agentic-engineering",
    t: "Agentic Engineering",
    sub: "Stop typing better prompts. Start delegating to AI agents that ship.",
    level: "For engineering teams of 5–12",
    fmt: "Workshop · in-company or cohort",
    accent: "iris",
    tagline: "From vibe-coding to structured agentic development",
    coLed: {
      partner: "Execuro",
      partnerUrl: "https://execuro.com/agentic-engineering-workshop/",
      blurb:
        "I run this one together with Denis Turkov from Execuro. We worked together at Spryker, and we built this around what moves a team, not what demos well.",
    },
    points: [
      "Delegate to AI agents with clear specs, context and rules instead of better prompts",
      "Build a complete app together: frontend, backend and API, hands-on",
      "Walk away with reusable agentic workflows and AI coding rulesets you keep",
      "Build the agent harness, the specs, context and rules, so it runs on any LLM, local models included",
    ],
    intro: [
      "This isn't a prompting workshop. It's a different way to build software.",
      "Most teams already have the tools. Claude Code, Cursor, Copilot, the licenses are paid for. What's missing is the workflow. So people type a prompt, hope for the best, and fall back to writing the code themselves when the output disappoints.",
      "We fix the workflow. You delegate work to AI agents the same way you'd hand it to a junior engineer: with a clear spec, the right context, and rules they have to follow. That's the shift from vibe-coding to structured agentic development, and it's what gets a team from the usual ~10% productivity bump to 60% of their time back on coding tasks.",
      "And none of it is tied to one model. The real work is the harness around the model: the specs, the context, the rules. You build that yourself, so it runs on whatever LLM your team trusts, local ones included, and keeps working when you switch.",
    ],
    forWho: [
      {
        icon: "tabler/outline/topology-star-3",
        t: "Engineering teams of 5–12",
        d: "Teams with production-level experience, a real codebase, CI/CD and shared workflows. This works because you bring the actual work, not a toy project.",
      },
      {
        icon: "tabler/outline/chart-arrows",
        t: "CTOs & VPs of Engineering",
        d: "You want measurable AI adoption, not licenses gathering dust. We hand you something the whole team uses on Monday.",
      },
      {
        icon: "tabler/outline/users",
        t: "Cross-functional teams",
        d: "Devs, PMs, QA, DevOps and UX in the room together. Agentic workflows touch all of them, so they learn it together.",
      },
    ],
    notFor: [
      "Solo developers and teams under 5 (it's built around team workflows and shared rulesets)",
      "Teams without a real, production-level codebase to work against",
      "Anyone after a prompting cheat-sheet rather than a change in how they build",
    ],
    outcomes: [
      "Hands-on experience running real agentic workflows. You build, you don't watch slides.",
      "AI coding rulesets at org, project and individual level, written during the session.",
      "Reusable, structured agentic workflows your team keeps and reuses after we leave.",
      "An agent harness that's model-agnostic. It runs on whatever LLM you trust, local models included, so you're not locked to one vendor.",
      "A complete app built together: frontend, backend and API.",
      "Bootcamp: the approach applied to your own backlog, plus CI/CD integration and an adoption guide.",
    ],
    formats: [
      {
        name: "Ignite",
        duration: "Half day",
        price: "Tailored",
        desc: "A live demo plus hands-on time. The mindset shift, and enough proof to win over the skeptics on your team.",
      },
      {
        name: "Accelerator",
        duration: "1 day · max 12 people",
        price: "Tailored",
        desc: "80% practice, 20% theory. We build a working app together and write your first rulesets.",
        badge: "Most popular",
        deliverables: [
          "A working app built end to end",
          "Your first org/project rulesets",
          "Reusable agentic workflows",
        ],
      },
      {
        name: "Bootcamp",
        duration: "2 days (2×6h)",
        price: "Tailored",
        desc: "Everything in Accelerator, plus a second day on your own backlog: real tickets, granular rulesets, CI/CD with agents, and an adoption guide.",
        deliverables: [
          "Real tickets from your backlog, done with agents",
          "Granular org / project / individual rulesets",
          "CI/CD integration with agents",
          "An adoption guide for the team",
          "Optional 3-month follow-up (bi-weekly)",
        ],
      },
      {
        name: "Free Masterclass",
        duration: "90 min",
        price: "Free",
        desc: "Foundations, a live demo and Q&A. A zero-risk taster before you commit to a paid format.",
        badge: "Zero risk",
      },
    ],
    proof: [
      { n: "12", l: "teams enabled" },
      { n: "50+", l: "engineers trained" },
      { n: "15+", l: "years leading engineering" },
      { n: "30+", l: "enterprise teams scaled" },
    ],
    agenda: [
      {
        time: "Module 1",
        t: "The mindset shift",
        d: "Why prompting harder doesn't scale, and what delegating to agents looks like instead. The move from vibe-coding to structured agentic development.",
      },
      {
        time: "Module 2",
        t: "Agentic workflows & spec-driven development",
        d: "Requirements, specs and constraints before implementation. How to hand work to an agent so it comes back right the first time.",
      },
      {
        time: "Module 3",
        t: "Context engineering",
        d: "Building persistent, cumulative knowledge the agents can draw on, so context compounds instead of resetting every session.",
      },
      {
        time: "Module 4",
        t: "Building apps with AI agents",
        d: "Hands-on: we build a complete app together, frontend, backend and API, using agentic workflows the whole way.",
      },
      {
        time: "Module 5",
        t: "AI coding rulesets",
        d: "Org, project and individual rulesets that keep agents inside the lines. You write your first set during the session.",
      },
      {
        time: "Module 6",
        t: "Daily-workflow integration",
        d: "Folding all of this into how your team works day to day, so it survives past the workshop.",
      },
      {
        time: "Bootcamp · Day 2",
        t: "Your backlog, your CI/CD",
        d: "Real tickets from Jira, Trello or Asana. Governance rulesets, CI/CD with agents, and work-transfer sessions so it sticks.",
      },
    ],
    instructors: [
      {
        name: "Denis Turkov",
        role: "Execuro · former Chief Architect at Spryker",
        img: denisPhoto,
        bio: "Denis has spent 15+ years leading engineering at enterprise scale. As Chief Architect at Spryker he scaled systems for ALDI, Siemens Healthineers, Hornbach and Pistor (€300M–3B GMV), launched products across 16 countries, and scaled to 50,000 orders a minute. These days he builds production e-commerce agents, support agents and internal tools with agentic workflows, and runs Execuro.",
      },
      {
        name: "Guido X Jansen",
        role: "AI workflows in production · 500+ business experiments",
        img: guidoPhoto,
        bio: "I bring the experimentation and adoption side. I've run 500+ business experiments, so I treat AI the same way: measure the outcome, not the output. I ship AI workflows in production myself (the pipelines behind parts of Sifa ID), and I worked with Denis at Spryker. My job in the room is making sure this sticks with your team, not just on demo day.",
      },
    ],
    whyMe:
      "I've built and deployed AI workflows in production, including the pipelines that power parts of Sifa ID. I've also run 500+ business experiments, so I approach AI the same way: measure the outcome, not the output.",
    guarantee:
      "If your team isn't running agentic workflows within 30 days, we come back for a free half-day follow-up. Applies to Accelerator and Bootcamp.",
    prerequisites: [
      "Production-level engineering experience",
      "A laptop with your preferred AI coding tool: Claude Code, Cursor, Codex or GitHub Copilot",
      "No special setup needed",
    ],
    security:
      "Everything runs in your environment. On-prem and air-gapped are supported, your data stays with you, and it works alongside SOC 2 / ISO 27001 controls.",
  },
  {
    slug: "atproto",
    t: "Intro to Building on AT Protocol",
    sub: "Open social tech for developers",
    level: "Beginner / intermediate",
    fmt: "Workshop · half or full day",
    accent: "foam",
    points: [
      "What AT Protocol actually is — and why it matters for your product",
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
        d: "Teams evaluating AT Protocol as an infrastructure choice for their next product.",
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
      "I've been teaching people how to use tech products since 2006. I've used Bluesky since mid-2024 and have been building on AT Protocol since Q4 2025: <a href='https://sifa.id' target='_blank' rel='noopener noreferrer' class='underline underline-offset-2 hover:opacity-80' style='color:var(--ac-text,var(--ac))'>Sifa ID</a> (portable professional identity on atproto) and Barazo (open community forums) are both production projects on the network. I hosted an unconference at ATmosphere Conf 2026 in Vancouver. I know where the sharp edges are.",
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
