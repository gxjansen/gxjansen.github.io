/* =====================================================================
   AMA Card — Satori-compatible (HTML/CSS subset, inline styles)
   ---------------------------------------------------------------------
   One layout, seven colour variants. Each question hashes to a
   (variant, persona) pair deterministically — same question, same card.
   The persona is one of a fixed roster of cartoon-animal avatars + names
   ("Heckling Heron", "Curious Cat", ...). All avatars are stylised
   illustrations in the Rosé Pine palette — never a real face.

   Rendering: 1200×630 (1.91:1) for Bluesky / OG link cards.
   Constraints: no <style>, no classes, no SVG filters, no position:fixed,
   no web fonts beyond what's embedded as TTF.

   Fonts to embed (Google Fonts OFL, shipped in ./fonts/):
     Poppins         — 500, 600, 700
     JetBrains Mono  — 600 (footer chrome)

   Ported verbatim from the Claude Design handoff at
   ~/Documents/CoreNotes/Workspaces/brand/2026-05-25-ama-feature-design.md
   ===================================================================== */
import * as React from "react";

/* =====================================================================
   Types
   ===================================================================== */
export type Variant = {
  id: string;
  bg: string;
  textColor: string;
  subtleColor: string;
  accent: string;
};
export type Persona = {
  name: string;
  // 3+ alliterating adjectives per persona. One is picked
  // deterministically per question (see pickAdjective).
  adjectives: [string, string, string, ...string[]];
  Avatar: React.ComponentType;
};

/* =====================================================================
   pickFontSize — auto-scale the question type to its length.
     ≤  90 chars → 64px  (short, hero-sized)
     ≤ 240 chars → 46px  (medium, comfortable)
     else        → 30px  (long, up to ~500 chars without overflow)
   ===================================================================== */
export function pickFontSize(len: number): number {
  if (len <= 90) return 64;
  if (len <= 240) return 46;
  return 30;
}

/* =====================================================================
   fnv1a — deterministic 32-bit hash.
   Used twice with different salts so the same question picks a stable
   variant AND a stable persona that are independent of each other.
   ===================================================================== */
export function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/* =====================================================================
   variants — 7 background+text token bundles, spread across Rosé Pine.
   Contrast audited at Poppins SemiBold ≥ 30px (AA Large threshold 3:1).
   ===================================================================== */
export const variants: Variant[] = [
  {
    id: "cream-pine",
    bg: "#faf4ed",
    textColor: "#1a1825",
    subtleColor: "#575279",
    accent: "#286983",
  },
  {
    id: "pine-gold",
    bg: "#1b4a5c",
    textColor: "#fffaf3",
    subtleColor: "#bdc8cd",
    accent: "#f6c177",
  },
  {
    id: "iris-cream",
    bg: "#907aa9",
    textColor: "#fffaf3",
    subtleColor: "#e8e1ef",
    accent: "#f6c177",
  },
  {
    id: "foam-cream",
    bg: "#3d7782",
    textColor: "#fffaf3",
    subtleColor: "#d6e6ea",
    accent: "#f6c177",
  },
  {
    id: "overlay-love",
    bg: "#f2e9e1",
    textColor: "#1a1825",
    subtleColor: "#575279",
    accent: "#b4637a",
  },
  {
    id: "gold-ink",
    bg: "#ea9d34",
    textColor: "#1a1825",
    subtleColor: "#4a3a1c",
    accent: "#1b4a5c",
  },
];

export function pickVariant(question: string): Variant {
  return variants[fnv1a(question) % variants.length];
}

import {
  OwlAvatar,
  HeronAvatar,
  KingfisherAvatar,
  HornbillAvatar,
  SwiftAvatar,
  HummingbirdAvatar,
  FalconAvatar,
  MagpieAvatar,
  AlbatrossAvatar,
  ToucanAvatar,
  HoopoeAvatar,
  CraneAvatar,
  RobinAvatar,
  GoldfinchAvatar,
  MothAvatar,
  DragonflyAvatar,
  BeeAvatar,
  BeetleAvatar,
  ButterflyAvatar,
  FlyingFishAvatar,
  BatAvatar,
  PterosaurAvatar,
  OrigamiCraneAvatar,
  PaperPlaneAvatar,
  GooseAvatar,
  CrowAvatar,
  CatAvatar,
  DogAvatar,
  HorseAvatar,
} from "./avatars";

