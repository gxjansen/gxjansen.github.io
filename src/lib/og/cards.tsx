/* =====================================================================
   gui.do OpenGraph share cards — Satori JSX.
   ---------------------------------------------------------------------
   Seven card types, one shared chrome (corner-wash · accent bloom ·
   accent bar · byline lockup · one hand-note). Authored at native
   1200×630. Ported from the design handoff (OpenGraph cards.html) with
   structure + copy lifted verbatim; the Satori-incompatible CSS
   (color-mix, CSS vars, empty flex spacers) is flattened to the rules in
   src/lib/og/tokens.ts.

   Satori notes baked into this file:
   - Every multi-child container carries explicit display:'flex'.
   - The byline is pinned to the bottom by a header/middle/footer column
     where the middle row owns flexGrow:1 + minHeight:0 (empty flex
     spacers collapse in Satori, so we never rely on them).
   - radial-gradient backgrounds (wash + bloom) are passed via
     backgroundImage; Satori 0.26 rasterizes them. The accent bar is a
     solid 10px div.
   - Inline <svg><path> icons are copied from the handoff verbatim.
   ===================================================================== */
import * as React from "react";
import {
  COLORS,
  ACCENTS,
  BRAND,
  FONTS,
  chipColors,
  bloomGradient,
  WASH_GRADIENT,
  type AccentName,
} from "./tokens";
import { AVATAR_DATA_URI } from "./assets";

const PX = (rem: number) => Math.round(rem * 16); // 1rem = 16px at native scale

/* --------------------------------------------------------------- icons */

type IconProps = { size?: number; strokeWidth?: number };

const stroke = (sw = 2) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth: sw,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

const CalendarIcon = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M4 11h16" />
  </svg>
);

const MicIcon = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <path d="M8 21l8 0" />
    <path d="M12 17l0 4" />
  </svg>
);

const ShieldCheckIcon = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M9 12l2 2l4 -4" />
    <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
  </svg>
);

const CapIcon = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" />
    <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" />
  </svg>
);

const GlobeIcon = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M12 21a9 9 0 1 0 0 -18a9 9 0 0 0 0 18" />
    <path d="M3.6 9h16.8" />
    <path d="M3.6 15h16.8" />
    <path d="M11.5 3a17 17 0 0 0 0 18" />
    <path d="M12.5 3a17 17 0 0 1 0 18" />
  </svg>
);

const ArrowIcon = ({ size = 22 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke(2.2)}>
    <path d="M5 12l14 0" />
    <path d="M13 18l6 -6" />
    <path d="M13 6l6 6" />
  </svg>
);

const BooksIcon = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke()}>
    <path d="M5 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
    <path d="M9 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
    <path d="M5 8h4" />
    <path d="M9 16h4" />
    <path d="M14 5.5l2.5 -.5l3 14l-2.5 .5z" />
  </svg>
);

/* --------------------------------------------------------- shared bits */

const FONT_DISPLAY = `"${FONTS.display}"`;
const FONT_BODY = `"${FONTS.body}"`;
const FONT_HAND = `"${FONTS.hand}"`;

/** The card frame: bg + corner-wash + accent bloom + accent bar + padded
 *  inner column. Children are header / middle / footer rows. */
