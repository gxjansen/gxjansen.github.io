/* =====================================================================
   AMA Card avatars — extracted from card.tsx.
   Each animal is its own Satori-safe SVG (80×80 viewBox). Shared by the
   `personas` roster in ./card. See card.tsx for the rendering contract.
   ===================================================================== */
import * as React from "react";

/* =====================================================================
   Avatars — every animal is its own SVG, 80×80 viewBox.
   Filled-circle background + 2-4 fill shapes for the face. Pure paths /
   circles / ellipses — Satori-safe.
   The avatar's own palette is chosen to read on every variant bg.
   ===================================================================== */
export const C = {
  ink: "#1a1825",
  cream: "#fffaf3",
  beige: "#f2e9e1",
  rose: "#d7827e",
  love: "#b4637a",
  loveBr: "#eb6f92", // Rosé Pine Main love — bright red, used for the Robin bib
  gold: "#ea9d34",
  goldDk: "#c47e1e",
  pine: "#286983",
  pineDk: "#1b4a5c",
  foam: "#56949f",
  foamDk: "#3d7782",
  iris: "#907aa9",
  irisDk: "#735e8a",
};

/* ── Birds ──────────────────────────────────────────────────────────── */

// Owl — huge forward-facing eyes + ear tufts + rounded silhouette.
export function OwlAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.beige} />
      {/* ear tufts (kept inside the visible circle) */}
      <path d="M 22 18 L 18 8 L 32 18 Z" fill={C.irisDk} />
      <path d="M 58 18 L 62 8 L 48 18 Z" fill={C.irisDk} />
      {/* rounded body */}
      <ellipse cx="40" cy="46" rx="28" ry="26" fill={C.irisDk} />
      {/* face plate */}
      <ellipse cx="40" cy="42" rx="22" ry="20" fill={C.cream} />
      {/* HUGE forward eyes */}
      <circle cx="28" cy="38" r="10" fill={C.gold} />
      <circle cx="52" cy="38" r="10" fill={C.gold} />
      <circle cx="28" cy="38" r="6" fill={C.ink} />
      <circle cx="52" cy="38" r="6" fill={C.ink} />
      <circle cx="30" cy="36" r="1.6" fill={C.cream} />
      <circle cx="54" cy="36" r="1.6" fill={C.cream} />
      {/* small triangular beak */}
      <path d="M 36 50 L 40 60 L 44 50 Z" fill={C.gold} />
    </svg>
  );
}

// Heron — dramatic S-curve neck + long dagger bill + LONG thin legs.
export function HeronAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.foam} />
      {/* LONG thin yellow legs (extend nearly to the bottom of the circle) */}
      <path
        d="M 42 50 L 40 76"
        stroke={C.gold}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 50 50 L 52 76"
        stroke={C.gold}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* feet hints */}
      <path
        d="M 36 76 L 44 76"
        stroke={C.gold}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 48 76 L 56 76"
        stroke={C.gold}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* compact body sits higher to leave leg room */}
      <ellipse cx="46" cy="46" rx="13" ry="9" fill={C.beige} />
      {/* dramatic S-curve long neck */}
      <path
        d="M 42 42 C 58 38, 26 32, 26 20"
        stroke={C.beige}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* small head */}
      <circle cx="26" cy="18" r="5.5" fill={C.beige} />
      {/* long sharp dagger bill */}
      <path d="M 20 18 L 4 14 L 20 22 Z" fill={C.gold} />
      {/* trailing breeding plumes */}
      <path
        d="M 28 14 Q 38 8 42 10"
        stroke={C.foamDk}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 28 10 Q 36 4 40 6"
        stroke={C.foamDk}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* wing fold */}
      <path
        d="M 44 44 Q 56 38 60 50"
        stroke={C.foamDk}
        strokeWidth="1.5"
        fill="none"
        opacity="0.55"
      />
      {/* eye */}
      <circle cx="26" cy="16" r="1.3" fill={C.ink} />
    </svg>
  );
}

// Kingfisher — perched profile: oversized blue head + long dagger bill + rust belly.
export function KingfisherAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.cream} />
      {/* perch line */}
      <path
        d="M 12 64 L 68 64"
        stroke={C.goldDk}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* stout body — mostly blue back */}
      <ellipse cx="44" cy="50" rx="20" ry="15" fill={C.pine} />
      {/* RUST belly */}
      <ellipse cx="44" cy="58" rx="16" ry="6" fill={C.love} />
      {/* OVERSIZED head (almost as wide as the body) */}
      <circle cx="34" cy="32" r="16" fill={C.pine} />
      {/* WHITE throat patch */}
      <ellipse cx="32" cy="42" rx="6" ry="3" fill={C.cream} />
      {/* LONG straight dagger bill */}
      <path d="M 18 32 L -4 28 L 18 38 Z" fill={C.ink} />
      {/* foot stubs on perch */}
      <path
        d="M 38 62 L 38 66"
        stroke={C.goldDk}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 50 62 L 50 66"
        stroke={C.goldDk}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* tail */}
      <path d="M 60 50 L 72 52 L 64 56 Z" fill={C.pine} />
      {/* eye */}
      <circle cx="34" cy="28" r="2.6" fill={C.ink} />
      <circle cx="35" cy="27" r="1" fill={C.cream} />
    </svg>
  );
}

