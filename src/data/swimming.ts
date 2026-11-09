/**
 * Competitive swimming results for /awards: senior gold medals and
 * international finals, plus youth (age-group) gold medals. No silver or bronze. Add a
 * source URL when a public source exists (Zwemkroniek, KNZB, Swimming World);
 * rows without one come from Guido's own medal list. Clubs: De Rijn, AZ&PC
 * (Amersfoort) until September 2003, then XLence Swimteam.
 */

export type SwimMedal = "gold" | "silver" | "bronze";

export interface SwimResult {
  /** Year of the championship. */
  year: number;
  medal?: SwimMedal;
  /** Final place when there was no medal, e.g. 4. */
  place?: number;
  /** Relay teammates, in swimming order. */
  team?: string[];
  /** Event, e.g. "50m breaststroke". */
  event: string;
  /** Championship, e.g. "Dutch Championships". */
  competition: string;
  /** "short" = 25m pool, "long" = 50m pool; omit when unknown. */
  course?: "short" | "long";
  /** Age group for youth titles, e.g. "boys born 1982". Omit for senior. */
  ageGroup?: string;
  /** Final time as swum, e.g. "28.69" or "1:05.42". */
  time?: string;
  source?: string;
}

export const swimmingResults: SwimResult[] = [
  {
    // From Guido's medal list; no public source found yet.
    year: 2003,
    medal: "gold",
    event: "50m breaststroke",
    competition: "Dutch Sprint Championships",
    course: "short",
  },
  {
    year: 2002,
    medal: "gold",
    event: "50m breaststroke",
    competition: "Dutch Championships",
    course: "long",
    time: "29.11",
    source:
      "https://www.swimmingworldmagazine.com/news/tamminga-sets-national-mark-at-dutch-nationals/",
  },
  {
    // From Guido's medal list; no public source found yet.
    year: 2002,
    medal: "gold",
    event: "100m medley",
    competition: "Dutch Sprint Championships",
    course: "short",
  },
  {
    year: 2001,
    place: 6,
    event: "4x50m medley relay (Netherlands), breaststroke leg",
    team: ["Bastiaan Tamminga", "Ewout Holst", "Johan Kenkhuis"],
    competition: "European Short Course Championships, Antwerp",
    course: "short",
    time: "1:38.36",
    source:
      "https://www.sportuitslagen.org/zwemmen-ek-korte-baan-25m-uitslagen-2001-heren-epm30024.html",
  },
  {
    year: 2001,
    medal: "gold",
    event: "50m breaststroke",
    competition: "Dutch Championships",
    course: "short",
    time: "28.99",
    source:
      "https://web.archive.org/web/2023/http://test.zwemkroniek.com/documenten/voorbeschouwingnkkbamsterdam05dag3.pdf",
  },
  {
    year: 2001,
    medal: "gold",
    event: "50m breaststroke",
    competition: "Dutch Championships",
    course: "long",
    time: "29.43",
    source:
      "https://www.swimmingworldmagazine.com/news/inky-posts-world-leading-50m-fly-at-dutch-nationals/",
  },
  {
    year: 2000,
    medal: "gold",
    event: "50m breaststroke",
    competition: "Dutch Championships",
    course: "short",
    time: "28.69",
    source:
      "https://web.archive.org/web/2023/http://test.zwemkroniek.com/documenten/voorbeschouwingnkkbamsterdam05dag3.pdf",
  },
  {
    // Place from Guido; no public source found for places 4-8.
    year: 2000,
    place: 4,
    event: "50m breaststroke",
    competition: "European Junior Championships, Dunkirk",
    course: "long",
  },
  {
    // From Guido's medal list; club unclear (AZ&PC or De Rijn).
    year: 2000,
    medal: "gold",
    event: "4x200m freestyle relay",
    competition: "Dutch Championships",
    course: "short",
  },
  // Youth titles, from Guido's medal list.
  {
    year: 2000,
    medal: "gold",
    event: "50m breaststroke",
    competition: "Dutch Championships",
    course: "long",
    ageGroup: "boys born 1982 and later",
  },
  {
    year: 2000,
    medal: "gold",
    event: "100m medley",
    competition: "Dutch Sprint Championships",
    course: "short",
    ageGroup: "boys born 1982/83",
  },
  {
    year: 1999,
    medal: "gold",
    event: "50m breaststroke",
    competition: "Dutch Sprint Championships",
    course: "short",
    ageGroup: "boys born 1980-82",
  },
  {
    year: 1999,
    medal: "gold",
    event: "50m breaststroke",
    competition: "Dutch Winter Championships",
    ageGroup: "youth",
  },
  {
    year: 1998,
    medal: "gold",
    event: "100m breaststroke",
    competition: "Dutch Championships",
    course: "long",
    ageGroup: "boys born 1982",
  },
  {
    year: 1998,
    medal: "gold",
    event: "100m breaststroke",
    competition: "Dutch Winter Championships",
    ageGroup: "boys born 1982",
  },
  {
    year: 1997,
    medal: "gold",
    event: "100m breaststroke",
    competition: "Dutch Championships",
    course: "long",
    ageGroup: "boys born 1982",
  },
  {
    year: 1993,
    medal: "gold",
    event: "100m breaststroke",
    competition: "Speedo Finals",
    ageGroup: "boys born 1982",
    time: "1:25.2",
  },
];
