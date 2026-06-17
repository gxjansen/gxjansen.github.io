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
        { text: "Events", link: "/events" },
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
      ],
    },
    {
      text: "About",
      dropdown: [
        { text: "About Me", link: "/about" },
        { text: "CV", link: "/cv" },
        { text: "Press & Media", link: "/press" },
        { text: "Contact", link: "/contact" },
      ],
    },
  ];

  return new Response(JSON.stringify(navConfig), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
