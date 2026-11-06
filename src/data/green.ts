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
      "Static pages, very little JavaScript",
      "No trackers, no ads",
      "Images optimized at build time",
      "Hosted on Netlify, which can't show its energy is green (no verified green hosting, runs on AWS/Google Cloud) - a tradeoff I know about",
    ],
  },
  {
    name: "Servers",
    items: [
      "A lot runs on my own NAS at home",
      "Home Assistant measures its power use",
      "Singi Labs VPS runs at Hetzner in Germany, where data centers use hydropower",
      "Local AI (Ollama) is for privacy, not the climate: datacenters are probably more efficient per token than my PC",
    ],
  },
  {
    name: "At home",
    items: [
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
