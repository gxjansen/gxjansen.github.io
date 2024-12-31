const navConfig = [
  {
    text: "Creations",
    dropdown: [
      {
        text: "Podcasts",
        link: "/podcasts",
        icon: "tabler/outline/microphone",
      },
      {
        text: "Articles",
        link: "/post",
        icon: "tabler/outline/article",
      },
      {
        text: "Presentations",
        link: "/presentations",
        icon: "tabler/outline/presentation",
      },
      {
        text: "Indie Projects",
        link: "/projects",
        icon: "tabler/outline/code",
      },
    ],
  },
  {
    text: "Events",
    link: "/events",
  },
  {
    text: "About",
    dropdown: [
      {
        text: "About Me",
        link: "/about",
        icon: "tabler/outline/user",
      },
      {
        text: "Press & Media Features",
        link: "/press",
        icon: "tabler/outline/news",
      },
      {
        text: "Contact",
        link: "/contact",
        icon: "tabler/outline/messages",
      },
    ],
  },
  {
    text: "Pages",
    hidden: true,
    megaMenuColumns: [
      {
        title: "Landing Pages",
        items: [
          {
            text: "Landing 1",
            link: "/",
            icon: "tabler/star",
          },
          {
            text: "Landing 2",
            link: "/examples/landing2",
            icon: "tabler/diamonds",
          },
          {
            text: "Landing 3",
            link: "/examples/landing3",
            icon: "tabler/circle",
          },
        ],
      },
      {
        title: "Blog",
        items: [
          {
            text: "Blog Index 1",
            link: "/post",
            icon: "tabler/pencil",
          },
          {
            text: "Blog Index 2",
            link: "/examples/blogIndex2",
            icon: "tabler/pencil",
          },
          {
            text: "Categories",
            link: "/categories",
            icon: "tabler/category",
          },
          {
            text: "Blog Post",
            link: "/post/tsconfig-paths-setup",
            icon: "tabler/edit-circle",
          },
        ],
      },
    ],
  },
];

export default navConfig;