// Hornbill — massive curved bill + casque on top.
export function HornbillAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.beige} />
      {/* body */}
      <ellipse cx="50" cy="54" rx="20" ry="18" fill={C.ink} />
      {/* white wing band */}
      <ellipse cx="58" cy="60" rx="9" ry="4" fill={C.cream} opacity="0.9" />
      {/* head */}
      <circle cx="40" cy="36" r="14" fill={C.ink} />
      {/* huge downward-curving beak */}
      <path d="M 28 38 Q 8 38 4 48 Q 8 52 28 48 Z" fill={C.gold} />
      {/* CASQUE on top of beak — the diagnostic feature */}
      <path
        d="M 12 32 Q 24 22 32 30 Q 32 38 26 40 Q 14 40 12 32 Z"
        fill={C.love}
      />
      {/* casque crease */}
      <path
        d="M 14 32 Q 22 28 28 32"
        stroke={C.goldDk}
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
      />
      {/* eye */}
      <circle cx="44" cy="34" r="2.4" fill={C.cream} />
      <circle cx="44" cy="34" r="1.2" fill={C.ink} />
    </svg>
  );
}

// Swift — iconic boomerang/anchor silhouette: long sickle wings swept back.
export function SwiftAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.foam} />
      {/* left wing — long sweeping sickle */}
      <path
        d="M 40 42 Q 28 36 10 16 Q 16 30 32 38 Q 36 40 40 42 Z"
        fill={C.pineDk}
      />
      {/* right wing — mirrored sickle */}
      <path
        d="M 40 42 Q 52 36 70 16 Q 64 30 48 38 Q 44 40 40 42 Z"
        fill={C.pineDk}
      />
      {/* slim body — vertical cigar */}
      <ellipse cx="40" cy="46" rx="4" ry="16" fill={C.pineDk} />
      {/* tiny round head */}
      <circle cx="40" cy="36" r="5" fill={C.pineDk} />
      {/* deeply forked tail (V notch) */}
      <path d="M 36 58 L 30 70 L 40 62 L 50 70 L 44 58 Z" fill={C.pineDk} />
      {/* eye dot */}
      <circle cx="40" cy="35" r="1.2" fill={C.cream} />
      {/* tiny beak underneath */}
      <path d="M 38 38 L 40 42 L 42 38 Z" fill={C.ink} />
    </svg>
  );
}

// Hummingbird — needle bill + throat gorget + motion-blur wings.
export function HummingbirdAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.rose} />
      {/* motion-blur wings (layered ovals) */}
      <ellipse cx="52" cy="28" rx="16" ry="5" fill={C.iris} opacity="0.4" />
      <ellipse cx="50" cy="30" rx="14" ry="4" fill={C.iris} opacity="0.6" />
      <ellipse cx="50" cy="48" rx="14" ry="4" fill={C.iris} opacity="0.6" />
      <ellipse cx="52" cy="50" rx="16" ry="5" fill={C.iris} opacity="0.4" />
      {/* tiny tail */}
      <path d="M 50 42 L 64 44 L 60 48 L 50 46 Z" fill={C.pineDk} />
      {/* tiny body */}
      <ellipse cx="36" cy="40" rx="13" ry="9" fill={C.foam} />
      {/* head */}
      <circle cx="26" cy="34" r="8" fill={C.foamDk} />
      {/* iridescent throat gorget */}
      <ellipse cx="30" cy="42" rx="6" ry="3.5" fill={C.gold} />
      {/* needle bill */}
      <path d="M 18 34 L 2 32 L 18 38 Z" fill={C.ink} />
      {/* eye */}
      <circle cx="26" cy="32" r="1.6" fill={C.cream} />
      <circle cx="26" cy="32" r="0.8" fill={C.ink} />
    </svg>
  );
}

// Falcon — peregrine head portrait: dark hood + thick malar stripes + hooked beak.
export function FalconAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.beige} />
      {/* DARK peregrine HOOD — wraps top + sides of head */}
      <path
        d="M 8 36 Q 10 12 40 8 Q 70 12 72 36 Q 70 50 60 56 Q 56 44 48 42 L 32 42 Q 24 44 20 56 Q 10 50 8 36 Z"
        fill={C.ink}
      />
      {/* white face/cheeks */}
      <path d="M 22 44 Q 40 62 58 44 L 54 60 Q 40 70 26 60 Z" fill={C.cream} />
      {/* THICK MALAR STRIPES on both sides */}
      <path
        d="M 30 38 L 24 60"
        stroke={C.ink}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M 50 38 L 56 60"
        stroke={C.ink}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* yellow cere (above beak) */}
      <rect x="34" y="38" width="12" height="6" rx="2" fill={C.gold} />
      {/* HOOKED BEAK — curving sharply down */}
      <path
        d="M 34 44 L 40 56 L 46 44 Q 44 52 40 52 Q 36 52 34 44 Z"
        fill={C.goldDk}
      />
      {/* piercing yellow-rimmed eyes */}
      <ellipse cx="30" cy="32" rx="4" ry="4.5" fill={C.gold} />
      <ellipse cx="50" cy="32" rx="4" ry="4.5" fill={C.gold} />
      <circle cx="30" cy="32" r="2.2" fill={C.ink} />
      <circle cx="50" cy="32" r="2.2" fill={C.ink} />
      {/* eye glints */}
      <circle cx="31" cy="31" r="0.8" fill={C.cream} />
      <circle cx="51" cy="31" r="0.8" fill={C.cream} />
    </svg>
  );
}

