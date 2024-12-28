/**
 * Represents a social media link with visibility controls for different sections
 * @interface SocialLink
 */
interface SocialLink {
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
  };
}

export const socialLinks: SocialLink[] = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=gxjansen',
    icon: 'tabler/brand-linkedin',
    visibility: {
      footer: true,
      hero: true,
      about: true
    }
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@gxjansen',
    icon: 'tabler/brand-youtube',
    visibility: {
      footer: false,
      hero: false,
      about: false
    }
  },
  {
    name: 'GitHub',
    href: 'https://github.com/gxjansen',
    icon: 'tabler/brand-github',
    visibility: {
      footer: true,
      hero: true,
      about: true
    }
  },
  {
    name: 'BlueSky',
    href: 'https://bsky.app/profile/gui.do',
    icon: 'tabler/brand-bluesky',
    visibility: {
      footer: true,
      hero: false,
      about: true
    }
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/gxjansen',
    icon: 'tabler/brand-instagram',
    visibility: {
      footer: true,
      hero: false,
      about: true
    }
  },
  {
    name: 'Twitter (X)',
    href: 'https://x.com/guido',
    icon: 'tabler/brand-x',
    visibility: {
      footer: true,
      hero: true,
      about: true
    }
  }
];
