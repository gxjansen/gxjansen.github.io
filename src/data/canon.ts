/**
 * Data for /canon (https://slashpages.net): the books, people and screen
 * stuff that shaped how Guido thinks. Most things released before 2000 go
 * under "Growing up". A `quote` and a `why` per item are optional.
 */

export interface CanonItem {
  name: string;
  /** Author, creator or year, shown after the name. */
  by?: string;
  /** Item page on Bookhive (books) or Popfeed (screen). */
  url?: string;
  /** A line from the work itself, without quote marks: shown as a quote. */
  quote?: string;
  /** Guido's own comment, shown as plain text. */
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
        quote:
          "Hey, with IPv8, we should be able to address every galaxy in the universe.",
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
        quote: "Do not answer!",
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
        quote: "In this universe, there’s just you and me.",
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
        quote:
          "Antifragility is beyond resilience or robustness. The resilient resists shocks and stays the same; the antifragile gets better.",
        url: "https://bookhive.buzz/books/bk_CJO4kSiRcYwXYO7Qn1l2",
      },
      {
        name: "Meditations",
        by: "Marcus Aurelius",
        url: "https://bookhive.buzz/books/bk_ZgElfE6VQl6NKVF9hJ5X",
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
        quote:
          "When we have a fact-based worldview, we can see that the world is not as bad as it seems—and we can see what we have to do to keep making it better.",
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
        url: "http://www.catb.org/~esr/writings/cathedral-bazaar/",
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
      {
        name: "MacGyver",
        quote: "The best way to beat a problem is to make it work for you.",
        url: "https://popfeed.social/tv_show/2875",
      },
      {
        name: "Miami Vice",
        why: "Even just the soundtrack! The intro, In the Air Tonight, Crockett’s Theme, Take Me Home...",
        url: "https://popfeed.social/tv_show/1908",
      },
      {
        name: "The X-Files",
        quote:
          "I’ve seen the life on this planet, Scully, and that is exactly why I’m looking elsewhere.",
        url: "https://popfeed.social/tv_show/4087",
      },
      {
        name: "Star Trek: The Next Generation",
        quote: "Engage",
        url: "https://popfeed.social/tv_show/655",
      },
      {
        name: "The Matrix",
        by: "1999",
        quote:
          "Unfortunately, no one can be told what the Matrix is. You have to see it for yourself.",
        url: "https://popfeed.social/movie/603",
      },
      {
        name: "Fight Club",
        by: "1999",
        quote: "This is your life, and it’s ending one minute at a time.",
        url: "https://popfeed.social/movie/550",
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
      { name: "Kyle Hill", why: "Roko’s basilisk" },
      { name: "Steve Mould" },
      { name: "Matt Parker", by: "Stand-up Maths" },
      { name: "John and Hank Green", by: "Vlogbrothers" },
    ],
  },
  {
    name: "On screen",
    items: [
      {
        name: "Marvel's Avengers saga",
        by: "Phases 1 to 3",
        quote: "Perfectly balanced, as all things should be.",
      },
      {
        name: "Doctor Who",
        by: "2005 onward",
        quote: "Spoilers",
        url: "https://popfeed.social/tv_show/57243",
      },
      {
        name: "Memento",
        by: "2000",
        quote: "Memory can change the shape of a room.",
        url: "https://popfeed.social/movie/77",
      },
      {
        name: "Silicon Valley",
        quote: "It’s not magic, it’s talent and sweat.",
        url: "https://popfeed.social/tv_show/60573",
      },
      {
        name: "Black Mirror",
        quote:
          "Thanks to the technological revolution, we have the power to rage and accuse, spout bile without consequence.",
        url: "https://popfeed.social/tv_show/42009",
      },
      {
        name: "Mr. Robot",
        quote:
          "The world is a dangerous place, Elliot, not because of those who do evil, but because of those who look on and do nothing.",
        url: "https://popfeed.social/tv_show/62560",
      },
      {
        name: "The Expanse",
        by: "TV series",
        quote: "You’re not that guy. I am that guy.",
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
      {
        name: "Minecraft",
        why: "Selfhosting my kids’ Minecraft worlds with all of teh mods",
      },
      { name: "Factorio", quote: "The factory must grow." },
      { name: "Satisfactory", quote: "FICSIT does not waste." },
      {
        name: "Timberborn",
        why: "A post-apocalyptic lumberpunk beaver colony builder and terraforming sim",
      },
    ],
  },
];