// Magpie — pied B&W + long tail + iridescent shoulder.
export function MagpieAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.foam} />
      {/* LONG TAIL */}
      <ellipse cx="62" cy="50" rx="14" ry="4" fill={C.ink} />
      {/* iridescent tail shimmer */}
      <ellipse cx="58" cy="50" rx="9" ry="2" fill={C.iris} opacity="0.75" />
      {/* black body */}
      <ellipse cx="36" cy="44" rx="18" ry="17" fill={C.ink} />
      {/* WHITE belly */}
      <ellipse cx="36" cy="54" rx="13" ry="8" fill={C.cream} />
      {/* iridescent shoulder */}
      <ellipse cx="44" cy="40" rx="7" ry="5" fill={C.iris} />
      {/* black wing tip */}
      <ellipse cx="50" cy="44" rx="4" ry="6" fill={C.ink} />
      {/* head */}
      <circle cx="26" cy="34" r="11" fill={C.ink} />
      {/* thick beak */}
      <path d="M 16 34 L 4 32 L 16 38 Z" fill={C.ink} />
      {/* eye */}
      <circle cx="26" cy="32" r="2" fill={C.cream} />
      <circle cx="26" cy="32" r="0.9" fill={C.ink} />
    </svg>
  );
}

// Albatross — VERY long narrow wings + hooked yellow beak.
export function AlbatrossAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.foam} />
      {/* very long narrow wings */}
      <path d="M 2 38 Q 18 28 38 38 Q 18 42 2 42 Z" fill={C.cream} />
      <path d="M 78 38 Q 62 28 42 38 Q 62 42 78 42 Z" fill={C.cream} />
      {/* dark wing tips */}
      <ellipse cx="8" cy="40" rx="6" ry="3" fill={C.ink} />
      <ellipse cx="72" cy="40" rx="6" ry="3" fill={C.ink} />
      {/* primary feather lines */}
      <path d="M 14 38 L 26 40" stroke={C.foamDk} strokeWidth="0.8" />
      <path d="M 66 38 L 54 40" stroke={C.foamDk} strokeWidth="0.8" />
      {/* body */}
      <ellipse cx="40" cy="50" rx="12" ry="13" fill={C.cream} />
      {/* head */}
      <circle cx="40" cy="34" r="9" fill={C.cream} />
      {/* hooked yellow beak */}
      <path d="M 40 32 L 56 34 Q 58 42 50 42 Q 46 38 40 38 Z" fill={C.gold} />
      {/* eye */}
      <circle cx="38" cy="32" r="1.8" fill={C.ink} />
    </svg>
  );
}

// Toucan — outrageously massive curved colourful bill.
export function ToucanAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.cream} />
      {/* tiny dark body */}
      <ellipse cx="52" cy="56" rx="18" ry="13" fill={C.ink} />
      {/* chest patch */}
      <ellipse cx="44" cy="56" rx="10" ry="7" fill={C.gold} />
      {/* head */}
      <circle cx="40" cy="32" r="13" fill={C.ink} />
      {/* MASSIVE colourful curved bill */}
      <path d="M 30 30 Q 0 22 -2 38 Q 4 50 30 40 Z" fill={C.gold} />
      {/* red band on bill */}
      <path
        d="M 28 32 Q 8 30 -2 32"
        stroke={C.love}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* darker bill tip */}
      <path d="M -2 38 Q 2 36 6 38 L 4 42 Q 0 42 -2 38 Z" fill={C.goldDk} />
      {/* beak base ring */}
      <ellipse cx="28" cy="36" rx="2.5" ry="5" fill={C.ink} />
      {/* white eye patch */}
      <circle cx="42" cy="28" r="3.5" fill={C.foam} />
      <circle cx="42" cy="28" r="1.6" fill={C.ink} />
    </svg>
  );
}

// Hoopoe — fan crest + long curved bill + barred wings.
export function HoopoeAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.cream} />
      {/* body */}
      <ellipse cx="40" cy="50" rx="20" ry="16" fill={C.gold} />
      {/* BARRED wings */}
      <path
        d="M 44 44 L 64 44"
        stroke={C.ink}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 44 50 L 64 50"
        stroke={C.ink}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 44 56 L 64 56"
        stroke={C.ink}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 44 62 L 60 62"
        stroke={C.ink}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* head */}
      <circle cx="30" cy="36" r="10" fill={C.gold} />
      {/* FAN CREST — 5 plumes with black tips */}
      <path d="M 24 30 L 18 12 L 22 28 Z" fill={C.gold} />
      <path d="M 27 28 L 24 10 L 28 26 Z" fill={C.gold} />
      <path d="M 30 26 L 30 8 L 32 26 Z" fill={C.gold} />
      <path d="M 33 28 L 36 10 L 34 26 Z" fill={C.gold} />
      <path d="M 36 30 L 42 12 L 38 28 Z" fill={C.gold} />
      <circle cx="18" cy="12" r="2" fill={C.ink} />
      <circle cx="24" cy="10" r="2" fill={C.ink} />
      <circle cx="30" cy="8" r="2" fill={C.ink} />
      <circle cx="36" cy="10" r="2" fill={C.ink} />
      <circle cx="42" cy="12" r="2" fill={C.ink} />
      {/* long curved decurved bill */}
      <path
        d="M 22 38 Q 12 38 4 46"
        stroke={C.ink}
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* eye */}
      <circle cx="30" cy="34" r="1.8" fill={C.ink} />
    </svg>
  );
}

// Crane — long thin neck + red crown + long legs.
export function CraneAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.beige} />
      {/* long thin legs */}
      <path
        d="M 38 60 L 38 72"
        stroke={C.ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 48 60 L 48 72"
        stroke={C.ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* body */}
      <ellipse cx="44" cy="58" rx="16" ry="10" fill={C.cream} />
      {/* black wing tip */}
      <ellipse cx="58" cy="56" rx="7" ry="4" fill={C.ink} />
      {/* LONG THIN neck */}
      <path
        d="M 38 54 C 30 42, 26 28, 24 18"
        stroke={C.cream}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* head */}
      <circle cx="24" cy="18" r="6" fill={C.cream} />
      {/* RED CROWN patch */}
      <ellipse cx="24" cy="14" rx="5" ry="2.5" fill={C.love} />
      {/* long dagger beak */}
      <path d="M 18 18 L 6 16 L 18 22 Z" fill={C.gold} />
      {/* eye */}
      <circle cx="24" cy="18" r="1.2" fill={C.ink} />
    </svg>
  );
}

