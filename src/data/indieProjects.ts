interface IndieProject {
  name: string;
  description: string;
  mainImage: string;
  link: string;
  iconBgColor: string; // Tailwind color class for the icon background
  license?: string; // Optional license information
  tagline?: string; // Optional custom tagline (overrides license display)
  githubUrl?: string; // Optional GitHub repository URL
}

export const indieProjects: IndieProject[] = [
  {
    name: "n8n Pulse",
    description: "Community analytics dashboard for the n8n ecosystem. Track community growth, discover trending workflows, explore popular integrations, and build custom visualizations with the data playground.",
    mainImage: "/icons/n8n-pulse.svg",
    link: "https://n8n-pulse.gui.do/",
    iconBgColor: "bg-[#1a1a2e]",
    githubUrl: "https://github.com/gxjansen/n8n-pulse",
    license: "MIT"
  },
  {
    name: "AI Consensus Answers",
    description: "n8n workflow that generates consensus-based answers by leveraging multiple AI models with a peer review system. Synthesizes responses across different AI systems to improve answer quality through comparative analysis.",
    mainImage: "/icons/n8n.svg",
    link: "https://n8n.io/workflows/11660-generate-consensus-answers-with-multiple-ai-models-and-peer-review-system/",
    iconBgColor: "bg-[#1a1a2e]",
    tagline: "Available on the n8n template marketplace"
  },
  {
    name: "Community Echo",
    description: "Tool to A) collect community activity from different sources, B) Determine the right internal team this post is relevant to and C) generate a short (Slack) message notifying this team of the activity.",
    mainImage: "tabler:speakerphone",
    link: "https://github.com/spryker-community/Echo",
    iconBgColor: "bg-[#EC008C]",
    githubUrl: "https://github.com/spryker-community/Echo",
    license: "MIT"
  },
  {
    name: "Transistor MCP",
    description: "This MCP server provides tools to interact with the <a href='https://transistor.fm/' target='_blank' rel='noopener noreferrer'>Transistor.fm</a> API, allowing you to manage podcasts, episodes, and view analytics.",
    mainImage: "/icons/transistor.svg",
    link: "https://github.com/gxjansen/Transistor-MCP",
    iconBgColor: "bg-[#FBC75D]",
    githubUrl: "https://github.com/gxjansen/Transistor-MCP",
    license: "MIT"
  },
  {
    name: "CRM LinkedIn Enricher",
    description: "n8n workflow that integrates LinkedIn profile scraping with Apify and NocoDB CRM. Automatically enriches and updates customer data with detailed LinkedIn information for enhanced lead intelligence.",
    mainImage: "/icons/n8n.svg",
    link: "https://n8n.io/workflows/5258-enrich-linkedin-profiles-in-nocodb-crm-with-apify-scraper/",
    iconBgColor: "bg-[#1a1a2e]",
    tagline: "Available on the n8n template marketplace"
  },
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
  }
];
