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
  /**
   * Site-only, not a record field: file name in src/assets/images/uses/.
   * Own photos, with metadata stripped and nothing personal in frame. A vendor
   * image only where Guido chose one (interstuhl-twentyfour.jpg).
   */
  photo?: string;
  /**
   * Site-only: iconify name ("simple-icons:astro", "tabler:rss") shown next to
   * the name when there is no photo. Add new names to the astro-icon include
   * list in astro.config.mjs.
   */
  icon?: string;
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
export const lastReviewed = "2026-11-04";

export const principles: UsesPrinciple[] = [
  {
    title: "Own the data, or be able to leave",
    text: "Before I adopt a tool I assume I will one day want to leave it again, so I want to confirm the available exit strategy. An app that lets me export plain files (e.g. Markdown) and uses open protocols (e.g. CalDAV) will beat a nicer app that holds my data hostage.",
  },
  {
    title: "Open source first, open standards second",
    text: "I prefer tools where I can read (and adjust) the code. When that's not possible, I'd want formats and protocols that more than one tool speaks.",
  },
  {
    title: "Local-first, cloud optional",
    text: "Home automations, media players and family photos should keep working when the internet (or a vendor) doesn't. Cloud is a nice extra, but things shouldn't break when it's gone.",
  },
  {
    title: "The bankruptcy test",
    text: "For hardware I ask what happens if the company disappears: a device with a local API keeps working, while a cloud-only one (e.g. most voice assistants) becomes e-waste.",
  },
  {
    title: "Subscriptions only on purpose",
    text: "I pick a one-time purchase when one exists. The subscriptions I have are mostly for convenience or to support the makers, not for access to my own data.",
  },
  {
    title: "EU and privacy-respecting where it's practical",
    text: "GDPR exists for a reason, so I lean towards European providers. I'm pragmatic about it though: I'm ok with using a non-EU service when lock-in is low and I can still easily leave. Avoiding every piece of software or hardware that phones home is not practical, so I disable telemetry or block it.",
  },
  {
    title: "Own my identity",
    text: "My own email domain makes later migration easier: the provider behind it can change while my address stays the same. I use my own domain as my handle (gui.do) on Bluesky via AT Protocol and keep my account data on a PDS, the server that stores it, so I can swap out the PDS host whenever I want while my handle and followers stay where they are.",
  },
  {
    title: "Replace gradually",
    text: "I run old and new side by side and switch when the new setup is boringly reliable.",
  },
];

/** Display order of the item groups on the page. */
export const categoryOrder = [
  "Personal hardware",
  "Home",
  "OS and desktop",
  "Development",
  "AI (local and hosted)",
  "Notes, media and self-hosted services",
  "Photo, video and streaming",
  "Studio and presenting",
  "Gaming",
  "Communication and privacy",
] as const;

