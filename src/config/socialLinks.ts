interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: 'linkedin',
    href: 'https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=gxjansen',
    icon: 'tabler/brand-linkedin'
  },
  {
    name: 'youtube',
    href: 'https://www.youtube.com/@gxjansen',
    icon: 'tabler/brand-youtube'
  },
  {
    name: 'github',
    href: 'https://github.com/gxjansen',
    icon: 'tabler/brand-github'
  },
  {
    name: 'bluesky',
    href: 'https://bsky.app/profile/gui.do',
    icon: 'tabler/brand-bluesky'
  },
  {
    name: 'instagram',
    href: 'https://www.instagram.com/gxjansen',
    icon: 'tabler/brand-instagram'
  },
  {
    name: 'twitter (x)',
    href: 'https://twitter.com/guido',
    icon: 'tabler/brand-x'
  }
];
