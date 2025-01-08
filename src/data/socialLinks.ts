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
    name: 'Signal',
    href: 'https://signal.me/#eu/-unUEm2N_tIpI5lcvxWOfJ2NeMRZ2KJ_etky02xAzQiKdoxJ4P9Nxqgl05zJBEMd',
    icon: 'signal',
    visibility: {
      footer: true,
      hero: true,
      about: true,
      contact: true
    }
  },
  {
    name: 'Keybase',
    href: 'https://keybase.io/gxjansen',
    icon: 'tabler/IconKey',
    visibility: {
      footer: true,
      hero: false,
      about: true,
      contact: true
    }
  },
    {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=gxjansen',
    icon: 'linkedin',
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
    icon: 'tabler/filled/brand-youtube',
    visibility: {
      footer: true,
      hero: true,
      about: true,
      contact: false
    }
  },
  {
    name: 'GitHub',
    href: 'https://github.com/gxjansen',
    icon: 'tabler/filled/brand-github',
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
    icon: 'bluesky',
    visibility: {
      footer: true,
      hero: true,
      about: true,
      contact: true
    }
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/gxjansen',
    icon: 'instagram',
    visibility: {
      footer: false,
      hero: false,
      about: false,
      contact: false
    }
  },
  {
    name: 'Twitter (X)',
    href: 'https://twitter.com/guido',
    icon: 'tabler/filled/brand-x',
    visibility: {
      footer: true,
      hero: false,
      about: false,
      contact: false
    }
  }
];
