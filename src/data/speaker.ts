/**
 * Content for the /speaker page: the section overview cards, organiser
 * testimonials, featured presentations and downloadable headshots.
 */
import headshot1 from "@images/headshot/08.02.2022_Spryker_CEO_0278.jpg";
import headshot2 from "@images/headshot/08.02.2022_Spryker_CEO_2636.jpg";
import headshot3 from "@images/headshot/08.02.2022_Spryker_CEO_2669.jpg";

// Section overview cards
export const overview = [
  {
    icon: "tabler/outline/file-text",
    title: "Rider Kit",
    desc: "Technical and logistical requirements",
    href: "#talk-format",
  },
  {
    icon: "tabler/outline/user",
    title: "Bio Format",
    desc: "Speaker biography and credentials",
    href: "#biography",
  },
  {
    icon: "tabler/outline/currency-euro",
    title: "Fee",
    desc: "Speaking fees and expenses",
    href: "#fee",
  },
  {
    icon: "tabler/outline/quote",
    title: "Testimonials",
    desc: "What others say about my talks",
    href: "#testimonials",
  },
  {
    icon: "tabler/outline/map-pin",
    title: "Travel & Accommodation",
    desc: "Logistics and requirements",
    href: "#travel",
  },
  {
    icon: "tabler/outline/device-tv",
    title: "AV/Tech Requirements",
    desc: "Technical setup needed",
    href: "#av-tech",
  },
  {
    icon: "tabler/outline/news",
    title: "Content for Your Marketing",
    desc: "Materials to promote the event",
    href: "#marketing",
  },
  {
    icon: "tabler/outline/sparkles",
    title: "And the Rest...",
    desc: "Additional information and details",
    href: "#headshots",
  },
];

// Testimonials
export const testimonials = [
  {
    initial: "E",
    quote:
      "Guido is an excellent public speaker. Whether it's a workshop, a conference talk, or a meetup, he always manages to bring energy and knowledge to his presentations.",
    name: "Erin Weigel",
    role: "Advisor, ABsmartly",
  },
  {
    initial: "A",
    quote: "Give him a stage and the audience will love him!",
    name: "Alex Franke",
    role: "EVP, Spryker",
  },
  {
    initial: "J",
    quote:
      "His session was extremely well received by a diverse audience of web development professionals. Guido's ability to communicate complex topics in a clear and engaging manner made his talk a highlight of the event.",
    name: "John O'Connor",
    role: "Development Inspector, Charles White Limited",
  },
  {
    initial: "T",
    quote:
      "I attended Guido's CRO session at Growth Tribe and I was mind-blown. He's articulate, knowledgeable, and uses real examples and frameworks that you can actually apply.",
    name: "Thomas Paris",
    role: "Director of Demand Generation, Posh",
  },
  {
    initial: "M",
    quote:
      "Guido brought his 'Persuasive eCommerce' topic to our meetup in Jakarta and the audience loved it. Very engaging speaker with deep practical knowledge.",
    name: "Muliadi Jeo",
    role: "Founder and Director, ICUBE",
  },
  {
    initial: "F",
    quote:
      "Guido has a unique combination of knowledge about psychology, experimentation, and e-commerce that makes his talks both insightful and highly practical.",
    name: "Florian Gendrault",
    role: "CEO, Alleo",
  },
  {
    initial: "R",
    quote:
      "Guido brings a unique blend of technical expertise and practical insights. His presentation style is engaging and the content is always relevant to our audience.",
    name: "Rob Janssen",
    role: "Event Director, Digital Analytics Congress",
  },
  {
    initial: "K",
    quote:
      "Working with Guido was a pleasure. He understood our audience needs and delivered content that was both educational and actionable. Our attendees loved it!",
    name: "Koen Verhagen",
    role: "Conference Organizer, Meet Magento",
  },
  {
    initial: "S",
    quote:
      "Guido's expertise in conversion optimization and his ability to translate complex concepts into practical advice made his session one of the most valuable at our event.",
    name: "Sandra de Vries",
    role: "Head of Programming, How to Web",
  },
];

// Featured presentations — lead with what I talk about now (community, AI,
// psychology), not the legacy e-commerce catalogue.
export const presentations = [
  {
    img: "/images/presentations/presentation-53d766b9.webp",
    title: "The Future of Community: Where Psychology, Tech and AI Collide",
    desc: "Where community building, psychology and AI meet, and what to start experimenting with right now.",
    duration: "40 minutes",
    href: "/presentations/the-future-of-community-where-psychology-tech-and-ai-collide/",
  },
  {
    img: "/images/presentations/guido-speaking.jpg",
    title: "AI/n8n workflow automation for techies",
    desc: "A hands-on demo of automating real work with AI and n8n, for teams who don't know where to start.",
    duration: "50 minute demo",
    href: "/presentations/n8n-ai-workflow-automation/",
  },
  {
    img: "/images/presentations/presentation-998768a1.jpeg",
    title: "Data Driven Decisions meets Psychology",
    desc: "Pairing experimentation with how people actually behave, so the data leads to better decisions.",
    duration: "30-90 minutes",
    href: "/presentations/data-driven-decisions-meets-psychology/",
  },
];

// Headshots
export const headshots = [
  {
    src: headshot1,
    href: "/images/headshot/08.02.2022_Spryker_CEO_0278.jpg",
  },
  {
    src: headshot2,
    href: "/images/headshot/08.02.2022_Spryker_CEO_2636.jpg",
  },
  {
    src: headshot3,
    href: "/images/headshot/08.02.2022_Spryker_CEO_2669.jpg",
  },
];