// Robin — RED bib wrapping the beak + brown back/cap.
export function RobinAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.cream} />
      {/* brown back body */}
      <ellipse cx="50" cy="50" rx="22" ry="20" fill={C.goldDk} />
      {/* brown tail */}
      <path d="M 62 52 L 74 54 L 66 60 Z" fill={C.goldDk} />
      {/* darker wing patch */}
      <ellipse cx="58" cy="50" rx="7" ry="11" fill={C.ink} opacity="0.2" />
      {/* RED bib — wraps the WHOLE face including the beak area */}
      <ellipse cx="28" cy="46" rx="20" ry="22" fill={C.loveBr} />
      {/* brown crown — only on top of head */}
      <path d="M 16 32 Q 28 22 40 28 Q 38 24 16 32 Z" fill={C.goldDk} />
      {/* short conical beak — DARK, protruding from the red */}
      <path d="M 10 44 L -2 42 L 10 48 Z" fill={C.ink} />
      {/* eye sits inside the red field */}
      <circle cx="24" cy="40" r="2.2" fill={C.ink} />
      <circle cx="25" cy="39" r="0.9" fill={C.cream} />
    </svg>
  );
}

// Goldfinch — red face mask + black + yellow wing.
export function GoldfinchAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.cream} />
      {/* yellow body */}
      <ellipse cx="40" cy="48" rx="20" ry="18" fill={C.gold} />
      {/* BLACK wing */}
      <ellipse cx="50" cy="50" rx="10" ry="13" fill={C.ink} />
      {/* YELLOW wing bar */}
      <ellipse cx="50" cy="50" rx="8" ry="2.5" fill={C.gold} />
      {/* black tail */}
      <path d="M 58 52 L 70 54 L 64 60 Z" fill={C.ink} />
      {/* black crown */}
      <path d="M 28 28 Q 36 20 44 26 Q 36 22 28 28 Z" fill={C.ink} />
      {/* head */}
      <circle cx="32" cy="32" r="11" fill={C.gold} />
      {/* RED face mask */}
      <path d="M 22 32 Q 26 24 34 28 Q 32 38 22 36 Z" fill={C.love} />
      {/* conical beak */}
      <path d="M 18 32 L 6 30 L 18 38 Z" fill={C.goldDk} />
      {/* eye */}
      <circle cx="30" cy="30" r="1.5" fill={C.ink} />
    </svg>
  );
}

/* ── Insects ────────────────────────────────────────────────────────── */

// Moth — triangular wings folded over body + feathery antennae + eye-spots.
export function MothAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.beige} />
      {/* triangular wings folded over body (roof shape) */}
      <path d="M 40 22 L 14 58 L 40 54 Z" fill={C.irisDk} />
      <path d="M 40 22 L 66 58 L 40 54 Z" fill={C.iris} />
      {/* wing veining */}
      <path
        d="M 40 26 L 22 52"
        stroke={C.ink}
        strokeWidth="0.8"
        opacity="0.5"
      />
      <path
        d="M 40 26 L 58 52"
        stroke={C.ink}
        strokeWidth="0.8"
        opacity="0.5"
      />
      {/* EYE-SPOTS */}
      <circle cx="22" cy="46" r="4" fill={C.gold} />
      <circle cx="22" cy="46" r="2" fill={C.ink} />
      <circle cx="58" cy="46" r="4" fill={C.gold} />
      <circle cx="58" cy="46" r="2" fill={C.ink} />
      {/* body */}
      <ellipse cx="40" cy="52" rx="3" ry="10" fill={C.ink} />
      {/* head */}
      <circle cx="40" cy="22" r="5" fill={C.ink} />
      {/* FEATHERY antennae */}
      <path
        d="M 37 20 L 28 10"
        stroke={C.ink}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 43 20 L 52 10"
        stroke={C.ink}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* feather barbs */}
      <path
        d="M 35 16 L 31 14 M 33 14 L 29 12 M 31 12 L 27 10"
        stroke={C.ink}
        strokeWidth="0.8"
      />
      <path
        d="M 45 16 L 49 14 M 47 14 L 51 12 M 49 12 L 53 10"
        stroke={C.ink}
        strokeWidth="0.8"
      />
    </svg>
  );
}

// Dragonfly — 4 transparent wings ATTACHED to body + slender body + huge eyes.
export function DragonflyAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.cream} />
      {/* 4 long narrow wings — inner edges anchored AT the body axis (x=40) */}
      <ellipse cx="24" cy="30" rx="18" ry="5" fill={C.foam} opacity="0.6" />
      <ellipse cx="56" cy="30" rx="18" ry="5" fill={C.foam} opacity="0.6" />
      <ellipse cx="24" cy="46" rx="16" ry="4" fill={C.iris} opacity="0.6" />
      <ellipse cx="56" cy="46" rx="16" ry="4" fill={C.iris} opacity="0.6" />
      {/* wing outlines for clarity */}
      <ellipse
        cx="24"
        cy="30"
        rx="18"
        ry="5"
        fill="none"
        stroke={C.foamDk}
        strokeWidth="0.7"
      />
      <ellipse
        cx="56"
        cy="30"
        rx="18"
        ry="5"
        fill="none"
        stroke={C.foamDk}
        strokeWidth="0.7"
      />
      <ellipse
        cx="24"
        cy="46"
        rx="16"
        ry="4"
        fill="none"
        stroke={C.irisDk}
        strokeWidth="0.7"
      />
      <ellipse
        cx="56"
        cy="46"
        rx="16"
        ry="4"
        fill="none"
        stroke={C.irisDk}
        strokeWidth="0.7"
      />
      {/* thorax — connects wings to body */}
      <ellipse cx="40" cy="38" rx="5" ry="6" fill={C.pineDk} />
      {/* long slender abdomen */}
      <ellipse cx="40" cy="52" rx="2.5" ry="18" fill={C.pine} />
      {/* body segments */}
      <path
        d="M 38 44 L 42 44 M 38 50 L 42 50 M 38 56 L 42 56 M 38 62 L 42 62"
        stroke={C.pineDk}
        strokeWidth="0.8"
      />
      {/* HUGE compound eyes nearly touching */}
      <circle cx="34" cy="22" r="6" fill={C.gold} />
      <circle cx="46" cy="22" r="6" fill={C.gold} />
      <circle cx="34" cy="22" r="3" fill={C.ink} />
      <circle cx="46" cy="22" r="3" fill={C.ink} />
      <circle cx="36" cy="20" r="1" fill={C.cream} />
      <circle cx="48" cy="20" r="1" fill={C.cream} />
    </svg>
  );
}

