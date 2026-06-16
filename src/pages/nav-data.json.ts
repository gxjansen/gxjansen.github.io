// Machine-readable site navigation (consumed by agents / tools).
// Mirrors the real information architecture — keep in sync with the Nav + Footer.
export async function GET() {
  const navConfig = [
    { text: "Articles", link: "/post" },
    { text: "Podcasts", link: "/podcasts" },
    { text: "Presentations", link: "/presentations" },
    { text: "Projects", link: "/projects" },
    { text: "Communities", link: "/communities" },
    {
      text: "Work with me",
      dropdown: [
        { text: "Retainer", link: "/retainer" },
        { text: "Speak at your event", link: "/speaker" },
        { text: "Training", link: "/training" },
        { text: "CV", link: "/cv" },
        { text: "Contact", link: "/contact" },
      ],
    },
    {
      text: "About",
      dropdown: [
        { text: "About Guido", link: "/about" },
        { text: "Events", link: "/events" },
        { text: "Ask me anything", link: "/ama" },
        { text: "Press & Media", link: "/press" },
        { text: "Newsletter", link: "/newsletter" },
      ],
    },
  ];

  return new Response(JSON.stringify(navConfig), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
