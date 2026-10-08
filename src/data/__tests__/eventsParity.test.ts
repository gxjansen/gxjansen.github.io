/**
 * Parity between the atproto-derived /events data and the last hand-maintained
 * events.json (frozen as a fixture on 2026-09-30, the day of the switch).
 *
 * Every difference must be listed here on purpose. A new event added through
 * Sifa is fine; a changed or vanished old one fails the build.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import fixture from "./fixtures/events-2026-09-30.json";
import snapshot from "../events.snapshot.json";
import { eventsData } from "../events";
import { talksCount, countryCount } from "../siteStats";

type Fixture = (typeof fixture)[number];

// The later of two entries sharing an id is the one /events/[id]/ rendered;
// it keeps the slug, the earlier gets the day appended.
const lastIndex = new Map<string, number>();
fixture.forEach((e, i) => lastIndex.set(e.id, i));
const expectedId = (e: Fixture, i: number) =>
  lastIndex.get(e.id) === i ? e.id : `${e.id}-${e.date.slice(8, 10)}`;

/**
 * Deliberate data fixes and "Sifa title wins" topics (Guido, 2026-09-30).
 * Roles shortened 2026-10-08 now that cards show non-speaker roles.
 */
const EXPECTED: Record<string, Partial<Record<keyof Fixture, unknown>>> = {
  "contentsquare-champaigne-breakfast-2020-07": {
    name: "Contentsquare Champagne breakfast",
  },
  "ddma-dutch-cro-awards-2019-09": { city: "Amsterdam" },
  "joomladays-netherlands-2009-12": { date: "2009-06-12" },
  // Online event: no invented country.
  "lets-talk-business-2019-04": { country: "" },
  "iosp-2026": { topic: "ATScience afternoon", role: "ATScience team" },
  "space-academy-2026": {
    topic: "Unconference session: Sifa ID",
    role: "Advisor & Podcast host",
  },
  "atmosphereconf-2026": {
    // Linked to the organizer's calendar event on 2026-10-08.
    name: "ATmosphereConf 2026",
    date: "2026-03-26",
    url: "https://atmosphereconf.org",
    topic: "Unconference session on Sifa",
    role: "Speaker",
    icon: "atmosphereconf.png",
  },
};
for (const id of [
  "meet-magento-nl-2019-2019-04",
  ...[2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010].map(
    (y) => `meet-magento-the-netherlands-${y}-0${y === 2018 ? 6 : 5}`,
  ),
  "meet-magento-the-netherlands-2009-01",
])
  EXPECTED[id] = { topic: "Meet Magento NL Opening Keynote" };

/** Entries that exist only in the records (added via Sifa). */
const ADDED = new Set([
  "spryker-excite-2024-09",
  "atmosphereconf-2027",
  "rebuild-2-2026-09",
]);

const byId = new Map(eventsData.map((e) => [e.id, e]));

describe("events derived from atproto records", () => {
  it("keeps every old entry at its URL, plus only known additions", () => {
    const expected = new Set(fixture.map(expectedId));
    const actual = new Set(eventsData.map((e) => e.id));
    expect([...expected].filter((id) => !actual.has(id))).toEqual([]);
    expect(
      [...actual].filter((id) => !expected.has(id) && !ADDED.has(id)),
    ).toEqual([]);
  });

  it("has unique slugs", () => {
    expect(new Set(eventsData.map((e) => e.id)).size).toBe(eventsData.length);
  });

  it("matches the old data field by field, except listed changes", () => {
    const mismatches: string[] = [];
    fixture.forEach((e, i) => {
      const id = expectedId(e, i);
      const got = byId.get(id);
      if (!got) return;
      const want: Record<string, unknown> = {
        name: e.name,
        date: e.date,
        url: e.url,
        city: e.city,
        country: e.country,
        topic: e.topic,
        role: e.role,
        workshop: e.workshop,
        icon: e.icon || undefined,
        relatedPresentationSlugs: e.relatedPresentationSlugs ?? [],
        ...EXPECTED[id],
      };
      for (const [k, v] of Object.entries(want)) {
        const g = (got as unknown as Record<string, unknown>)[k];
        if (JSON.stringify(g) !== JSON.stringify(v))
          mismatches.push(
            `${id}.${k}: ${JSON.stringify(v)} -> ${JSON.stringify(g)}`,
          );
      }
    });
    expect(mismatches).toEqual([]);
  });

  it("keeps same-date events apart (merge only on exact event URI)", () => {
    for (const [a, b] of [
      ["orocrm-meetup-2012-05", "ism-ecommerce-crosschannel-event-2012-05"],
      ["crocafe-unconference-2-2019-10", "digital-analytics-congres-2019-10"],
      ["meet-magento-denmark-2015-05", "meet-magento-germany-2015-05"],
      ["emerce-b2b-2022-05", "emerce-b2b-dinner-session-2022-05"],
    ]) {
      expect(byId.has(a), a).toBe(true);
      expect(byId.has(b), b).toBe(true);
    }
  });

  it("only uses role-bearing records, never RSVPs", () => {
    const deliveryUris = new Set(snapshot.deliveries.map((d) => d.uri));
    const projectEventUris = new Set(
      snapshot.projects.flatMap((p) =>
        (
          (p.value as { events?: { event: { uri: string } }[] }).events ?? []
        ).map((pe) => pe.event.uri),
      ),
    );
    for (const e of eventsData) {
      expect(
        deliveryUris.has(e.key) || projectEventUris.has(e.key),
        `${e.id} (${e.key})`,
      ).toBe(true);
      expect(e.key).not.toContain("community.lexicon.calendar.rsvp");
    }
  });

  it("keeps the headline numbers", () => {
    expect(talksCount).toBe(fixture.length + ADDED.size);
    expect(countryCount).toBe(28);
    expect(eventsData.some((e) => e.country === "IN")).toBe(true);
  });
});

describe("no code reads events.json anymore", () => {
  it("has no import of data/events.json outside this fixture", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) {
          if (name !== "fixtures" && name !== "node_modules") walk(p);
        } else if (
          /\.(ts|tsx|js|mjs|astro)$/.test(name) &&
          !p.endsWith("eventsParity.test.ts")
        ) {
          if (
            /from\s+["'][^"']*\/events\.json["']/.test(readFileSync(p, "utf-8"))
          )
            offenders.push(p);
        }
      }
    };
    walk(join(process.cwd(), "src"));
    expect(offenders).toEqual([]);
  });
});
