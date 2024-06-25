/**
 * * This file is used to define the navigation links for the site.
 * Notes:
 * 1 level of dropdown is supported
 * Mega menus look best with 3-5 columns, but supports anything > 2 columns
 * If using icons, the icon should be saved in the src/icons folder. If filename is "tabler/icon.svg" then input "tabler/icon"
 * Recommend getting icons from https://tabler.io/icons
 */

// utils
import { getAllPosts, countItems, sortByValue } from "@js/blogUtils";
import { humanize } from "@js/textUtils";

// get the categories used in blog posts, to put into navbar
const posts = await getAllPosts("en");
const allCategories = posts.map((post) => post.data.categories).flat();
const countedCategories = countItems(allCategories);
const processedCategories = sortByValue(countedCategories);

// types
import { type navItem } from "../types/configDataTypes";

// note: 1 level of dropdown is supported
const navConfig: navItem[] = [
  {
    text: "Overview",
    link: "/overview",
  },

  // mega menu
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
      {
        title: "Elements and Forms",
        items: [
          {
            text: "MDX Pages",
            link: "/elements",
            icon: "tabler/wand",
          },
          {
            text: "Contact",
            link: "/contact",
            icon: "tabler/address-book",
          },
        ],
      },
      {
        title: "Other Pages",
        items: [
          {
            text: "About",
            link: "/a-propos",
            icon: "tabler/user",
          },
          {
            text: "Privacy Policy",
            link: "/privacy-policy",
            icon: "tabler/lock-square",
          },
          {
            text: "Terms of Use",
            link: "/terms",
            icon: "tabler/script",
          },
          {
            text: "Page not found",
            link: "/not-a-link",
            icon: "tabler/error-404",
          },
          {
            text: "RSS Feed",
            link: "/rss.xml",
            newTab: true,
            icon: "tabler/rss",
          },
        ],
      },
    ],
  },

  // regular dropdown
  {
    text: "Services",
    dropdown: [
      {
        text: "Exterior Painting",
        link: "/services/exterior-painting",
      },
      {
        text: "Interior Painting",
        link: "/services/interior-painting",
      },
      {
        text: "Deck and Fence",
        link: "/services/deck-and-fence-staining",
      },
    ],
  },
  {
    text: "Blog",
    link: "/blog",
  },
  // {
  //   // get the categories used in blog posts, to put into a navbar dropdown
  //   text: "Categories",
  //   dropdown: processedCategories.map(([category, count]) => {
  //     return {
  //       text: humanize(category),
  //       link: `/categories/${category}`,
  //     };
  //   }),
  // },
];

export default navConfig;
