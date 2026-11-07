/**
 * Competitive swimming results for /awards. Only results confirmed by a
 * public source (Zwemkroniek, KNZB, Swimming World) or by Guido; add the source URL so they
 * stay checkable. Swum for AZ&PC (Amersfoort).
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
  /** "short" = 25m pool, "long" = 50m pool. */
  course: "short" | "long";
  /** Final time as swum, e.g. "28.69" or "1:05.42". */
  time?: string;
  source?: string;
}

export const swimmingResults: SwimResult[] = [
  {
    year: 2003,
    medal: "silver",
    event: "50m breaststroke",
    competition: "Dutch Championships",
    course: "long",
    time: "29.68",
    source:
      "https://www.swimmingworldmagazine.com/news/inge-de-bruijn-thijs-van-valekengoed-sparkle-on-final-two-days-of-dutch-champs/",
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
    year: 2002,
    medal: "bronze",
    event: "4x100m freestyle relay (AZ&PC)",
    competition: "Dutch Championships",
    course: "long",
    time: "3:29.34",
    source:
      "https://www.swimmingworldmagazine.com/news/a-tie-in-the-womens-50-free-as-dutch-nationals-end/",
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
    year: 2000,
    event: "100m breaststroke",
    competition: "European Junior Championships, Dunkirk",
    course: "long",
    time: "1:05.42",
    source:
      "https://web.archive.org/web/2024/https://www.zwemkroniek.com/eeuwige_ranglijst_schoolslag_lange_baan",
  },
];
