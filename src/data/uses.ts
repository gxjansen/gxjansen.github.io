/**
 * Data for the /uses page.
 *
 * Item field names follow a public "uses" record schema, so the list can be
 * published as structured records later without renaming anything. Enum-like
 * fields (kind, area, status, droppedReason) hold short values; a publisher
 * maps them to full tokens.
 *
 * Rules for this file:
 * - Dates are "YYYY" or "YYYY-MM" strings. No days.
 * - `replaces` lives on the new item only. A dropped item's "replaced by" is
 *   derived from the items whose `replaces` names it (case-insensitive).
 * - `url` is a public homepage or repository. Never a self-hosted instance,
 *   hostname or IP. No versions, network layout or home-security details.
 */

export type UsesKind = "software" | "device" | "product" | "service";
export type UsesArea = "tech" | "home" | "creative" | "other";
export type UsesStatus = "using" | "trying" | "dropped";
export type UsesContext = "professional" | "personal";
export type UsesDroppedReason =
  "replaced" | "wornOut" | "lost" | "sold" | "outgrown";

/** Year ("2026") or year and month ("2026-10"). */
export type PartialDate = `${number}` | `${number}-${number}`;

export interface UsesReplacement {
  name: string;
  url?: string;
}

export interface UsesItem {
  name: string;
  url?: string;
  brand?: string;
  model?: string;
  kind?: UsesKind;
  area?: UsesArea;
  /** Display group on the page; one of `categoryOrder`. */
  category?: string;
  contexts?: UsesContext[];
  status: UsesStatus;
  isDefault?: boolean;
  reason?: string;
  downside?: string;
  startedAt?: PartialDate;
  endedAt?: PartialDate;
  droppedReason?: UsesDroppedReason;
  replaces?: UsesReplacement[];
  storyUrl?: string;
}

export interface UsesPrinciple {
  title: string;
  text: string;
}

const post = (slug: string) => `https://gui.do/post/${slug}/`;

const STORY_2025 = post("how-i-reduced-my-bigtech-dependencies-in-2025");
const STORY_ANTIFRAGILE = post(
  "practical-guide-to-building-antifragile-tech-stack",
);
const STORY_LOCAL_AI = post(
  "bigtech-independence-update-cleaning-house-for-local-ai",
);
const STORY_RUNNER = post("self-hosted-github-runner-vps");

/** Last content edit (YYYY-MM-DD). */
export const updated = "2026-11-01";
/** Last time the whole list was checked against reality (YYYY-MM-DD). */
export const lastReviewed = "2026-11-01";

export const principles: UsesPrinciple[] = [
  {
    title: "Own the data, or be able to leave",
    text: "Before I adopt a tool I check how hard it is to export everything. Plain files (Markdown) and open protocols (CalDAV) beat a nicer app that holds my data hostage.",
  },
  {
    title: "Open source first, open standards second",
    text: "I prefer tools where I can read the code. When that's not possible, I want formats and protocols that more than one tool speaks.",
  },
  {
    title: "Local-first, cloud optional",
    text: "The house, the media and the photos should keep working when the internet (or a vendor) doesn't. Cloud services are a nice extra on top.",
  },
  {
    title: "The bankruptcy test",
    text: "For hardware I ask what happens if the company disappears. A device with a local API keeps working. A cloud-only one becomes e-waste.",
  },
  {
    title: "Subscriptions only on purpose",
    text: "I pick a one-time purchase when one exists. The subscriptions I do keep pay for convenience, and not for access to my own files.",
  },
  {
    title: "EU and privacy-respecting where it's practical",
    text: "GDPR exists for a reason, so I lean towards European providers. I'm pragmatic about it though: I use a US service when lock-in is low and I can leave.",
  },
  {
    title: "Own my identity",
    text: "My own email domain makes every later migration easier: the provider behind it can change while my address stays the same.",
  },
  {
    title: "Replace gradually",
    text: "I run old and new side by side and switch when the new setup is boringly reliable. And when I install something, I turn off its telemetry first.",
  },
];

/** Display order of the item groups on the page. */
export const categoryOrder = [
  "Hardware",
  "Home and network",
  "OS and desktop",
  "Development",
  "AI (local and hosted)",
  "Notes, media and self-hosted services",
  "Photo, video and streaming",
  "Communication and privacy",
] as const;

