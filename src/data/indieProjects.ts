interface IndieProject {
  name: string;
  description: string;
  mainImage: string;
  link: string;
  iconBgColor: string; // Tailwind color class for the icon background
}

export const indieProjects: IndieProject[] = [
  {
    name: "BlueSpark",
    description: "AI-powered conversation starter generator for BlueSky followers",
    mainImage: "/public/icons/bluespark.svg",
    link: "https://bluespark.gui.do/",
    iconBgColor: "bg-black-600"
  },
  {
    name: "SkyWatch",
    description: "BlueSky Follower Analytics & Management",
    mainImage: "/public/icons/skywatch.svg",
    link: "https://github.com/gxjansen/SkyWatch",
    iconBgColor: "bg-black-500"
  },
  {
    name: "Community Echo",
    description: "BlueSky Follower Analytics & Management",
    mainImage: "tabler:speakerphone",
    link: "https://github.com/spryker-community/Echo",
    iconBgColor: "bg-purple-500"
  }
];