/* =====================================================================
   personas — fixed roster of (name, avatar) pairs.
   Flying-leaning (the AMA lives on Bluesky). Birds first, then insects,
   then "other flyers", paper wildcards, then non-flying residents.
   ===================================================================== */
export const personas: Persona[] = [
  // Birds (14)
  {
    name: "Owl",
    adjectives: ["Observant", "Owlish", "Overthinking"],
    Avatar: OwlAvatar,
  },
  {
    name: "Heron",
    adjectives: ["Heckling", "Hangry", "Haunting"],
    Avatar: HeronAvatar,
  },
  {
    name: "Kingfisher",
    adjectives: ["Kibitzing", "Knowing", "Kvetching"],
    Avatar: KingfisherAvatar,
  },
  {
    name: "Hornbill",
    adjectives: ["Hollering", "Hectoring", "Honking"],
    Avatar: HornbillAvatar,
  },
  {
    name: "Swift",
    adjectives: ["Subtweeting", "Skeptical", "Scheming"],
    Avatar: SwiftAvatar,
  },
  {
    name: "Hummingbird",
    adjectives: ["Hovering", "Hyped", "Humming"],
    Avatar: HummingbirdAvatar,
  },
  {
    name: "Falcon",
    adjectives: ["Fact-checking", "Fuming", "Forensic"],
    Avatar: FalconAvatar,
  },
  {
    name: "Magpie",
    adjectives: ["Meddling", "Mocking", "Muckraking"],
    Avatar: MagpieAvatar,
  },
  {
    name: "Albatross",
    adjectives: ["Argumentative", "Anxious", "Aloof"],
    Avatar: AlbatrossAvatar,
  },
  {
    name: "Toucan",
    adjectives: ["Tweeting", "Talkative", "Trolling"],
    Avatar: ToucanAvatar,
  },
  {
    name: "Hoopoe",
    adjectives: ["Howling", "Hapless", "Hounding"],
    Avatar: HoopoeAvatar,
  },
  {
    name: "Crane",
    adjectives: ["Contemplative", "Crooning", "Calculating"],
    Avatar: CraneAvatar,
  },
  {
    name: "Robin",
    adjectives: ["Replying", "Ranting", "Roasting"],
    Avatar: RobinAvatar,
  },
  {
    name: "Goldfinch",
    adjectives: ["Glittering", "Gleeful", "Galvanized"],
    Avatar: GoldfinchAvatar,
  },
  // Insects (5)
  {
    name: "Moth",
    adjectives: ["Mysterious", "Mournful", "Meditative"],
    Avatar: MothAvatar,
  },
  {
    name: "Dragonfly",
    adjectives: ["Doom-scrolling", "Daring", "Dramatic"],
    Avatar: DragonflyAvatar,
  },
  {
    name: "Honeybee",
    adjectives: ["Hashtagging", "Hassling", "Humble-bragging"],
    Avatar: BeeAvatar,
  },
  {
    name: "Beetle",
    adjectives: ["Brooding", "Bickering", "Belaboring"],
    Avatar: BeetleAvatar,
  },
  {
    name: "Butterfly",
    adjectives: ["Browsing", "Beaming", "Babbling"],
    Avatar: ButterflyAvatar,
  },
  // Other flyers (3)
  {
    name: "Flying Fish",
    adjectives: ["Floundering", "Flailing", "Fretting"],
    Avatar: FlyingFishAvatar,
  },
  {
    name: "Bat",
    adjectives: ["Broadcasting", "Bewildered", "Bantering"],
    Avatar: BatAvatar,
  },
  {
    name: "Pterosaur",
    adjectives: ["Posting", "Pontificating", "Preachy"],
    Avatar: PterosaurAvatar,
  },
  // Wildcards (2)
  {
    name: "Origami Crane",
    adjectives: ["Outspoken", "Opining", "Off-topic"],
    Avatar: OrigamiCraneAvatar,
  },
  {
    name: "Paper Plane",
    adjectives: ["Pinging", "Pondering", "Parachuting"],
    Avatar: PaperPlaneAvatar,
  },
  // Companions (5)
  {
    name: "Goose",
    adjectives: ["Gossiping", "Grumpy", "Goading"],
    Avatar: GooseAvatar,
  },
  {
    name: "Crow",
    adjectives: ["Cryptic", "Cackling", "Croaking"],
    Avatar: CrowAvatar,
  },
  { name: "Cat", adjectives: ["Curious", "Catty", "Coy"], Avatar: CatAvatar },
  {
    name: "Dog",
    adjectives: ["DM'ing", "Devoted", "Distracted"],
    Avatar: DogAvatar,
  },
  {
    name: "Horse",
    adjectives: ["Hot-take", "Huffy", "Honest"],
    Avatar: HorseAvatar,
  },
];

