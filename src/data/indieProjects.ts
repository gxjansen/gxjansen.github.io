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
    mainImage: "/images/projects/atlas-icon.svg",
    link: "https://bluespark.gui.do/",
    iconBgColor: "bg-blue-600"
  },
  {
    name: "SkyWatch",
    description: "BlueSky Follower Analytics & Management",
    mainImage: "/images/projects/devflow-icon.svg",
    link: "https://github.com/gxjansen/SkyWatch",
    iconBgColor: "bg-emerald-500"
  }
];
