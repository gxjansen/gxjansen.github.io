import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "Guido X Jansen",
  // Your website's title and description (meta fields)
  title:
    "Guido X Jansen | Building Antifragile Tech Ecosystems",
  description:
    "I create sustainable business value by understanding what your ecosystem needs and orchestrating internal change to deliver strategic growth engines.",
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
    src: "/images/x-logo.webp",
    alt: "Guido Jansen logo",
  },
};

export default siteData;