// Different salt from variant + persona so the adjective varies
// independently. Same (question, persona) → same adjective every time.
export function pickAdjective(persona: Persona, question: string): string {
  const idx =
    fnv1a("adjective/" + persona.name + "/" + question) %
    persona.adjectives.length;
  return persona.adjectives[idx];
}

/**
 * Random pick for all three identity dimensions at once. Used by the
 * admin Regenerate button and the Telegram inline-keyboard regenerate
 * callback. The current pick may come up again — that's fine, just hit
 * Regenerate again. Cheaper than tracking exclusions.
 */
export function pickRandomOverrides(): {
  variantId: string;
  personaName: string;
  adjective: string;
} {
  const v = variants[Math.floor(Math.random() * variants.length)];
  const p = personas[Math.floor(Math.random() * personas.length)];
  const a = p.adjectives[Math.floor(Math.random() * p.adjectives.length)];
  return { variantId: v.id, personaName: p.name, adjective: a };
}

// Different salt from the variant pick so persona and variant are
// independent — same question stays stable across renders.
export function pickPersona(question: string): Persona {
  return personas[fnv1a("persona/" + question) % personas.length];
}

/* ---------- Wordmark — "Guido × Jansen" ----------------------------- */
export function Wordmark({
  size = 16,
  color,
  xColor,
}: {
  size?: number;
  color: string;
  xColor: string;
}) {
  const x = Math.round(size * 1.2);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        fontFamily: '"Poppins", system-ui, sans-serif',
        fontWeight: 700,
        fontSize: size,
        letterSpacing: "-0.01em",
        color,
        lineHeight: 1,
      }}
    >
      <span style={{ display: "flex" }}>Guido</span>
      <div
        style={{
          display: "flex",
          width: Math.round(x * 1.5),
          height: x,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={x}
          height={x}
          viewBox="0 0 24 24"
          fill="none"
          stroke={xColor}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6l-12 12" />
          <path d="M6 6l12 12" />
        </svg>
      </div>
      <span style={{ display: "flex" }}>Jansen</span>
    </div>
  );
}

/* =====================================================================
   AmaCard — renders one 1200×630 image.
   Layout (constant across variants):
     ┌─────────────────────────────────────────────────────────┐
     │ [Avatar 128]   {Adjective} {Animal}                     │
     │                asked Guido…                             │
     │                                                         │
     │       " {question — auto-sized 30/46/64} "              │
     │                                                         │
     │ gui.do/ama · ask anonymously                  #ama      │
     └─────────────────────────────────────────────────────────┘
   ===================================================================== */
