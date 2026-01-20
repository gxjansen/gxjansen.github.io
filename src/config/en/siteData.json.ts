import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "Guido X Jansen",
  // Your website's title and description (meta fields)
  title:
    "Guido X Jansen | Community Strategist | Developer Advocate | Antifragile Growth",
  description:
    "Building developer ecosystems that create real business value. I advise C-suite leaders on community-led growth strategies.",
  // used on contact page and footer
  contact: {
    address1: "Ouderkerk aan de Amstel,",
    address2: "The Netherlands 🇳🇱 🇪🇺",
    phone: "Signal, Telegram, Whatsapp, LinkedIn...",
    email: "x@gui.do",
  },

  // Your information for blog post purposes
  author: {
    name: "Guido Jansen",
    email: "x@gui.do",
    twitter: "guido",
  },

  // default image for meta tags if the page doesn't have an image already
  defaultImage: {
    src: "/images/og-default.png",
    alt: "Guido X Jansen - Community Strategy & Ecosystem Building",
  },
};

export default siteData;
