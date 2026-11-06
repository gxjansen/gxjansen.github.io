/**
 * Hand-kept data for /domains, on top of the `at.marque.domain` records in
 * Guido's PDS (src/lib/marque.ts): groups, notes, links, domains registered
 * elsewhere and domains left off the page.
 *
 * A new Marque domain shows up by itself under "Everything else"; add an
 * override here to give it a group and a note. An override for a domain that
 * has no record (and isn't in extraDomains) is ignored.
 */

export type DomainGroupId = "name" | "projects" | "community" | "other";

export const domainGroups: {
  id: DomainGroupId;
  label: string;
  text?: string;
}[] = [
  { id: "projects", label: "Projects" },
  { id: "community", label: "Community" },
  {
    id: "name",
    label: "Name domains",
    text: "gxjansen and guidojansen in .com, .nl and .org: held so nobody else gets them.",
  },
  { id: "other", label: "Everything else" },
];

export interface DomainOverride {
  group?: DomainGroupId;
  note?: string;
  /** Link the domain when it serves a site. */
  url?: string;
  /** Shown on top, outside the groups. */
  pinned?: boolean;
  /** Private use: left off the page. */
  hidden?: boolean;
}

/** Domains not registered through Marque. */
export const extraDomains: { domain: string; dnssec?: boolean }[] = [
  { domain: "gui.do" },
];

export const domainOverrides: Record<string, DomainOverride> = {
  "gui.do": {
    pinned: true,
    note: "gui.do is this site and my handle, registered elsewhere.",
    url: "https://gui.do/",
  },

  "singi.dev": {
    group: "projects",
    note: "Singi Labs, my company behind Sifa and Barazo.",
    url: "https://singi.dev/",
  },
  "sifa.work": { group: "projects" },
  "kootana.social": {
    group: "projects",
    note: "Kootana by Sifa, an app for meeting people at events.",
    url: "https://kootana.social/",
  },
  "kutana.social": {
    group: "projects",
    note: "The Swahili spelling (kutana = to meet), kept next to kootana.social.",
  },
  "2048.social": {
    group: "projects",
    note: "The 2048 game, but the tiles are Bluesky avatars.",
    url: "https://2048.social/",
  },

  "cro.cafe": {
    group: "community",
    note: "CRO.CAFE, my podcast and community on experimentation.",
    url: "https://www.cro.cafe/",
  },
  "dutchento.org": {
    group: "community",
    note: "The Dutch Magento community I started. Now redirects here.",
  },
  "magento.nl": { group: "community" },
  "spryker.nl": { group: "community" },
  "atproto.ch": {
    group: "community",
    note: "Local AT Protocol community site for Switzerland.",
    url: "https://atproto.ch/",
  },
  "atproto.pl": {
    group: "community",
    note: "Local AT Protocol community site for Poland.",
    url: "https://atproto.pl/",
  },
  "atcommons.eu": {
    group: "community",
    note: "Home of the shared code and lexicons for the atproto.* community sites.",
  },

  "gxjansen.com": { group: "name" },
  "gxjansen.nl": { group: "name" },
  "gxjansen.org": { group: "name" },
  "guidojansen.com": { group: "name" },
  "guidojansen.nl": { group: "name" },
  "guidojansen.org": { group: "name" },

  // Left off the page.
  "svl2.nl": { hidden: true },
  "devroede.nl": { hidden: true },
  "a11y.nl": { hidden: true },
};
