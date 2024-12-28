/**
 * Represents a social media link with visibility controls for different sections
 */
export interface SocialLink {
  /** The display name of the social media platform */
  name: string;
  /** The URL to the social media profile */
  href: string;
  /** The Tabler icon name for the platform */
  icon: string;
  /** Controls where this social link should be displayed */
  visibility: {
    /** Show in footer component */
    footer: boolean;
    /** Show in hero component */
    hero: boolean;
    /** Show in about page cards */
    about: boolean;
    /** Show on contact page */
    contact: boolean;
  };
}

export const socialLinks: SocialLink[] = [
  {
    name: 'Keybase',
    href: 'https://keybase.io/gxjansen',
    icon: 'tabler/IconKey',
    visibility: {
      footer: true,
      hero: true,
      about: true,
      contact: true
    }
  },
    {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=gxjansen',
    icon: 'tabler/brand-linkedin',
    visibility: {
      footer: true,
      hero: true,
      about: true,
      contact: true
    }
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@gxjansen',
    icon: 'tabler/brand-youtube',
    visibility: {
      footer: true,
      hero: false,
      about: true,
      contact: false
    }
  },
  {
    name: 'GitHub',
    href: 'https://github.com/gxjansen',
    icon: 'tabler/brand-github',
    visibility: {
      footer: true,
      hero: true,
      about: true,
      contact: true
    }
  },
  {
    name: 'BlueSky',
    href: 'https://bsky.app/profile/gui.do',
    icon: 'tabler/brand-bluesky',
    visibility: {
      footer: true,
      hero: false,
      about: true,
      contact: true
    }
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/gxjansen',
    icon: 'tabler/brand-instagram',
    visibility: {
      footer: true,
      hero: false,
      about: true,
      contact: false
    }
  },
  {
    name: 'Twitter (X)',
    href: 'https://twitter.com/guido',
    icon: 'tabler/brand-x',
    visibility: {
      footer: true,
      hero: true,
      about: true,
      contact: false
    }
  }
];
