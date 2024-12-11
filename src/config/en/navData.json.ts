const navConfig = [
  {
    text: "Podcasts",
    link: "/podcasts",
  },
  {
    text: "Events",
    link: "/events",
  },
  {
    text: "Presentations",
    link: "/presentations",
  },
  {
    text: "Press",
    link: "/press",
  },
  {
    text: "Pages",
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
            link: "/blog",
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
            link: "/blog/tsconfig-paths-setup",
            icon: "tabler/edit-circle",
          },
        ],
      },
    ],
  },
  {
    text: "Articles",
    link: "/blog",
  },
  {
    text: "About",
    dropdown: [
      {
        text: "About Guido",
        link: "/about",
        icon: "tabler/outline/user",
      },
      {
        text: "Contact",
        link: "/contact",
        icon: "tabler/outline/messages",
      },
    ],
  },
];

export default navConfig;