// Honeybee — yellow + black stripes + fuzzy body.
export function BeeAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.foam} />
      {/* wings */}
      <ellipse cx="22" cy="28" rx="13" ry="10" fill={C.cream} opacity="0.92" />
      <ellipse cx="58" cy="28" rx="13" ry="10" fill={C.cream} opacity="0.92" />
      <ellipse
        cx="22"
        cy="28"
        rx="13"
        ry="10"
        fill="none"
        stroke={C.foamDk}
        strokeWidth="1"
      />
      <ellipse
        cx="58"
        cy="28"
        rx="13"
        ry="10"
        fill="none"
        stroke={C.foamDk}
        strokeWidth="1"
      />
      {/* yellow body */}
      <ellipse cx="40" cy="48" rx="22" ry="18" fill={C.gold} />
      {/* HORIZONTAL black stripes */}
      <ellipse cx="40" cy="38" rx="20" ry="3" fill={C.ink} />
      <ellipse cx="40" cy="48" rx="22" ry="3" fill={C.ink} />
      <ellipse cx="40" cy="58" rx="18" ry="3" fill={C.ink} />
      {/* fuzzy texture dots */}
      <circle cx="22" cy="42" r="0.9" fill={C.goldDk} />
      <circle cx="26" cy="46" r="0.9" fill={C.goldDk} />
      <circle cx="58" cy="42" r="0.9" fill={C.goldDk} />
      <circle cx="54" cy="46" r="0.9" fill={C.goldDk} />
      {/* head */}
      <circle cx="40" cy="28" r="8" fill={C.ink} />
      <circle cx="36" cy="26" r="1.8" fill={C.gold} />
      <circle cx="44" cy="26" r="1.8" fill={C.gold} />
      {/* antennae */}
      <path
        d="M 36 22 Q 32 14 30 10"
        stroke={C.ink}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 44 22 Q 48 14 50 10"
        stroke={C.ink}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="30" cy="10" r="1.5" fill={C.ink} />
      <circle cx="50" cy="10" r="1.5" fill={C.ink} />
      {/* stinger */}
      <path d="M 40 66 L 38 70 L 42 70 Z" fill={C.ink} />
    </svg>
  );
}

// Beetle — domed elytra + center seam + clubbed antennae.
export function BeetleAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.beige} />
      {/* 6 legs behind body */}
      <path
        d="M 20 38 L 8 30 M 18 48 L 6 50 M 22 58 L 12 66"
        stroke={C.ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 60 38 L 72 30 M 62 48 L 74 50 M 58 58 L 68 66"
        stroke={C.ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* DOMED elytra body */}
      <ellipse cx="40" cy="48" rx="24" ry="22" fill={C.iris} />
      {/* gleam */}
      <ellipse cx="32" cy="40" rx="6" ry="10" fill={C.cream} opacity="0.3" />
      {/* CENTER SEAM */}
      <path d="M 40 30 L 40 68" stroke={C.ink} strokeWidth="2.5" />
      {/* pronotum */}
      <ellipse cx="40" cy="26" rx="11" ry="6" fill={C.irisDk} />
      {/* head */}
      <ellipse cx="40" cy="16" rx="7" ry="5" fill={C.ink} />
      {/* CLUBBED antennae */}
      <path
        d="M 35 12 L 28 6"
        stroke={C.ink}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M 45 12 L 52 6"
        stroke={C.ink}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <ellipse cx="27" cy="6" rx="2.4" ry="1.6" fill={C.ink} />
      <ellipse cx="53" cy="6" rx="2.4" ry="1.6" fill={C.ink} />
      {/* small eyes */}
      <circle cx="36" cy="15" r="0.9" fill={C.gold} />
      <circle cx="44" cy="15" r="0.9" fill={C.gold} />
    </svg>
  );
}