export const items: UsesItem[] = [
  // Hardware
  {
    name: "Desktop PC (AMD Ryzen, RTX 5070)",
    kind: "device",
    area: "tech",
    category: "Hardware",
    status: "using",
    reason:
      "My main workstation since October 2026. One machine for code, calls, streaming and most games, and the one my other devices attach to.",
    startedAt: "2026-10",
    replaces: [{ name: "Mac mini as daily workstation" }],
  },
  {
    name: "ThinkPad X1 Carbon (second-hand)",
    kind: "device",
    area: "tech",
    category: "Hardware",
    status: "using",
    reason:
      "A second-hand laptop that runs Linux without fuss. It's my mobile machine and attaches to the same sessions as the desktop.",
    storyUrl: STORY_LOCAL_AI,
  },
  {
    name: "Fairphone 6",
    url: "https://www.fairphone.com",
    kind: "device",
    area: "tech",
    category: "Hardware",
    status: "using",
    reason:
      "Repairable and ethically sourced. The phone it replaced was dying.",
    replaces: [{ name: "Samsung Galaxy S21 Ultra" }],
    storyUrl: STORY_2025,
  },
  {
    name: "ZSA Voyager",
    url: "https://www.zsa.io/voyager",
    kind: "device",
    area: "tech",
    category: "Hardware",
    status: "trying",
    reason:
      "A split, programmable keyboard that I'm still learning Colemak DH on.",
    downside: "Typing speed dropped while I learn the new layout.",
  },
  {
    name: "Supernote Manta",
    url: "https://supernote.com",
    kind: "device",
    area: "tech",
    category: "Hardware",
    status: "using",
    reason:
      "An e-ink tablet for handwritten notes and e-books that syncs to my own server instead of the vendor cloud.",
    storyUrl: STORY_2025,
  },

  // Home and network
  {
    name: "Home Assistant Green with a Zigbee and Thread stick",
    url: "https://www.home-assistant.io",
    kind: "device",
    area: "home",
    category: "Home and network",
    status: "using",
    reason:
      "Lights and automations keep running when the internet is down. It's a dedicated box, so I can reboot my other machines freely.",
    storyUrl: STORY_ANTIFRAGILE,
  },
  {
    name: "HomeWizard energy meters and plugs",
    url: "https://www.homewizard.com",
    kind: "device",
    area: "home",
    category: "Home and network",
    status: "using",
    reason:
      "They have a local API, so Home Assistant reads them directly. I switched off their cloud connection.",
    downside:
      "Without the cloud connection their own app loses history and remote access.",
  },
  {
    name: "Raspberry Pi",
    url: "https://www.raspberrypi.com",
    kind: "device",
    area: "tech",
    category: "Home and network",
    status: "using",
    reason: "A small always-on box for a few home services.",
  },

  // OS and desktop
  {
    name: "CachyOS with KDE Plasma",
    url: "https://cachyos.org",
    kind: "software",
    area: "tech",
    category: "OS and desktop",
    status: "using",
    reason:
      "A fast Arch-based Linux that I manage with config in git. On my laptop since early 2026 and on my desktop since October 2026.",
    downside: "A few games and the iOS tooling still need other systems.",
    replaces: [{ name: "macOS" }],
  },
  {
    name: "Ghostty and tmux, with sesh and workmux",
    url: "https://ghostty.org",
    kind: "software",
    area: "tech",
    category: "OS and desktop",
    status: "using",
    reason:
      "A fast terminal with sane defaults, and tmux sessions that live on the desktop. I attach from the laptop or my phone and continue where I left off.",
    replaces: [{ name: "cmux" }],
  },
  {
    name: "chezmoi with metapac",
    url: "https://www.chezmoi.io",
    kind: "software",
    area: "tech",
    category: "OS and desktop",
    status: "using",
    reason:
      "Dotfiles and package lists synced across my Linux machines from one git repo, with secrets encrypted.",
  },
  {
    name: "Zen browser",
    url: "https://zen-browser.app",
    kind: "software",
    area: "tech",
    category: "OS and desktop",
    status: "using",
    reason:
      "My main browser. Firefox-based, with workspaces, and its telemetry is off by default.",
    replaces: [{ name: "Arc" }],
  },
  {
    name: "Handy",
    url: "https://handy.computer",
    kind: "software",
    area: "tech",
    category: "OS and desktop",
    status: "trying",
    reason: "Local speech-to-text, so my voice never leaves the machine.",
    replaces: [{ name: "MacWhisper" }],
  },

  // Development
  {
    name: "Zed",
    url: "https://zed.dev",
    kind: "software",
    area: "tech",
    category: "Development",
    status: "using",
    reason:
      "A fast, open source editor. I keep its diagnostics and metrics off.",
  },
  {
    name: "Astro",
    url: "https://astro.build",
    kind: "software",
    area: "tech",
    category: "Development",
    status: "using",
    reason:
      "Static-first sites with the content in files. It runs gui.do and cro.cafe.",
    replaces: [{ name: "Webflow" }],
    storyUrl: STORY_2025,
  },
  {
    name: "GitHub Actions on my own runner",
    url: "https://docs.github.com/en/actions/hosting-your-own-runners",
    kind: "service",
    area: "tech",
    category: "Development",
    status: "using",
    reason:
      "CI on a small Hetzner server is about four times faster and costs about half of the hosted minutes I was buying.",
    downside:
      "Only safe for private repos, because a runner executes whatever the workflow says.",
    replaces: [{ name: "GitHub-hosted runners" }],
    storyUrl: STORY_RUNNER,
  },
  {
    name: "Codeberg",
    url: "https://codeberg.org",
    kind: "service",
    area: "tech",
    category: "Development",
    status: "using",
    reason:
      "A non-profit, EU-based forge for private repos and my synced dotfiles.",
  },
  {
    name: "Tangled",
    url: "https://tangled.org",
    kind: "service",
    area: "tech",
    category: "Development",
    status: "trying",
    reason:
      "A git forge built on AT Protocol. My atproto.nl site deploys from there.",
  },

  // AI (local and hosted)
  {
    name: "Claude Code",
    url: "https://www.claude.com/product/claude-code",
    kind: "software",
    area: "tech",
    category: "AI (local and hosted)",
    status: "using",
    reason:
      "My main coding agent. It lets me build small tools myself instead of subscribing to yet another service. Its telemetry is off.",
    downside: "Closed source, and a flat-fee subscription with a quota.",
    storyUrl: STORY_2025,
  },
  {
    name: "Ollama",
    url: "https://ollama.com",
    kind: "software",
    area: "tech",
    category: "AI (local and hosted)",
    status: "using",
    reason:
      "Local models on my own GPU for when I'm offline, out of quota, or the data is private.",
    downside:
      "Slower and less capable than the hosted models, and the GPU draws about 210 W while it runs.",
    storyUrl: STORY_LOCAL_AI,
  },
  {
    name: "OpenRouter",
    url: "https://openrouter.ai",
    kind: "service",
    area: "tech",
    category: "AI (local and hosted)",
    status: "using",
    reason:
      "One API for many models, so I can swap models without changing tools. Lock-in is low, so I accept a US service here.",
    downside: "A US service, and not self-hosted.",
    storyUrl: STORY_2025,
  },

  // Notes, media and self-hosted services
  {
    name: "Obsidian",
    url: "https://obsidian.md",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "Everything is plain Markdown on my disk. I pay for Obsidian Sync for the mobile convenience, not for access.",
    downside:
      "The sync service is a monthly subscription, even though the app itself is free.",
    replaces: [{ name: "Evernote and Notion" }],
    storyUrl: STORY_ANTIFRAGILE,
  },
  {
    name: "FreshRSS",
    url: "https://freshrss.org",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "RSS back in my life after the Google Reader shutdown, on my own server.",
    storyUrl: STORY_LOCAL_AI,
  },
  {
    name: "Synology NAS",
    url: "https://www.synology.com",
    kind: "device",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "It replaced paid Google Drive and Dropbox storage and runs my containers. I wouldn't buy one today, but I see no reason to replace one that works.",
    downside:
      "With more containers, its CPU and memory are starting to run out.",
    storyUrl: STORY_2025,
  },
  {
    name: "Immich",
    url: "https://immich.app",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "My photo library without Google Photos. The heavy machine-learning work runs on my desktop GPU instead of the NAS.",
    downside:
      "The first import and face recognition crushed the NAS CPU for days.",
    replaces: [{ name: "Google Photos" }],
    storyUrl: STORY_2025,
  },
  {
    name: "Plex with the *arr apps",
    url: "https://www.plex.tv",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "I own a lifetime pass, so I use it. The *arr apps replaced a pile of streaming subscriptions.",
    downside: "Plex is closed source and I wouldn't buy it again.",
    replaces: [{ name: "Streaming subscriptions (Netflix, Disney+, Prime)" }],
    storyUrl: STORY_2025,
  },
  {
    name: "Grayjay",
    url: "https://grayjay.app",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "One client for YouTube and other video sources, on desktop and phone. I turned off playtime tracking.",
    replaces: [{ name: "YouTube app" }],
    storyUrl: STORY_2025,
  },
  {
    name: "Hetzner",
    url: "https://www.hetzner.com",
    kind: "service",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "German hosting for the few things that need a server outside my house, and for CI runners.",
    storyUrl: STORY_RUNNER,
  },
  {
    name: "cal.rs booking page",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "A small self-hosted booking page that writes into my own calendar.",
    startedAt: "2026-10",
    replaces: [{ name: "Cal.com" }],
  },
  {
    name: "Self-hosted podcast feeds",
    category: "Notes, media and self-hosted services",
    area: "tech",
    status: "using",
    reason:
      "Static feeds and files on my own server instead of a podcast host. Cheaper, and no vendor between me and my listeners.",
    startedAt: "2026-10",
    replaces: [{ name: "Transistor" }],
  },
  {
    name: "Umami",
    url: "https://umami.is",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "Privacy-friendly, cookie-free website analytics that I host myself.",
  },
  {
    name: "Listmonk",
    url: "https://listmonk.app",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "An open source newsletter tool that I run myself, so my subscriber list stays with me.",
  },
  {
    name: "Kairos (my own scheduler)",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "trying",
    reason:
      "A small service I wrote that plans tasks and habits into free time in my Fastmail calendar.",
    replaces: [{ name: "Reclaim.ai" }],
  },

  // Photo, video and streaming
  {
    name: "darktable and RawTherapee",
    url: "https://www.darktable.org",
    kind: "software",
    area: "creative",
    category: "Photo, video and streaming",
    status: "using",
    reason:
      "Open source RAW processing on Linux. A script culls the day's shots, RawTherapee exports them, and darktable is for the keepers.",
    downside:
      "RawTherapee has no profile for the R6 Mark II, so I borrow one from a sibling camera.",
    replaces: [{ name: "Adobe Lightroom" }],
  },
  {
    name: "Affinity",
    url: "https://affinity.studio",
    kind: "software",
    area: "creative",
    category: "Photo, video and streaming",
    status: "using",
    reason: "Photo and design editing without an Adobe subscription.",
    replaces: [{ name: "Adobe Creative Cloud" }],
  },
  {
    name: "OBS Studio",
    url: "https://obsproject.com",
    kind: "software",
    area: "creative",
    category: "Photo, video and streaming",
    status: "using",
    reason:
      "Recording, calls and streaming from one scene collection, native on Linux.",
  },

  // Communication and privacy
  {
    name: "Bluesky",
    url: "https://bsky.app",
    kind: "service",
    area: "tech",
    category: "Communication and privacy",
    status: "using",
    reason:
      "My main social account. I own the handle, and the data lives in a repo I can move.",
    replaces: [{ name: "Twitter and Instagram" }],
    storyUrl: STORY_2025,
  },
  {
    name: "Signal",
    url: "https://signal.org",
    kind: "software",
    area: "tech",
    category: "Communication and privacy",
    status: "using",
    reason:
      "Encrypted messaging. I keep moving chat groups over from WhatsApp.",
    downside: "Some groups are still stuck on WhatsApp.",
    replaces: [{ name: "WhatsApp" }],
    storyUrl: STORY_2025,
  },
  {
    name: "Fastmail",
    url: "https://www.fastmail.com",
    kind: "service",
    area: "tech",
    category: "Communication and privacy",
    status: "using",
    reason:
      "Email, calendar and contacts on open protocols (IMAP, CalDAV, CardDAV) with my own domains. I left Proton because its calendar was hard to automate.",
    downside: "It's Australian, so not in the EU.",
    replaces: [{ name: "Google Workspace" }, { name: "Proton" }],
    storyUrl: STORY_ANTIFRAGILE,
  },
  {
    name: "Cirrux",
    url: "https://www.cirrux.co",
    kind: "service",
    area: "tech",
    category: "Communication and privacy",
    status: "trying",
    reason:
      "EU-hosted email that I'm watching as a possible Fastmail replacement.",
    downside: "No web calendar yet, only third-party CalDAV clients.",
  },
  {
    name: "Bitwarden",
    url: "https://bitwarden.com",
    kind: "software",
    area: "tech",
    category: "Communication and privacy",
    status: "using",
    reason: "An open source password manager with an export I can leave with.",
  },
  {
    name: "Aegis Authenticator",
    url: "https://getaegis.app",
    kind: "software",
    area: "tech",
    category: "Communication and privacy",
    status: "using",
    reason:
      "An open source, offline authenticator app that isn't tied to a vendor account.",
    replaces: [{ name: "Authy" }],
  },
  {
    name: "YubiKey",
    url: "https://www.yubico.com",
    kind: "device",
    area: "tech",
    category: "Communication and privacy",
    status: "using",
    reason: "A hardware security key for the accounts that matter most.",
  },
  {
    name: "Telemetry off everywhere",
    area: "tech",
    category: "Communication and privacy",
    status: "using",
    reason:
      "One shared file of environment opt-outs plus per-app policies. I log each opt-out when I install something.",
    startedAt: "2026-10",
  },

  // Dropped. "Replaced by" comes from the `replaces` lists above.
  {
    name: "Google Workspace",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason:
      "Mail, calendar and contacts moved. Untangling the Google sign-ins is still in progress.",
  },
  {
    name: "Google Photos",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason: "I wanted my photo library on hardware I own.",
  },
  {
    name: "YouTube app",
    kind: "software",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason: "One client for several video sources, with tracking switched off.",
  },
  {
    name: "Twitter and Instagram",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason: "I stopped using them more than a year before my 2025 post.",
  },
  {
    name: "Audible and YouTube Music",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason:
      "Fewer subscriptions, and I keep what I buy. Audiobooks and music now come from my own library.",
  },
  {
    name: "Streaming subscriptions (Netflix, Disney+, Prime)",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason: "Too many subscriptions that kept getting worse.",
  },
  {
    name: "Evernote and Notion",
    kind: "software",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason: "Markdown files I own instead of a proprietary app.",
  },
  {
    name: "Webflow",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason: "Content in files and a static build instead of a hosted builder.",
  },
  {
    name: "Proton",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason:
      "I used it for email and calendar, but calendar automation was too limited. I need CalDAV.",
  },
  {
    name: "Arc",
    url: "https://arc.net",
    kind: "software",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason:
      "Development ended and it isn't open source. I went to Firefox first, then Zen.",
  },
  {
    name: "Synology Drive for notes",
    kind: "software",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason:
      "It lost updates when the NAS acted as the hub. My notes sync with Obsidian Sync now.",
    endedAt: "2026-06",
  },
  {
    name: "Transistor",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason:
      "Cheaper, and no vendor between me and my listeners. The subscription is cancelled.",
    endedAt: "2026-10",
  },
  {
    name: "Cal.com",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason:
      "The hosted EU service closed on 1 November 2026 and the project went closed source, so I moved to a small self-hosted booking page.",
    endedAt: "2026-10",
  },
  {
    name: "Adobe Creative Cloud",
    kind: "service",
    area: "creative",
    status: "dropped",
    droppedReason: "replaced",
    reason:
      "No more subscription for creative tools. RAW goes through darktable and RawTherapee, and for video I'm still learning DaVinci Resolve.",
    endedAt: "2026-11",
  },
  {
    name: "Reclaim.ai",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason: "I wanted a scheduler I control that writes into my own calendar.",
    endedAt: "2026-10",
  },
  {
    name: "Mac mini as daily workstation",
    kind: "device",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason: "One machine for everything, and no macOS lock-in.",
    endedAt: "2026-10",
  },
];

const norm = (s: string) => s.trim().toLowerCase();

/** Items still in use or being tried, in data order. */
export const currentItems = items.filter((i) => i.status !== "dropped");

/** Dropped items, in data order. */
export const droppedItems = items.filter((i) => i.status === "dropped");

/** Current items whose `replaces` names the given dropped item. */
export function replacedBy(dropped: UsesItem): UsesItem[] {
  const key = norm(dropped.name);
  return currentItems.filter((i) =>
    i.replaces?.some((r) => norm(r.name) === key),
  );
}
