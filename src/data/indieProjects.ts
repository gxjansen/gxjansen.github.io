interface IndieProject {
  name: string;
  description: string;
  mainImage: string;
  link: string;
  iconBgColor: string; // Tailwind color class for the icon background
  license?: string; // Optional license information
  githubUrl?: string; // Optional GitHub repository URL
}

export const indieProjects: IndieProject[] = [
  {
    name: "BlueSpark",
    description: "AI-powered conversation starter generator for BlueSky followers. You can use the SaaS version, run it locally or host it yourself (Netlify instructions included).",
    mainImage: "/icons/bluespark.svg",
    link: "https://bluespark.gui.do/",
    iconBgColor: "bg-black-600",
    githubUrl: "https://github.com/gxjansen/bluespark",
    license: "MIT"
  },
  {
    name: "SkyWatch",
    description: "BlueSky Follower Analytics & Management. Downloads all your followers, and allows you to filter/sort them based on their stats (followers, following, follower ratio, posts, posts/day, join date, last post date etc).",
    mainImage: "/icons/skywatch.svg",
    link: "https://github.com/gxjansen/SkyWatch",
    iconBgColor: "bg-black-500",
    githubUrl: "https://github.com/gxjansen/SkyWatch",
    license: "MIT"
  },
  {
    name: "Community Echo",
    description: "Tool to A) collect community activity from different sources, B) Determine the right internal team this post is relevant to and C) generate a short (Slack) message notifying this team of the activity.",
    mainImage: "tabler:speakerphone",
    link: "https://github.com/spryker-community/Echo",
    iconBgColor: "bg-[#EC008C]",
    githubUrl: "https://github.com/spryker-community/Echo",
    license: "MIT"
  }
];