// Butterfly — symmetric ornate wings + clubbed antennae + thin body.
export function ButterflyAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.cream} />
      {/* upper wings */}
      <path d="M 38 38 Q 6 16 14 38 Q 18 48 38 44 Z" fill={C.love} />
      <path d="M 42 38 Q 74 16 66 38 Q 62 48 42 44 Z" fill={C.love} />
      {/* lower wings */}
      <path d="M 38 44 Q 16 56 22 68 Q 32 64 40 50 Z" fill={C.iris} />
      <path d="M 42 44 Q 64 56 58 68 Q 48 64 40 50 Z" fill={C.iris} />
      {/* upper wing eye-spots */}
      <circle cx="20" cy="32" r="4" fill={C.gold} />
      <circle cx="60" cy="32" r="4" fill={C.gold} />
      <circle cx="20" cy="32" r="1.8" fill={C.ink} />
      <circle cx="60" cy="32" r="1.8" fill={C.ink} />
      {/* lower wing dots */}
      <circle cx="26" cy="58" r="2.4" fill={C.cream} />
      <circle cx="54" cy="58" r="2.4" fill={C.cream} />
      {/* edge dots */}
      <circle cx="14" cy="38" r="1.4" fill={C.cream} />
      <circle cx="66" cy="38" r="1.4" fill={C.cream} />
      {/* thin body */}
      <ellipse cx="40" cy="44" rx="2" ry="16" fill={C.ink} />
      {/* head */}
      <circle cx="40" cy="28" r="3" fill={C.ink} />
      {/* CLUBBED antennae */}
      <path
        d="M 38 26 Q 32 18 28 12"
        stroke={C.ink}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 42 26 Q 48 18 52 12"
        stroke={C.ink}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="28" cy="12" r="1.8" fill={C.ink} />
      <circle cx="52" cy="12" r="1.8" fill={C.ink} />
    </svg>
  );
}

/* ── Other flyers ──────────────────────────────────────────────────── */

// Flying Fish — fish body + extended wing-like pectoral fins.
export function FlyingFishAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.foam} />
      {/* EXTENDED pectoral wing-fins */}
      <path d="M 30 38 L 6 14 L 18 36 Z" fill={C.cream} opacity="0.95" />
      <path d="M 50 38 L 74 14 L 62 36 Z" fill={C.cream} opacity="0.95" />
      <path d="M 30 50 L 6 70 L 18 50 Z" fill={C.cream} opacity="0.75" />
      <path d="M 50 50 L 74 70 L 62 50 Z" fill={C.cream} opacity="0.75" />
      {/* veining */}
      <path d="M 26 36 L 10 16" stroke={C.foamDk} strokeWidth="0.8" />
      <path d="M 54 36 L 70 16" stroke={C.foamDk} strokeWidth="0.8" />
      {/* torpedo fish body */}
      <ellipse cx="40" cy="44" rx="22" ry="11" fill={C.pine} />
      {/* belly highlight */}
      <ellipse cx="40" cy="50" rx="16" ry="3" fill={C.foam} opacity="0.65" />
      {/* tail */}
      <path d="M 60 44 L 76 36 L 70 44 L 76 52 Z" fill={C.pine} />
      {/* gill */}
      <path
        d="M 28 42 Q 26 44 28 48"
        stroke={C.pineDk}
        strokeWidth="1.5"
        fill="none"
      />
      {/* eye */}
      <circle cx="22" cy="42" r="3.5" fill={C.cream} />
      <circle cx="22" cy="42" r="1.8" fill={C.ink} />
      {/* mouth */}
      <path
        d="M 16 46 Q 14 48 16 50"
        stroke={C.pineDk}
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

// Bat — spread leathery wings + pointed ears + tiny body.
export function BatAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.iris} />
      {/* SPREAD leathery wings with scalloped edges */}
      <path
        d="M 6 38 Q 14 22 26 32 L 28 46 Q 24 50 16 48 Q 12 54 8 50 Q 4 52 6 46 Q 2 44 6 38 Z"
        fill={C.irisDk}
      />
      <path
        d="M 74 38 Q 66 22 54 32 L 52 46 Q 56 50 64 48 Q 68 54 72 50 Q 76 52 74 46 Q 78 44 74 38 Z"
        fill={C.irisDk}
      />
      {/* finger-bones */}
      <path
        d="M 26 36 L 10 26 M 28 40 L 8 38 M 28 44 L 12 50"
        stroke={C.iris}
        strokeWidth="1"
        opacity="0.65"
      />
      <path
        d="M 54 36 L 70 26 M 52 40 L 72 38 M 52 44 L 68 50"
        stroke={C.iris}
        strokeWidth="1"
        opacity="0.65"
      />
      {/* small body */}
      <ellipse cx="40" cy="46" rx="13" ry="16" fill={C.irisDk} />
      {/* POINTED ears */}
      <path d="M 28 28 L 24 12 L 34 24 Z" fill={C.irisDk} />
      <path d="M 52 28 L 56 12 L 46 24 Z" fill={C.irisDk} />
      <path d="M 28 26 L 26 18 L 32 24 Z" fill={C.rose} />
      <path d="M 52 26 L 54 18 L 48 24 Z" fill={C.rose} />
      {/* snout */}
      <ellipse cx="40" cy="44" rx="6" ry="5" fill={C.iris} />
      {/* glowing eyes */}
      <circle cx="34" cy="40" r="2.5" fill={C.gold} />
      <circle cx="46" cy="40" r="2.5" fill={C.gold} />
      <circle cx="34" cy="40" r="1.2" fill={C.ink} />
      <circle cx="46" cy="40" r="1.2" fill={C.ink} />
      {/* fangs */}
      <path d="M 36 48 L 38 54 L 40 48 Z" fill={C.cream} />
      <path d="M 40 48 L 42 54 L 44 48 Z" fill={C.cream} />
    </svg>
  );
}