function Frame({
  accent,
  children,
  paddingTop = 74,
}: {
  accent: string;
  children: React.ReactNode;
  paddingTop?: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: 1200,
        height: 630,
        overflow: "hidden",
        backgroundColor: COLORS.bg,
        color: COLORS.fg,
        fontFamily: FONT_BODY,
      }}
    >
      {/* corner-wash */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          display: "flex",
          backgroundImage: WASH_GRADIENT,
        }}
      />
      {/* accent bloom */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          display: "flex",
          backgroundImage: bloomGradient(accent),
        }}
      />
      {/* accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 10,
          height: 630,
          display: "flex",
          backgroundColor: accent,
        }}
      />
      {/* inner column */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: 1200,
          height: 630,
          padding: `${paddingTop}px 80px 64px 84px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** A growing middle row that pushes the footer to the bottom edge.
 *  flexGrow + minHeight:0 instead of an empty spacer (which collapses). */
function Middle({
  children,
  justify = "center",
}: {
  children: React.ReactNode;
  justify?: "center" | "flex-end" | "flex-start";
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
        justifyContent: justify,
      }}
    >
      {children}
    </div>
  );
}

/** A tonal pill (mono-ish eyebrow) with optional leading icon. */
function Pill({
  accent,
  icon,
  children,
}: {
  accent: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const c = chipColors(accent);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        // body 700 stands in for the mono pill at OG scale (no mono font)
        fontFamily: FONT_BODY,
        fontWeight: 700,
        fontSize: PX(1.05),
        letterSpacing: "0.01em",
        color: c.text,
        backgroundColor: c.fill,
        border: `1px solid ${c.border}`,
        padding: "8px 18px",
        borderRadius: 999,
      }}
    >
      {icon}
      <span style={{ display: "flex" }}>{children}</span>
    </div>
  );
}

function Chip({ accent, children }: { accent: string; children: string }) {
  const c = chipColors(accent);
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT_BODY,
        fontWeight: 700,
        fontSize: PX(1.02),
        color: c.text,
        backgroundColor: c.fill,
        padding: "7px 17px",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}

/** A single hand-note line (LiebeHeide, rotated, accent colored). */
function Hand({
  children,
  color,
  rotate = -3,
  size = 2.05,
}: {
  children: React.ReactNode;
  color: string;
  rotate?: number;
  size?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: FONT_HAND,
        fontSize: PX(size),
        lineHeight: 1,
        color,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </div>
  );
}

function Title({
  children,
  size = 4.4,
  lineHeight = 1.02,
}: {
  children: React.ReactNode;
  size?: number;
  lineHeight?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT_DISPLAY,
        fontWeight: 900,
        color: COLORS.fgStrong,
        letterSpacing: "-0.035em",
        lineHeight,
        fontSize: PX(size),
      }}
    >
      {children}
    </div>
  );
}

function Lead({
  children,
  marginTop = 18,
}: {
  children: string;
  marginTop?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT_BODY,
        fontWeight: 400,
        fontSize: PX(1.62),
        lineHeight: 1.45,
        color: COLORS.fgSubtle,
        maxWidth: 760,
        marginTop,
      }}
    >
      {children}
    </div>
  );
}

/** gui.do wordmark with a pine dot. */
function Wordmark({ size }: { size: number }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT_DISPLAY,
        fontWeight: 900,
        letterSpacing: "-0.035em",
        lineHeight: 1,
        fontSize: size,
        color: COLORS.fgStrong,
      }}
    >
      <span style={{ display: "flex" }}>gui</span>
      <span style={{ display: "flex", color: BRAND, fontSize: size * 1.12 }}>
        .
      </span>
      <span style={{ display: "flex" }}>do</span>
    </div>
  );
}

function Avatar({ size, ring }: { size: number; ring: number }) {
  return (
    <img
      src={AVATAR_DATA_URI}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: COLORS.overlay,
        objectFit: "cover",
        // gold ring via boxShadow (not baked into the PNG)
        boxShadow: `0 0 0 ${ring}px ${COLORS.goldRing}`,
        flexShrink: 0,
      }}
    />
  );
}

/** The byline lockup row: avatar + wordmark/who + optional trailing slot. */
function Byline({
  who,
  trailing,
}: {
  who: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        paddingTop: 30,
        borderTop: `1px solid ${COLORS.border}`,
      }}
    >
      <Avatar size={64} ring={3} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Wordmark size={PX(1.7)} />
        <div
          style={{
            display: "flex",
            fontFamily: FONT_BODY,
            fontSize: PX(1.02),
            color: COLORS.fgMuted,
          }}
        >
          {who}
        </div>
      </div>
      {trailing ? (
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {trailing}
        </div>
      ) : null}
    </div>
  );
}

/** "Enquire →" / "Book a session →" read-more affordance. */
function ReadMore({ accent, children }: { accent: string; children: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontFamily: FONT_BODY,
        fontWeight: 700,
        fontSize: PX(1.18),
        color: accent,
      }}
    >
      <span style={{ display: "flex" }}>{children}</span>
      <ArrowIcon size={22} />
    </div>
  );
}

/** An eyebrow row: a pill on the left, a hand-note pushed to the right. */
function EyebrowRow({
  pill,
  hand,
}: {
  pill: React.ReactNode;
  hand: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      {pill}
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
      >
        {hand}
      </div>
    </div>
  );
}

/* ================================================================= cards */

export type ArticleData = {
  title: string;
  lead?: string;
  chips?: string[]; // max 2
  kicker?: string; // hand-note, default "field notes"
  readTime?: string; // "8 min read"
  accent?: AccentName; // per-article accent
};

export type TalkData = {
  title: string;
  duration?: string; // "45 min"
  isWorkshop?: boolean;
  countries: string;
  talks: string;
};

export type LandingData = {
  url: string; // "gui.do/events"
  title: string;
  lead?: string;
  hand?: string; // "come say hi"
  whoExtra?: string; // "27 countries, 188 events"
};

export type FallbackData = {
  h1: string;
  lead?: string;
  section?: string; // hand-note
};

export type HomeData = {
  years: string; // "21+ years"
  countries: string; // "27 countries"
};

/* 1 · Homepage / brand --------------------------------------------------- */
export function HomeCard({ years, countries }: HomeData) {
  const accent = ACCENTS.pine;
  return (
    <Frame accent={accent} paddingTop={70}>
      {/* header: big avatar + wordmark + hand */}
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <Avatar size={118} ring={5} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Wordmark size={PX(3.4)} />
          <Hand color={accent} rotate={-2}>
            <span style={{ display: "flex" }}>Hi, I&apos;m Guido</span>
            <span style={{ display: "flex" }}>👋</span>
          </Hand>
        </div>
      </div>

      <Middle justify="center">
        <Title size={4.7}>I build community functions for tech products.</Title>
        <Lead>Community, experimentation, AI &amp; open social tech.</Lead>
      </Middle>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingTop: 30,
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: FONT_BODY,
            fontSize: PX(1.02),
            color: COLORS.fgMuted,
          }}
        >
          {`Guido X Jansen · ${years} · ${countries}`}
        </div>
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 8,
            fontFamily: FONT_BODY,
            fontSize: PX(0.92),
            color: COLORS.fgMuted,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 9,
              height: 9,
              borderRadius: 9,
              backgroundColor: ACCENTS.foam,
              boxShadow: `0 0 0 4px ${chipColors(ACCENTS.foam).border}`,
            }}
          />
          <span style={{ display: "flex" }}>live on AT Protocol</span>
        </div>
      </div>
    </Frame>
  );
}

/* 2 · Article / writing -------------------------------------------------- */
export function ArticleCard({
  title,
  lead,
  chips = [],
  kicker = "field notes",
  readTime,
  accent = "iris",
}: ArticleData) {
  const ac = ACCENTS[accent];
  return (
    <Frame accent={ac}>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {chips.slice(0, 2).map((c) => (
            <Chip key={c} accent={ac}>
              {c}
            </Chip>
          ))}
        </div>
        <div
          style={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}
        >
          <Hand color={ac}>
            <span style={{ display: "flex" }}>{kicker}</span>
          </Hand>
        </div>
      </div>

      <Middle justify="center">
        <Title size={3.55} lineHeight={1.04}>
          {title}
        </Title>
        {lead ? <Lead>{lead}</Lead> : null}
      </Middle>

      <Byline
        who="Guido X Jansen"
        trailing={
          readTime ? (
            <Hand color={COLORS.fgMuted} rotate={-2} size={1.7}>
              <span style={{ display: "flex" }}>{readTime}</span>
            </Hand>
          ) : undefined
        }
      />
    </Frame>
  );
}

/* 3 · Landing page ------------------------------------------------------- */
export function LandingCard({
  url,
  title,
  lead,
  hand = "come say hi",
  whoExtra,
}: LandingData) {
  const ac = ACCENTS.foam;
  return (
    <Frame accent={ac}>
      <EyebrowRow
        pill={
          <Pill accent={ac} icon={<CalendarIcon />}>
            {url}
          </Pill>
        }
        hand={
          <Hand color={ac}>
            <span style={{ display: "flex" }}>{hand}</span>
          </Hand>
        }
      />

      <Middle justify="center">
        <Title>{title}</Title>
        {lead ? <Lead>{lead}</Lead> : null}
      </Middle>

      <Byline who={`Guido X Jansen${whoExtra ? ` · ${whoExtra}` : ""}`} />
    </Frame>
  );
}

/* 4 · Talk / speaking ---------------------------------------------------- */
export function TalkCard({
  title,
  duration,
  isWorkshop,
  countries,
  talks,
}: TalkData) {
  const ac = ACCENTS.gold;
  const kind = isWorkshop ? "Workshop" : "Keynote";
  const pillText = duration ? `${kind} · ${duration}` : kind;
  return (
    <Frame accent={ac}>
      <EyebrowRow
        pill={
          <Pill accent={ac} icon={<MicIcon />}>
            {pillText}
          </Pill>
        }
        hand={
          <Hand color={ac}>
            <span style={{ display: "flex" }}>{`${countries} · ${talks}`}</span>
          </Hand>
        }
      />

      <Middle justify="center">
        <Title>{title}</Title>
      </Middle>

      <Byline who="Guido X Jansen · keynote & workshop" />
    </Frame>
  );
}

/* 5 · Retainer ----------------------------------------------------------- */
export function RetainerCard() {
  const ac = ACCENTS.love;
  return (
    <Frame accent={ac}>
      <EyebrowRow
        pill={
          <Pill accent={ac} icon={<ShieldCheckIcon />}>
            Work with me · Retainer
          </Pill>
        }
        hand={
          <Hand color={ac}>
            <span style={{ display: "flex" }}>now booking</span>
          </Hand>
        }
      />

      <Middle justify="center">
        <Title>Fractional community &amp; experimentation leadership</Title>
        <Lead>
          Embedded with your team to build the function, not advise on it from
          the outside.
        </Lead>
      </Middle>

      <Byline
        who="Guido X Jansen"
        trailing={<ReadMore accent={ac}>Enquire</ReadMore>}
      />
    </Frame>
  );
}

/* 6 · Training ----------------------------------------------------------- */
export function TrainingCard() {
  const ac = ACCENTS.rose;
  return (
    <Frame accent={ac}>
      <EyebrowRow
        pill={
          <Pill accent={ac} icon={<CapIcon />}>
            Work with me · Training
          </Pill>
        }
        hand={
          <Hand color={ac}>
            <span style={{ display: "flex" }}>in-person or remote</span>
          </Hand>
        }
      />

      <Middle justify="center">
        <Title>Hands-on workshops, built around your team</Title>
        <Lead>
          Practical sessions your team applies the same week. No slideware.
        </Lead>
      </Middle>

      <Byline
        who="Guido X Jansen"
        trailing={<ReadMore accent={ac}>Book a session</ReadMore>}
      />
    </Frame>
  );
}

/* 7 · Fallback / default ------------------------------------------------- */
export function FallbackCard({
  h1,
  lead,
  section = "on gui.do",
}: FallbackData) {
  const ac = ACCENTS.pine;
  return (
    <Frame accent={ac}>
      <EyebrowRow
        pill={
          <Pill accent={ac} icon={<GlobeIcon />}>
            gui.do
          </Pill>
        }
        hand={
          <Hand color={ac}>
            <span style={{ display: "flex" }}>{section}</span>
          </Hand>
        }
      />

      <Middle justify="center">
        <Title>{h1}</Title>
        {lead ? <Lead>{lead}</Lead> : null}
      </Middle>

      <Byline who="Guido X Jansen" />
    </Frame>
  );
}

/* 8 · Bookshelf ---------------------------------------------------------- */

/** A row of book spines (the shelf motif) in the cover-grid accent palette. */
const SPINES: { c: string; h: number; w: number }[] = [
  { c: ACCENTS.pine, h: 128, w: 44 },
  { c: ACCENTS.gold, h: 150, w: 48 },
  { c: ACCENTS.iris, h: 116, w: 42 },
  { c: ACCENTS.love, h: 142, w: 46 },
  { c: ACCENTS.foam, h: 124, w: 50 },
  { c: ACCENTS.rose, h: 150, w: 44 },
  { c: ACCENTS.pine, h: 112, w: 46 },
  { c: ACCENTS.gold, h: 136, w: 42 },
  { c: ACCENTS.iris, h: 126, w: 48 },
  { c: ACCENTS.foam, h: 146, w: 44 },
  { c: ACCENTS.love, h: 118, w: 46 },
];

function Shelf() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 11,
        height: 156,
        marginBottom: 26,
      }}
    >
      {SPINES.map((s, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: s.w,
            height: s.h,
            paddingTop: 18,
            backgroundColor: s.c,
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
        >
          {/* faint "title band" so the spines read as books */}
          <div
            style={{
              display: "flex",
              width: "58%",
              height: 5,
              borderRadius: 3,
              backgroundColor: "rgba(25,23,36,0.30)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function BookshelfCard() {
  const ac = ACCENTS.gold;
  return (
    <Frame accent={ac} paddingTop={64}>
      <EyebrowRow
        pill={
          <Pill accent={ac} icon={<BooksIcon />}>
            gui.do/bookshelf
          </Pill>
        }
        hand={
          <Hand color={ac} size={1.85}>
            <span style={{ display: "flex" }}>
              structured streams of thoughts
            </span>
          </Hand>
        }
      />

      <Middle justify="center">
        <Title size={3.4}>What I&apos;m reading &amp; want to read next</Title>
        <Lead>
          Reading now, the to-read pile, and recently finished. Pulled live from
          Bookhive.
        </Lead>
      </Middle>

      <Shelf />

      <Byline who="Guido X Jansen · my reading shelf" />
    </Frame>
  );
}