export function AmaCard({
  question,
  variant,
  persona,
  adjective,
}: {
  question: string;
  variant?: Variant;
  persona?: Persona;
  adjective?: string;
}) {
  const v = variant ?? pickVariant(question);
  const p = persona ?? pickPersona(question);
  const a = adjective ?? pickAdjective(p, question);
  const fs = pickFontSize(question.length);

  const FONT = '"Poppins", system-ui, sans-serif';
  const FONT_MONO =
    '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  const Avatar = p.Avatar;

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        background: v.bg,
        color: v.textColor,
        fontFamily: FONT,
        padding: "44px 64px",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 26, zIndex: 1 }}
      >
        <div
          style={{
            display: "flex",
            width: 128,
            height: 128,
            borderRadius: 128,
            overflow: "hidden",
            flexShrink: 0,
            // Ring in the variant's subtle token so the avatar circle is
            // always visible against the card bg, even when an avatar's
            // internal backdrop is near-identical to the card (e.g.
            // cream-Robin on cream-pine — see PR feedback).
            boxShadow: `0 0 0 3px ${v.subtleColor}`,
          }}
        >
          <Avatar />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              display: "flex",
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: "-0.015em",
              color: v.textColor,
              lineHeight: 1.1,
            }}
          >
            <span style={{ display: "flex" }}>{`${a} ${p.name}`}</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 500,
              color: v.subtleColor,
              lineHeight: 1.2,
            }}
          >
            <span style={{ display: "flex" }}>asked Guido…</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          zIndex: 1,
          marginTop: 4,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            minWidth: 0,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              width: Math.round(fs * 1.0),
              marginRight: Math.round(fs * 0.32),
              marginTop: Math.round(-fs * 0.18),
              fontFamily: '"Source Serif", Georgia, serif',
              fontSize: Math.round(fs * 1.7),
              lineHeight: 1,
              color: v.accent,
              fontWeight: 700,
            }}
          >
            “
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              minWidth: 0,
              flexWrap: "wrap",
              alignContent: "flex-start",
              fontSize: fs,
              lineHeight: 1.22,
              letterSpacing: "-0.02em",
              fontWeight: 600,
              color: v.textColor,
              columnGap: `${Math.round(fs * 0.27)}px`,
              rowGap: `${Math.round(fs * 0.08)}px`,
            }}
          >
            {question
              .split(/\s+/)
              .filter(Boolean)
              .map((w, i) => {
                // Strip trailing punctuation so "gui.do," still matches
                // as a URL and "@user." still matches as a mention.
                const trailMatch = w.match(/[.,!?;:)\]]+$/);
                const trail = trailMatch ? trailMatch[0] : "";
                const core = trail ? w.slice(0, -trail.length) : w;

                // Mentions: @handle, @handle.tld → accent color, kept as-is.
                const mentionMatch = /^@[\w.-]+$/.test(core);
                // URLs: http(s)/www optional, requires a domain with a
                // letter TLD, optional path. Catches bare "gui.do" and
                // "bsky.social". Display strips http(s):// + www.
                const urlMatch = core.match(
                  /^(?:https?:\/\/)?(?:www\.)?([a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)+(?:\/[^\s]*)?)$/i,
                );

                const isLink = mentionMatch || !!urlMatch;
                const display = urlMatch ? urlMatch[1] : core;
                return (
                  <span
                    key={i}
                    style={{
                      display: "flex",
                      color: isLink ? v.accent : v.textColor,
                    }}
                  >
                    {display}
                    {trail}
                  </span>
                );
              })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1,
          paddingTop: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: FONT_MONO,
            fontSize: 26,
            fontWeight: 600,
            color: v.textColor,
            letterSpacing: "-0.01em",
          }}
        >
          <span style={{ display: "flex" }}>gui.do/ama</span>
          <span style={{ display: "flex", color: v.subtleColor, opacity: 0.7 }}>
            ·
          </span>
          <span
            style={{
              display: "flex",
              color: v.subtleColor,
              fontFamily: FONT,
              fontSize: 24,
              fontWeight: 500,
            }}
          >
            ask anonymously
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: FONT_MONO,
            fontSize: 30,
            fontWeight: 600,
            color: v.accent,
            letterSpacing: "-0.01em",
          }}
        >
          <span style={{ display: "flex" }}>#ama</span>
        </div>
      </div>
    </div>
  );
}