// Pterosaur — long crested head + long leathery wings with finger-bone.
export function PterosaurAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.beige} />
      {/* leathery wings */}
      <path d="M 6 38 Q 16 22 32 32 L 34 50 Q 18 52 6 46 Z" fill={C.irisDk} />
      <path d="M 74 38 Q 64 22 48 32 L 46 50 Q 62 52 74 46 Z" fill={C.irisDk} />
      {/* finger-bone struts */}
      <path d="M 32 36 L 8 24" stroke={C.iris} strokeWidth="1.5" fill="none" />
      <path d="M 48 36 L 72 24" stroke={C.iris} strokeWidth="1.5" fill="none" />
      <path d="M 30 44 L 8 36" stroke={C.iris} strokeWidth="1" opacity="0.6" />
      <path d="M 50 44 L 72 36" stroke={C.iris} strokeWidth="1" opacity="0.6" />
      {/* body */}
      <ellipse cx="40" cy="44" rx="8" ry="10" fill={C.iris} />
      {/* long beak (left-pointing) */}
      <path d="M 32 30 L 10 24 L 22 36 Z" fill={C.iris} />
      {/* head */}
      <ellipse cx="34" cy="30" rx="8" ry="6" fill={C.iris} />
      {/* BACKWARD CREST (Pteranodon style) */}
      <path d="M 40 26 L 56 16 L 44 28 Z" fill={C.love} />
      <path
        d="M 40 28 L 56 20 Q 50 24 44 28"
        stroke={C.ink}
        strokeWidth="0.8"
        fill="none"
      />
      {/* tail */}
      <path d="M 46 52 L 56 66 L 50 56 Z" fill={C.iris} />
      {/* small teeth in beak */}
      <path
        d="M 22 30 L 20 32 M 18 30 L 16 32"
        stroke={C.cream}
        strokeWidth="0.8"
      />
      {/* eye */}
      <circle cx="30" cy="28" r="1.6" fill={C.ink} />
    </svg>
  );
}

/* ── Wildcards ─────────────────────────────────────────────────────── */

// Origami Crane — folded paper geometry + visible folds + crane shape.
export function OrigamiCraneAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.rose} />
      {/* central body — light side */}
      <path d="M 28 50 L 40 30 L 52 50 Z" fill={C.cream} />
      {/* central body — shadow side */}
      <path d="M 28 50 L 40 60 L 52 50 Z" fill={C.beige} />
      {/* left wing */}
      <path d="M 28 50 L 8 36 L 22 50 Z" fill={C.cream} />
      <path d="M 28 50 L 12 46 L 22 50 Z" fill={C.beige} />
      {/* right wing */}
      <path d="M 52 50 L 72 36 L 58 50 Z" fill={C.cream} />
      <path d="M 52 50 L 68 46 L 58 50 Z" fill={C.beige} />
      {/* neck/head triangle pointing up-left */}
      <path d="M 40 30 L 16 16 L 34 26 Z" fill={C.cream} />
      <path d="M 16 16 L 24 20 L 30 24 Z" fill={C.beige} />
      {/* tail pointing up-right */}
      <path d="M 40 30 L 64 16 L 46 26 Z" fill={C.cream} />
      <path d="M 64 16 L 56 20 L 50 24 Z" fill={C.beige} />
      {/* head tip — small fold */}
      <path d="M 16 16 L 12 12 L 20 18 Z" fill={C.beige} />
      {/* faint center fold */}
      <path
        d="M 40 30 L 40 60"
        stroke={C.love}
        strokeWidth="0.8"
        opacity="0.4"
      />
    </svg>
  );
}

// Paper Plane — dart silhouette + GOLD underside fold for high contrast.
export function PaperPlaneAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.pine} />
      {/* motion trails behind the plane */}
      <path
        d="M 14 56 Q 6 48 10 38"
        stroke={C.foam}
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M 20 62 Q 12 54 16 44"
        stroke={C.foam}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M 6 50 Q 0 44 4 34"
        stroke={C.foam}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* TOP wing — cream */}
      <path d="M 14 58 L 70 14 L 42 44 Z" fill={C.cream} />
      {/* UNDERSIDE fold — GOLD for high contrast against pine bg */}
      <path d="M 14 58 L 42 44 L 40 66 Z" fill={C.gold} />
      {/* bottom wing edge */}
      <path d="M 40 66 L 42 44 L 56 50 Z" fill={C.goldDk} />
      {/* sharp center crease */}
      <path d="M 70 14 L 40 66" stroke={C.pineDk} strokeWidth="2" />
      {/* top fold edge */}
      <path
        d="M 14 58 L 42 44"
        stroke={C.beige}
        strokeWidth="0.8"
        opacity="0.5"
      />
    </svg>
  );
}

/* ── Companions (non-flying residents kept from earlier rounds) ────── */

// Goose — Canada-goose style: S-curve black neck + chinstrap + beige body.
export function GooseAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.foam} />
      {/* beige body */}
      <ellipse cx="50" cy="56" rx="22" ry="14" fill={C.beige} />
      {/* darker wing shading */}
      <ellipse cx="58" cy="56" rx="10" ry="7" fill={C.goldDk} opacity="0.45" />
      {/* LONG S-curved BLACK neck */}
      <path
        d="M 42 56 C 30 46, 36 30, 24 22"
        stroke={C.ink}
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      {/* black head */}
      <circle cx="24" cy="20" r="8" fill={C.ink} />
      {/* WHITE CHINSTRAP */}
      <path
        d="M 16 22 Q 24 28 30 22"
        stroke={C.cream}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* short dark beak */}
      <path d="M 16 20 L 6 18 L 16 24 Z" fill={C.ink} />
      {/* eye */}
      <circle cx="26" cy="18" r="1.2" fill={C.cream} />
    </svg>
  );
}

