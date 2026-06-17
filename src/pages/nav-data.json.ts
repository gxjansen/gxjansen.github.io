// Machine-readable site navigation (consumed by agents / tools).
// Mirrors the real Nav — keep in sync with src/config/en/navData.json.ts.
export async function GET() {
  const navConfig = [
    {
      text: "Creations",
      dropdown: [
        { text: "Articles", link: "/post" },
        { text: "Podcasts", link: "/podcasts" },
        { text: "Presentations", link: "/presentations" },
        { text: "Projects", link: "/projects" },
        { text: "Communities", link: "/communities" },
      ],
    },
    {
      text: "Work with me",
      dropdown: [
        { text: "Training", link: "/training" },
        { text: "Advisory", link: "/retainer" },
        { text: "Speaking", link: "/speaker" },
        { text: "Events", link: "/events" },
      ],
    },
    {
      text: "About",
      dropdown: [
        { text: "About Me", link: "/about" },
        { text: "Press & Media", link: "/press" },
        { text: "Contact", link: "/contact" },
      ],
    },
    { text: "CV", link: "/cv" },
  ];

  return new Response(JSON.stringify(navConfig), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
