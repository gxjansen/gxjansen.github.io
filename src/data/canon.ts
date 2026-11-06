/**
 * Data for /canon (https://slashpages.net): the books, people and screen
 * stuff that shaped how Guido thinks. Most things released before 2000 go
 * under "Growing up". A `why` per item is optional.
 */

export interface CanonItem {
  name: string;
  /** Author, creator or year, shown after the name. */
  by?: string;
  /** Item page on Bookhive (books) or Popfeed (screen). */
  url?: string;
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
      {
        name: "Bobiverse",
        by: "Dennis E. Taylor",
        url: "https://bookhive.buzz/books/bk_QpAYHDvWcvppAypChYHy",
      },
      {
        name: "The Expanse",
        by: "James S.A. Corey",
        url: "https://bookhive.buzz/books/bk_9DGGSjrdm6u2GUHePsCe",
      },
      {
        name: "The Three-Body Problem",
        by: "Liu Cixin",
        url: "https://bookhive.buzz/books/bk_q8k17tKuKqKAPDybYQmj",
      },
      {
        name: "Made to Stick",
        by: "Chip Heath and Dan Heath",
        url: "https://bookhive.buzz/books/bk_PSStcppRZ6zVu2inqCMH",
      },
      {
        name: "Influence",
        by: "Robert Cialdini",
        url: "https://bookhive.buzz/books/bk_cZ07xDAyoVccvZGGA3y2",
      },
      {
        name: "The God Delusion",
        by: "Richard Dawkins",
        url: "https://bookhive.buzz/books/bk_fmKwEOTgnxnjbpOoubsk",
      },
      {
        name: "The Culture Map",
        by: "Erin Meyer",
        url: "https://bookhive.buzz/books/bk_qscKoRQRi6xbmO10JAcZ",
      },
      {
        name: "Off to Be the Wizard",
        by: "Scott Meyer",
        url: "https://bookhive.buzz/books/bk_v03KrKIIaJx0NQyABJil",
      },
      {
        name: "Algorithms to Live By",
        by: "Brian Christian and Tom Griffiths",
        url: "https://bookhive.buzz/books/bk_tWYw4cOoPajM0MwwphS9",
      },
      {
        name: "Freakonomics",
        by: "Steven D. Levitt and Stephen J. Dubner",
        url: "https://bookhive.buzz/books/bk_YvRhMiyQkn3PasSOgDrd",
      },
      {
        name: "The Egg",
        by: "Andy Weir",
        url: "https://bookhive.buzz/books/bk_qGwT4nERDa8XW65PjDUD",
      },
      {
        name: "Project Hail Mary",
        by: "Andy Weir",
        why: "Listened to the audiobook multiple times. Beautiful story, and the alien bromance was a great unexpected plot surprise (in the book at least).",
        url: "https://bookhive.buzz/books/bk_8W2yvFBhN0NOAWoMzmOm",
      },
      {
        name: "Antifragile",
        by: "Nassim Nicholas Taleb",
        url: "https://bookhive.buzz/books/bk_CJO4kSiRcYwXYO7Qn1l2",
      },
      {
        name: "Mythos",
        by: "Stephen Fry",
        url: "https://bookhive.buzz/books/bk_bPD2GkFbCdOG12pQeuvQ",
      },
      {
        name: "Norse Mythology",
        by: "Neil Gaiman",
        url: "https://bookhive.buzz/books/bk_U4IyoK0JDTv9d5uiqb28",
      },
      {
        name: "Thinking in Bets",
        by: "Annie Duke",
        url: "https://bookhive.buzz/books/bk_8pH1waTjO4eieDceWn9B",
      },
      {
        name: "Factfulness",
        by: "Hans Rosling",
        url: "https://bookhive.buzz/books/bk_n8mocwZKoc9iRobrsr2s",
      },
      {
        name: "Je hebt wél iets te verbergen",
        by: "Maurits Martijn and Dimitri Tokmetzis",
        url: "https://bookhive.buzz/books/bk_T19N2FgVMEO4ax5KGlRS",
      },
      {
        name: "The Cathedral and the Bazaar",
        by: "Eric S. Raymond",
        url: "https://bookhive.buzz/books/bk_b0aYi1milOdUsJOkygik",
      },
      {
        name: "Utopia for Realists",
        by: "Rutger Bregman",
        url: "https://bookhive.buzz/books/bk_gplY5XOhHczYCeLXtYQz",
      },
    ],
  },
  {
    name: "Growing up",
    items: [
      {
        name: "Suske en Wiske",
        by: "Willy Vandersteen",
        url: "https://popfeed.social/book/9789002225161",
      },
      {
        name: "Donald Duck",
        url: "https://bookhive.buzz/books/bk_KddqdPWSRpy7q8jsmiSq",
      },
      { name: "Asterix and Obelix", by: "Goscinny and Uderzo" },
      {
        name: "User Friendly",
        by: "J.D. Frazer",
        url: "https://en.wikipedia.org/wiki/User_Friendly",
      },
      {
        name: "De Schippers van de Kameleon",
        by: "Hotze de Roos",
        url: "https://bookhive.buzz/books/bk_oALK35A1J8QeNvo4zKxm",
      },
      {
        name: "De Fabeltjeskrant",
        url: "https://popfeed.social/tv_show/35007",
      },
      { name: "Sesamstraat", url: "https://popfeed.social/tv_show/19240" },
      { name: "Het Klokhuis", url: "https://popfeed.social/tv_show/12080" },
      {
        name: "Ghostbusters II",
        by: "1989",
        url: "https://popfeed.social/movie/2978",
      },
      { name: "Knight Rider", url: "https://popfeed.social/tv_show/2384" },
      { name: "Airwolf", url: "https://popfeed.social/tv_show/2119" },
      { name: "The A-Team", url: "https://popfeed.social/tv_show/1516" },
      { name: "MacGyver", url: "https://popfeed.social/tv_show/2875" },
      { name: "Miami Vice", url: "https://popfeed.social/tv_show/1908" },
      { name: "The X-Files", url: "https://popfeed.social/tv_show/4087" },
      {
        name: "Star Trek: The Next Generation",
        why: "Engage",
        url: "https://popfeed.social/tv_show/655",
      },
      {
        name: "The Matrix",
        by: "1999",
        url: "https://popfeed.social/movie/603",
      },
      {
        name: "Jurassic Park",
        by: "1993",
        url: "https://popfeed.social/movie/329",
      },
      { name: "Caesar III", by: "1998" },
      { name: "Civilization" },
      { name: "Mario Kart" },
      { name: "SimCity" },
    ],
  },
  {
    name: "Thinkers",
    items: [
      { name: "Nassim Nicholas Taleb" },
      { name: "Daniel Kahneman" },
      { name: "Simon Sinek" },
    ],
  },
  {
    name: "Explainers",
    items: [
      { name: "Frans Verstraten" },
      { name: "Neil deGrasse Tyson" },
      { name: "Randall Munroe", by: "xkcd" },
      { name: "Derek Muller", by: "Veritasium" },
      { name: "Kurzgesagt" },
      { name: "Michael Stevens", by: "Vsauce" },
      { name: "Cleo Abram" },
      { name: "EposVox" },
      { name: "Hannah Fry" },
      { name: "Jeff Geerling" },
      { name: "Jono Bacon" },
      { name: "Kyle Hill" },
      { name: "Steve Mould" },
      { name: "Matt Parker", by: "Stand-up Maths" },
      { name: "John and Hank Green", by: "Vlogbrothers" },
    ],
  },
  {
    name: "On screen",
    items: [
      { name: "Marvel's Avengers saga", by: "Phases 1 to 3" },
      {
        name: "Doctor Who",
        by: "2005 onward",
        why: "Spoilers",
        url: "https://popfeed.social/tv_show/57243",
      },
      { name: "Silicon Valley", url: "https://popfeed.social/tv_show/60573" },
      { name: "Black Mirror", url: "https://popfeed.social/tv_show/42009" },
      { name: "Mr. Robot", url: "https://popfeed.social/tv_show/62560" },
      {
        name: "The Expanse",
        by: "TV series",
        why: "Space is too fucking big",
        url: "https://popfeed.social/tv_show/63639",
      },
      {
        name: "Project Hail Mary",
        by: "2026",
        why: "Grace Rocky Save Stars",
        url: "https://popfeed.social/movie/687163",
      },
    ],
  },
  {
    name: "Games",
    items: [
      { name: "Minecraft" },
      { name: "Factorio" },
      { name: "Satisfactory" },
      { name: "Timberborn" },
    ],
  },
];