// Crow — all black + chunky body + thick straight beak.
export function CrowAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.beige} />
      {/* tail */}
      <path d="M 56 56 L 70 60 L 64 64 L 70 68 L 56 62 Z" fill={C.ink} />
      {/* chunky body */}
      <ellipse cx="42" cy="48" rx="22" ry="22" fill={C.ink} />
      {/* iridescent wing shine */}
      <ellipse cx="50" cy="42" rx="9" ry="13" fill={C.iris} opacity="0.18" />
      {/* head */}
      <circle cx="32" cy="30" r="14" fill={C.ink} />
      {/* THICK STRAIGHT beak */}
      <path d="M 20 30 L 4 26 L 20 36 Z" fill={C.ink} />
      {/* beak undershadow for definition on dark bg */}
      <path
        d="M 20 30 L 4 26"
        stroke={C.beige}
        strokeWidth="0.6"
        opacity="0.35"
      />
      {/* sharp gold eye */}
      <circle cx="32" cy="28" r="3" fill={C.gold} />
      <circle cx="32" cy="28" r="1.5" fill={C.ink} />
    </svg>
  );
}

// Cat — triangular ears with pink inner + slit eyes + whiskers.
export function CatAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.iris} />
      {/* triangular ears */}
      <path d="M 16 30 L 22 10 L 32 22 Z" fill={C.iris} />
      <path d="M 64 30 L 58 10 L 48 22 Z" fill={C.iris} />
      {/* PINK inner ears */}
      <path d="M 21 24 L 23 14 L 28 22 Z" fill={C.rose} />
      <path d="M 59 24 L 57 14 L 52 22 Z" fill={C.rose} />
      {/* head */}
      <circle cx="40" cy="42" r="22" fill={C.iris} />
      {/* SLIT EYES — vertical pupils */}
      <ellipse cx="30" cy="40" rx="3.5" ry="7" fill={C.gold} />
      <ellipse cx="50" cy="40" rx="3.5" ry="7" fill={C.gold} />
      <ellipse cx="30" cy="40" rx="1.2" ry="6" fill={C.ink} />
      <ellipse cx="50" cy="40" rx="1.2" ry="6" fill={C.ink} />
      {/* pink triangular nose */}
      <path d="M 35 50 L 45 50 L 40 56 Z" fill={C.rose} />
      {/* mouth */}
      <path
        d="M 40 56 Q 36 60 32 58"
        stroke={C.ink}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 40 56 Q 44 60 48 58"
        stroke={C.ink}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      {/* WHISKERS */}
      <path
        d="M 28 52 L 14 50 M 28 55 L 14 56 M 28 58 L 14 62"
        stroke={C.ink}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M 52 52 L 66 50 M 52 55 L 66 56 M 52 58 L 66 62"
        stroke={C.ink}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

// Dog — floppy ears + pronounced snout + big nose.
export function DogAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.cream} />
      {/* FLOPPY ears — long ovals hanging down */}
      <ellipse cx="16" cy="42" rx="9" ry="20" fill={C.love} />
      <ellipse cx="64" cy="42" rx="9" ry="20" fill={C.love} />
      <ellipse cx="16" cy="42" rx="5" ry="15" fill={C.rose} opacity="0.55" />
      <ellipse cx="64" cy="42" rx="5" ry="15" fill={C.rose} opacity="0.55" />
      {/* head */}
      <circle cx="40" cy="40" r="22" fill={C.goldDk} />
      {/* SNOUT — pronounced muzzle */}
      <ellipse cx="40" cy="54" rx="16" ry="12" fill={C.beige} />
      {/* eye patches */}
      <ellipse cx="30" cy="36" rx="6" ry="5" fill={C.beige} />
      <ellipse cx="50" cy="36" rx="6" ry="5" fill={C.beige} />
      <circle cx="30" cy="36" r="2.6" fill={C.ink} />
      <circle cx="50" cy="36" r="2.6" fill={C.ink} />
      <circle cx="31" cy="35" r="0.8" fill={C.cream} />
      <circle cx="51" cy="35" r="0.8" fill={C.cream} />
      {/* BIG nose */}
      <ellipse cx="40" cy="48" rx="5" ry="4" fill={C.ink} />
      <ellipse cx="38" cy="47" rx="1.2" ry="0.8" fill={C.cream} opacity="0.6" />
      {/* mouth */}
      <path d="M 40 52 L 40 58" stroke={C.ink} strokeWidth="1.5" />
      <path
        d="M 40 58 Q 35 62 30 60"
        stroke={C.ink}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 40 58 Q 45 62 50 60"
        stroke={C.ink}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Horse — long face + mane tuft + muzzle + long ears.
export function HorseAvatar() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill={C.beige} />
      {/* LONG ears */}
      <path d="M 26 22 L 22 8 L 32 18 Z" fill={C.goldDk} />
      <path d="M 54 22 L 58 8 L 48 18 Z" fill={C.goldDk} />
      <path d="M 26 20 L 25 12 L 30 18 Z" fill={C.rose} />
      <path d="M 54 20 L 55 12 L 50 18 Z" fill={C.rose} />
      {/* MANE TUFT */}
      <path
        d="M 28 18 Q 36 8 40 14 Q 44 8 52 18 Q 48 26 40 22 Q 32 26 28 18 Z"
        fill={C.love}
      />
      {/* LONG FACE */}
      <ellipse cx="40" cy="46" rx="18" ry="26" fill={C.goldDk} />
      {/* face blaze */}
      <ellipse cx="40" cy="40" rx="3.5" ry="18" fill={C.cream} opacity="0.35" />
      {/* MUZZLE */}
      <ellipse cx="40" cy="60" rx="13" ry="10" fill={C.gold} />
      {/* eyes */}
      <ellipse cx="30" cy="42" rx="2.5" ry="3" fill={C.ink} />
      <ellipse cx="50" cy="42" rx="2.5" ry="3" fill={C.ink} />
      {/* nostrils */}
      <ellipse cx="36" cy="60" rx="2" ry="3" fill={C.ink} />
      <ellipse cx="44" cy="60" rx="2" ry="3" fill={C.ink} />
      {/* mouth */}
      <path
        d="M 32 68 Q 40 71 48 68"
        stroke={C.ink}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
