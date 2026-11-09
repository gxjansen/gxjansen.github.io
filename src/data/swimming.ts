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
  /** Record set with this swim, shown as a badge, e.g. "Dutch record". */
  record?: string;
  /** Relay teammates, in swimming order when known. */
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
    year: 2003,
    medal: "gold",
    event: "50m breaststroke",
    competition: "Dutch Sprint Championships",
    course: "short",
    time: "29.16",
    source:
      "https://web.archive.org/web/20030730132624/http://www.zwemkroniek.com:80/nieuws.php3?item=1935",
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
    record: "Dutch record",
    source:
      "https://web.archive.org/web/20030918091717/http://www.zwemkroniek.com:80/nieuws.php3?item=979",
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
    // Place from Guido; time from the all-time list (bronze was 1:04.57).
    year: 2000,
    place: 4,
    event: "100m breaststroke",
    competition: "European Junior Championships, Dunkirk",
    course: "long",
    time: "1:05.42",
    source:
      "https://web.archive.org/web/2024/https://www.zwemkroniek.com/eeuwige_ranglijst_schoolslag_lange_baan",
  },
  {
    // From Guido's medal list; teammates from Guido (AZ&PC), order unknown.
    year: 2000,
    medal: "gold",
    event: "4x200m freestyle relay",
    team: ["Patrick Martens", "Robin van Aggele", "Casper Tichelaar"],
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

export interface SwimRecord {
  /** Kind of record, e.g. "Dutch junior record". */
  title: string;
  event: string;
  course?: "short" | "long";
  time: string;
  /** Earlier record time in the same meet, e.g. the heats. */
  heatsTime?: string;
  competition: string;
  /** Month and year, as displayed, e.g. "December 2001". */
  date: string;
  team?: string[];
  club?: string;
  /** How often Guido improved this record. */
  timesImproved?: number;
  /** Year the record was broken. */
  heldUntil?: number;
  source: string;
}

export const swimmingRecords: SwimRecord[] = [
  {
    title: "Dutch record",
    event: "4x50m medley relay",
    course: "short",
    time: "1:38.36",
    heatsTime: "1:38.44",
    competition: "European Short Course Championships, Antwerp",
    date: "December 2001",
    team: ["Bastiaan Tamminga", "Ewout Holst", "Johan Kenkhuis"],
    heldUntil: 2003,
    source:
      "https://web.archive.org/web/20030918091717/http://www.zwemkroniek.com:80/nieuws.php3?item=979",
  },
  {
    title: "Dutch junior record",
    event: "50m breaststroke",
    course: "long",
    time: "29.29",
    competition: "European Junior Championships, Dunkirk",
    date: "July 2000",
    timesImproved: 5,
    heldUntil: 2003,
    source:
      "https://web.archive.org/web/20030803094945/http://zwemkroniek.com:80/nieuws.php3?item=2073",
  },
  {
    title: "Dutch youth record for club teams",
    event: "4x100m freestyle relay",
    time: "3:41.15",
    competition: "Amersfoort",
    date: "June 1999",
    team: ["Alex van Leendert", "Tim Peters", "Stefan Oosting"],
    club: "De Rijn Wageningen",
    heldUntil: 2002,
    source:
      "https://web.archive.org/web/20021224201803/http://www.zwemkroniek.com:80/nieuws.php3?item=1582",
  },
];
