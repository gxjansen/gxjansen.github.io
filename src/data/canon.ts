/**
 * Data for /canon (https://slashpages.net): the books, people and screen
 * stuff that shaped how Guido thinks. Names only for now; a `why` per item
 * can be added later.
 */

export interface CanonItem {
  name: string;
  /** Author, creator or year, shown after the name. */
  by?: string;
  why?: string;
}

export interface CanonGroup {
  name: string;
  items: CanonItem[];
}

export const canon: CanonGroup[] = [
  {
    name: "Books",
    items: [
      { name: "Bobiverse", by: "Dennis E. Taylor" },
      { name: "The Expanse", by: "James S.A. Corey" },
      { name: "The Three-Body Problem", by: "Liu Cixin" },
      { name: "Made to Stick", by: "Chip Heath and Dan Heath" },
      { name: "Influence", by: "Robert Cialdini" },
      { name: "The God Delusion", by: "Richard Dawkins" },
      { name: "The Culture Map", by: "Erin Meyer" },
      { name: "Off to Be the Wizard", by: "Scott Meyer" },
      {
        name: "Algorithms to Live By",
        by: "Brian Christian and Tom Griffiths",
      },
      { name: "The Egg", by: "Andy Weir" },
      {
        name: "Project Hail Mary",
        by: "Andy Weir",
        why: "Listened to the audiobook multiple times. Beautiful story, and the alien bromance was a great unexpected plot surprise (in the book at least).",
      },
    ],
  },
  {
    name: "Growing up",
    items: [
      { name: "Suske en Wiske", by: "Willy Vandersteen" },
      { name: "Donald Duck" },
      { name: "De Schippers van de Kameleon", by: "Hotze de Roos" },
    ],
  },
  {
    name: "Thinkers",
    items: [
      { name: "Nassim Nicholas Taleb" },
      { name: "Robert Cialdini" },
      { name: "Daniel Kahneman" },
      { name: "Simon Sinek" },
    ],
  },
  {
    name: "Explainers",
    items: [
      { name: "Frans Verstraten" },
      { name: "Neil deGrasse Tyson" },
      { name: "Randall Munroe" },
    ],
  },
  {
    name: "On screen",
    items: [
      { name: "Marvel's Avengers saga", by: "Phases 1 to 3" },
      { name: "Ghostbusters II", by: "1989" },
      { name: "Knight Rider" },
      { name: "Airwolf" },
      { name: "The A-Team" },
      { name: "MacGyver" },
      { name: "The X-Files" },
      { name: "Star Trek: The Next Generation" },
      { name: "The Matrix", by: "1999" },
      { name: "Jurassic Park", by: "1993" },
      { name: "Silicon Valley" },
      { name: "The Expanse", by: "TV series" },
      { name: "Project Hail Mary", by: "2026" },
    ],
  },
  {
    name: "Listening",
    items: [{ name: "Freakonomics" }],
  },
];
