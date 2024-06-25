import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "Guido X Jansen",
  // Your website's title and description (meta fields)
  title:
    "Global Business & Technology Evangelist",
  description:
    "I'm a psychologist working in E-commerce. ‍ I build community & business experimentation teams & programs at innovative businesses.",
  // used on contact page and footer
  contact: {
    address1: "1234 Main Street",
    address2: "New York, NY 10001",
    phone: "(123) 456-7890",
    email: "x@gui.de",
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