export const items: UsesItem[] = [
  // Personal hardware
  {
    name: "Desktop PC (AMD Ryzen, RTX 5070)",
    icon: "tabler:device-desktop",
    kind: "device",
    area: "tech",
    category: "Personal hardware",
    status: "using",
    reason:
      "One machine for code, calls, streaming and most games, and the one my other devices attach to.",
    startedAt: "2026-10",
    replaces: [{ name: "Mac mini as daily workstation" }],
  },
  {
    name: "ThinkPad X1 Carbon",
    photo: "thinkpad-x1-carbon.jpg",
    kind: "device",
    area: "tech",
    category: "Personal hardware",
    status: "using",
    reason:
      "A second-hand laptop that runs Linux without fuss. It syncs with the desktop and attaches to the same tmux sessions.",
    storyUrl: STORY_LOCAL_AI,
  },
  {
    name: "Fairphone 6",
    photo: "fairphone-6.jpg",
    url: "https://www.fairphone.com/the-fairphone-gen-6",
    kind: "device",
    area: "tech",
    category: "Personal hardware",
    status: "using",
    reason:
      "Repairable and ethically sourced. The phone it replaced was dying (well, mainly its battery).",
    replaces: [{ name: "Samsung Galaxy S21 Ultra" }],
    storyUrl: STORY_2025,
  },
  {
    name: "ZSA Voyager",
    photo: "zsa-voyager.jpg",
    url: "https://www.zsa.io/voyager",
    kind: "device",
    area: "tech",
    category: "Personal hardware",
    status: "trying",
    reason:
      "A split, programmable keyboard that I'm still learning Colemak DH on.",
    downside: "Typing speed dropped while I learn the new layout.",
  },
  {
    name: "Supernote Manta",
    photo: "supernote-manta.jpg",
    url: "https://supernote.com/products/supernote-manta",
    kind: "device",
    area: "tech",
    category: "Personal hardware",
    status: "using",
    reason:
      "An e-ink tablet for handwritten notes and e-books that syncs to my own server instead of the vendor cloud.",
    storyUrl: STORY_2025,
  },

  {
    name: "Fully Jarvis L-shaped standing desk",
    icon: "tabler:desk",
    url: "https://www.fully.com",
    kind: "product",
    area: "home",
    category: "Personal hardware",
    status: "using",
    reason:
      "I like standing up for calls and for some of the work, but not all day. So I needed a desk that can reliably go up and down and gives me a lot of space. Since I'm in the corner of my home office, the L shape makes perfect sense and works great. It's a very stable frame on which I could put my own custom tabletop. Combined with the Aeris Muvmat it's great for alternating between sitting and standing.",
  },
  {
    name: "Aeris Muvmat",
    icon: "tabler:shoe",
    url: "https://www.aeris.de/en/products/aeris-muvmat-schwarz-ohne-bezug",
    kind: "product",
    area: "home",
    category: "Personal hardware",
    status: "using",
    reason:
      'Nice "forest pebbles" surface for standing work/calls that is both soft and makes you move around (so you don\'t lock yourself into a single position too long).',
  },
  {
    name: "Interstuhl TWENTYFOUR",
    photo: "interstuhl-twentyfour.jpg",
    url: "https://www.interstuhl.com/ia-en/products/twentyfour",
    kind: "product",
    area: "home",
    category: "Personal hardware",
    status: "using",
    reason:
      "I sit at my desk a lot. Not 24 hours, but I still really needed this to be a good one. I like my back not hurting all the time ;) The seat and back covers come off for cleaning!",
    downside:
      "More boring compared to those hip gaming chairs, but if I sit in it I don't see the chair anyway, but do feel it ;)",
  },
  {
    name: "Sony WH-1000XM5",
    icon: "tabler:headphones",
    url: "https://www.sony.co.uk/electronics/headband-headphones/wh-1000xm5",
    kind: "device",
    area: "tech",
    category: "Personal hardware",
    status: "using",
    reason:
      "I bought it because I was quite happy with my XM3, but lost that at an airport.",
    replaces: [{ name: "Sony WH-1000XM3" }],
  },
  {
    name: "Garmin Epix Pro",
    icon: "simple-icons:garmin",
    url: "https://www.garmin.com/nl-NL/p/884292/",
    kind: "device",
    area: "tech",
    category: "Personal hardware",
    status: "using",
    reason: "A very good product and fun to customize the dials yourself.",
    downside:
      "Their app ecosystem has some weird quirks and they are starting to behave like a monopolist. Especially on a watch priced like this, I'd expect to be able to use all features, not have some locked behind a paywall. I would go for an EU-based alternative next time.",
  },

  // Home
  {
    name: "Firewalla",
    icon: "simple-icons:firewalla",
    url: "https://firewalla.com/products/firewalla-gold-pro",
    model: "Gold Pro",
    kind: "device",
    area: "tech",
    category: "Home",
    status: "using",
    reason:
      "A router and firewall with per-device rules and domain blocking, without needing a cloud account for the basics. I use it for custom DNS rules, network insights and blocking ads and trackers across the whole network.",
    storyUrl: STORY_2025,
  },
  {
    name: "Home Assistant Green with a Zigbee and Thread (Matter) stick",
    photo: "home-assistant-green.jpg",
    url: "https://www.home-assistant.io/green/",
    kind: "device",
    area: "home",
    category: "Home",
    status: "using",
    reason:
      "Central hub for all home-based automations, without any reliance on the internet. It's a dedicated box, so I can reboot my other machines freely.",
    storyUrl: STORY_ANTIFRAGILE,
  },
  {
    name: "HomeWizard P1 meter, water meter and plugs",
    icon: "tabler:plug",
    url: "https://www.homewizard.com",
    kind: "device",
    area: "home",
    category: "Home",
    status: "using",
    reason:
      "They have a local API, so Home Assistant reads them directly. I switched off their cloud connection.",
    downside:
      "Without the cloud connection their own app loses history and remote access. The HomeWizard plugs are overpriced, so the new plugs I buy now are IKEA GRILLPLATS.",
  },
  {
    name: "Raspberry Pi 5",
    photo: "raspberry-pi-5.jpg",
    url: "https://www.raspberrypi.com/products/raspberry-pi-5/",
    kind: "device",
    area: "tech",
    category: "Home",
    status: "using",
    reason:
      "It runs some of my containers to take the load off the NAS. Especially for write-heavy containers it's nice to be able to bring down the HDD noise from the NAS (the RPi has an NVMe drive that doesn't make any noise).",
  },
  {
    name: "Stages SB20",
    icon: "tabler:bike",
    url: "https://stagescycling.com/en_global/product/indoor-cycling/smart-bikes",
    kind: "device",
    area: "home",
    category: "Home",
    status: "using",
    reason:
      "I chose it because it's the best complete and compact indoor bike (as in: not a roller for an outdoor bike) I could find that didn't require a subscription to ride. It needed to fit in my home office, so it couldn't be too long. You can adjust the handlebars and seat up, down, forward, or back, which makes it great.",
  },
  {
    name: "DYMO LabelManager 160",
    photo: "dymo-labelmanager-160.jpg",
    url: "https://www.dymo.com/label-makers-printers/labelmanager-label-makers/dymo-labelmanager-160-portable-label-maker/SP_95477.html",
    kind: "device",
    area: "home",
    category: "Home",
    status: "using",
    reason:
      "I love it because (afterwards) it helps me find things much faster.",
    downside: "My girlfriend hates it (when labels are visible anywhere).",
  },

  // OS and desktop
  {
    name: "CachyOS with KDE Plasma",
    icon: "simple-icons:cachyos",
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
    name: "chezmoi with metapac",
    icon: "tabler:file-settings",
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
    icon: "simple-icons:zenbrowser",
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
    icon: "tabler:microphone",
    url: "https://handy.computer",
    kind: "software",
    area: "tech",
    category: "OS and desktop",
    status: "trying",
    reason: "Local speech-to-text, so my voice never leaves the machine.",
    replaces: [{ name: "MacWhisper" }],
  },
  {
    name: "LibreOffice",
    icon: "simple-icons:libreoffice",
    url: "https://www.libreoffice.org",
    kind: "software",
    area: "tech",
    category: "OS and desktop",
    status: "using",
    replaces: [{ name: "Microsoft Office" }],
  },

  // Development
  {
    name: "Ghostty and tmux, with sesh and workmux",
    icon: "simple-icons:ghostty",
    url: "https://ghostty.org",
    kind: "software",
    area: "tech",
    category: "Development",
    status: "using",
    reason:
      "A fast terminal with sane defaults, and tmux sessions that live on the desktop. I attach from the laptop or my phone and continue where I left off.",
    replaces: [{ name: "cmux" }],
  },
  {
    name: "Zed",
    icon: "simple-icons:zedindustries",
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
    icon: "simple-icons:astro",
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
    icon: "simple-icons:githubactions",
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
    icon: "simple-icons:codeberg",
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
    icon: "simple-icons:tangled",
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
    name: "Ollama",
    icon: "simple-icons:ollama",
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
    icon: "simple-icons:openrouter",
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
    icon: "simple-icons:obsidian",
    url: "https://obsidian.md",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "Everything is plain Markdown on my disk. I pay for Obsidian Sync for the mobile convenience and to support the developer.",
    downside:
      "The sync service is a monthly subscription, even though the app itself is free.",
    replaces: [{ name: "Evernote and Notion" }],
    storyUrl: STORY_ANTIFRAGILE,
  },
  {
    name: "FreshRSS",
    icon: "simple-icons:freshrss",
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
    icon: "simple-icons:synology",
    url: "https://www.synology.com",
    kind: "device",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "It runs my containers. I wouldn't buy a Synology today, but I see no reason to replace one that works.",
    downside:
      "With more containers, its CPU and memory are starting to run out.",
    storyUrl: STORY_2025,
    replaces: [{ name: "Google Drive" }, { name: "Dropbox" }],
  },
  {
    name: "Home lab tools",
    icon: "tabler:box-multiple",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "These are small tools not worth one entry each: Portainer CE, Homepage, Glances, Uptime Kuma, Diun, WireGuard, Paperless-ngx, Calibre-web, Kiwix, NocoDB, and n8n. All are open source.",
  },
  {
    name: "Immich",
    icon: "simple-icons:immich",
    url: "https://immich.app",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "I host my family photos and videos on my own NAS, backed up from my phone. The heavy machine-learning work runs on my desktop GPU instead of the NAS.",
    downside:
      "The first import and face recognition crushed the NAS CPU for days.",
    replaces: [{ name: "Google Photos" }],
    storyUrl: STORY_2025,
  },
  {
    name: "Plex",
    icon: "simple-icons:plex",
    url: "https://www.plex.tv",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "Wouldn't start using it today, but I bought a lifetime pass when it was very cheap and the combination with Plexamp is also convenient. With telemetry and ads blocked it's fine for now. Ideally I'll replace it with an open source alternative at some point (Jellyfin?) but it's not high on my todo list.",
    downside: "Plex is closed source.",
    storyUrl: STORY_2025,
  },
  {
    name: "Audiobookshelf with Symfonium",
    icon: "simple-icons:audiobookshelf",
    url: "https://www.audiobookshelf.org",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    replaces: [{ name: "Audible" }],
  },
  {
    name: "Plexamp",
    icon: "tabler:headphones",
    url: "https://www.plex.tv/plexamp/",
    kind: "software",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    replaces: [{ name: "YouTube Music" }],
  },
  {
    name: "Grayjay",
    icon: "tabler:player-play",
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
    name: "NPO Start",
    icon: "tabler:device-tv",
    url: "https://npo.nl/start",
    kind: "service",
    area: "tech",
    category: "Notes, media and self-hosted services",
    status: "using",
    reason:
      "My kids want Dutch programming. Netflix and Disney+ are too weak on that. I'm using the free tier.",
    replaces: [{ name: "Streaming subscriptions (Netflix, Disney+, Prime)" }],
  },
  {
    name: "Hetzner",
    icon: "simple-icons:hetzner",
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
    icon: "tabler:calendar",
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
    icon: "tabler:rss",
    category: "Notes, media and self-hosted services",
    area: "tech",
    status: "using",
    reason:
      "I host static feeds and audio files on my own server to cut out the vendor between me and my listeners. It costs much less than my old Transistor subscription because it's just a small share of a VPS that runs other things too.",
    startedAt: "2026-10",
    replaces: [{ name: "Transistor" }],
  },
  {
    name: "Umami",
    icon: "simple-icons:umami",
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
    icon: "simple-icons:listmonk",
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
    icon: "tabler:calendar-time",
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
    icon: "tabler:aperture",
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
    icon: "simple-icons:affinity",
    url: "https://affinity.studio",
    kind: "software",
    area: "creative",
    category: "Photo, video and streaming",
    status: "using",
    reason: "Photo and design editing.",
    replaces: [{ name: "Adobe Creative Cloud" }],
  },
  {
    name: "OBS Studio",
    icon: "simple-icons:obsstudio",
    url: "https://obsproject.com",
    kind: "software",
    area: "creative",
    category: "Photo, video and streaming",
    status: "using",
    reason:
      "Recording, calls and streaming from one scene collection, native on Linux.",
  },

  // Studio and presenting
  {
    name: "Canon R6 Mark II with 24-105, 70-200, 50 and 35mm lenses",
    icon: "tabler:camera",
    url: "https://www.canon-europe.com/cameras/eos-r6-mark-ii/",
    kind: "device",
    area: "creative",
    category: "Studio and presenting",
    status: "using",
    reason:
      "Great lenses and great pictures and videos. I mainly use these for family events.",
    downside:
      "Once you've started with Canon, it's really hard to escape the ecosystem lock-in.",
  },
  {
    name: "Sony RX100 V as webcam",
    icon: "simple-icons:sony",
    url: "https://www.sony.co.uk/electronics/cyber-shot-compact-cameras/dsc-rx100m5",
    kind: "device",
    area: "creative",
    category: "Studio and presenting",
    status: "using",
    reason:
      "Much better than any webcam, especially in lower light conditions.",
    downside:
      "Runs hot, but I solved that with a heatsink and a bolted-on mini fan.",
  },
  {
    name: "Røde Procaster and Wireless Pro with Elgato Wave XLR",
    icon: "tabler:microphone",
    url: "https://rode.com/en-nl/products/procaster",
    kind: "device",
    area: "creative",
    category: "Studio and presenting",
    status: "using",
    reason: "Everything they make is great.",
  },
  {
    name: "Elgato Key Light, Key Light Air and Prompter",
    icon: "tabler:bulb",
    url: "https://www.elgato.com/eu/en/p/key-light",
    kind: "device",
    area: "creative",
    category: "Studio and presenting",
    status: "using",
    reason:
      "All great to improve call quality and the Stream Deck integration makes it even easier. Works well on Linux with the StreamController app.",
  },
  {
    name: "Elgato Stream Deck and Stream Deck XL",
    icon: "simple-icons:elgato",
    url: "https://www.elgato.com/eu/en/p/stream-deck-xl",
    kind: "device",
    area: "tech",
    category: "Studio and presenting",
    status: "using",
    reason:
      "Great for macros/automations, easily opening apps, showing custom graphs/data, media control, lights, audio, Home Assistant...",
  },

  // Gaming
  {
    name: "Steam",
    icon: "simple-icons:steam",
    url: "https://store.steampowered.com",
    kind: "software",
    area: "tech",
    category: "Gaming",
    status: "using",
    reason: "As companies go, Valve seems pretty great.",
  },
  {
    name: "Raspberry Pi 4 with Batocera",
    icon: "tabler:device-gamepad-2",
    url: "https://batocera.org",
    kind: "device",
    area: "home",
    category: "Gaming",
    status: "using",
    reason:
      "I use this for retro console games with the kids on the TV: it runs Batocera (open source) and needs no store account.",
  },
  {
    name: "Minecraft Bedrock server",
    icon: "simple-icons:minecraft",
    url: "https://www.minecraft.net/en-us/download/server/bedrock",
    kind: "software",
    area: "home",
    category: "Gaming",
    status: "using",
  },

  // Communication and privacy
  {
    name: "Bluesky",
    icon: "simple-icons:bluesky",
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
    icon: "simple-icons:signal",
    url: "https://signal.org",
    kind: "software",
    area: "tech",
    category: "Communication and privacy",
    status: "using",
    reason: "Encrypted messaging.",
    downside: "Some groups are still stuck on WhatsApp.",
    replaces: [{ name: "WhatsApp" }],
    storyUrl: STORY_2025,
  },
  {
    name: "Marque",
    icon: "tabler:world-www",
    url: "https://marque.at",
    kind: "service",
    area: "tech",
    category: "Communication and privacy",
    status: "using",
    reason:
      "Almost all my domains are at Marque. I picked it because the registrar runs on AT Protocol. My registrations are public in my own PDS.",
    downside: "The company behind it is not in the EU.",
  },
  {
    name: "Fastmail",
    icon: "tabler:mail",
    url: "https://www.fastmail.com",
    kind: "service",
    area: "tech",
    category: "Communication and privacy",
    status: "using",
    reason:
      "Email, calendar and contacts on open protocols (IMAP, CalDAV, CardDAV) with my own domains.",
    downside:
      "Fastmail is an Australian company outside the EU. In June 2024, it laid off most of its US union's bargaining unit during contract talks. I want to move to a European provider eventually. But I only just moved here and migrating all my email domains takes a lot of time. There weren't many good EU options back then, so I'm staying for now and might look at cirrux.co later.",
    replaces: [{ name: "Google Workspace" }, { name: "Proton" }],
    storyUrl: STORY_ANTIFRAGILE,
  },
  {
    name: "Bitwarden",
    icon: "simple-icons:bitwarden",
    url: "https://bitwarden.com",
    kind: "software",
    area: "tech",
    category: "Communication and privacy",
    status: "using",
    reason: "An open source password manager with an export I can leave with.",
  },
  {
    name: "Aegis Authenticator",
    icon: "tabler:shield-lock",
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
    icon: "simple-icons:yubico",
    url: "https://www.yubico.com",
    kind: "device",
    area: "tech",
    category: "Communication and privacy",
    status: "using",
    reason: "A hardware security key for the accounts that matter most.",
  },

  // Dropped. "Replaced by" comes from the `replaces` lists above.
  {
    name: "Google Workspace",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason: "Untangling the Google sign-ins is still in progress.",
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
  },
  {
    name: "Twitter and Instagram",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    endedAt: "2024",
  },
  {
    name: "Audible",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason:
      "Fewer subscriptions, and I keep what I buy. Audiobooks and music now come from my own library.",
  },
  {
    name: "YouTube Music",
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
    name: "Transistor",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason:
      "I cancelled this paid podcast hosting subscription because self-hosting is cheaper. There is no vendor between me and my listeners anymore.",
    endedAt: "2026-10",
  },
  {
    name: "Cal.com",
    kind: "service",
    area: "tech",
    status: "dropped",
    droppedReason: "replaced",
    reason:
      "The hosted EU service closed on 1 November 2026 and the project went closed source.",
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
