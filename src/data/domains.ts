/**
 * Hand-kept data for /domains, on top of the `at.marque.domain` records in
 * Guido's PDS (src/lib/marque.ts): groups, notes, links, domains registered
 * elsewhere, aliases and domains left off the page.
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
    text: "gxjansen and guidojansen in .com, .nl and .org: held as I used some of these in the past and to prevent squatting.",
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
  /**
   * Redirects to another listed domain: shown as small print under that
   * domain instead of as its own entry.
   */
  aliasOf?: string;
}

/**
 * Domains not registered through Marque, so not in the PDS. None of these has
 * DNSSEC (no DS record) as of 2026-11-06.
 */
export const extraDomains: { domain: string; dnssec?: boolean }[] = [
  { domain: "gui.do" },
  { domain: "sifa.id" },
  { domain: "sifa.page" },
  { domain: "barazo.forum" },
  { domain: "atgora.forum" },
  { domain: "dutchento.com" },
];

export const domainOverrides: Record<string, DomainOverride> = {
  "gui.do": {
    pinned: true,
    note: "This site and my main Atmosphere account.",
    url: "https://gui.do/",
  },

  "sifa.id": {
    group: "projects",
    note: "Sifa ID, professional profiles on AT Protocol. Think LinkedIn, but open.",
    url: "https://sifa.id/",
  },
  "sifa.work": { aliasOf: "sifa.id" },
  "sifa.page": { aliasOf: "sifa.id" },
  "barazo.forum": {
    group: "projects",
    note: "Barazo, federated forums on AT Protocol. Open source Discourse/Flarum alternative.",
    url: "https://barazo.forum/",
  },
  "atgora.forum": { aliasOf: "barazo.forum" },
  "singi.dev": {
    group: "projects",
    note: "Singi Labs, my company behind Sifa and Barazo.",
    url: "https://singi.dev/",
  },
  "kootana.social": {
    group: "projects",
    note: "Kootana by Sifa, an app for meeting people at events.",
    url: "https://kootana.social/",
  },
  "kutana.social": { aliasOf: "kootana.social" },
  "2048.social": {
    group: "projects",
    note: "The 2048 game, but the tiles are Bluesky avatars of your friends.",
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
  "dutchento.com": { aliasOf: "dutchento.org" },
  "magento.nl": { group: "community", url: "https://gui.do/communities/" },
  "spryker.nl": { group: "community", url: "https://gui.do/communities/" },
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
    url: "https://atproto.eu/",
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
