/**
 * Data for /green (https://slashpages.net): what Guido does to waste less
 * energy, water and stuff, tradeoffs included.
 */

export interface GreenGroup {
  name: string;
  items: string[];
}

export const green: GreenGroup[] = [
  {
    name: "This site",
    items: [
      "Small pages: static, little JavaScript, no trackers or ads, optimized images",
      "Hosted on Netlify, which can't show its energy is green (no verified green hosting, runs on AWS/Google Cloud) - a tradeoff I know about",
    ],
  },
  {
    name: "Servers",
    items: [
      "A lot runs on my own NAS at home",
      "Home Assistant measures its power use",
      "Singi Labs VPS runs at Hetzner in Germany, where data centers use hydropower",
    ],
  },
  {
    name: "At home",
    items: [
      "Fully insulated",
      "Green electricity from Greenchoice, no solar panels yet",
      "Air conditioning already heats part of the house, hybrid heat pump for the rest planned next year",
      "Home Assistant tracks device power and presence, so no heating or lights in empty rooms",
    ],
  },
  {
    name: "Getting around",
    items: [
      "Cycling for local trips",
      "Train for longer distances when possible",
      "Hybrid car for the rest",
      "Minimize flying",
    ],
  },
  {
    name: "Stuff and water",
    items: [
      "Buy repairable (Fairphone) and use things for years",
      "Second-hand clothes, especially for the kids who outgrow them fast",
      "Shower instead of bath, and not washing the car every weekend",
    ],
  },
];
