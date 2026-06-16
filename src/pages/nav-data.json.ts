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
    { text: "Events", link: "/events" },
    { text: "Training", link: "/training" },
    {
      text: "About",
      dropdown: [
        { text: "About Me", link: "/about" },
        { text: "Work with me", link: "/retainer" },
        { text: "Speak at your event", link: "/speaker" },
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
