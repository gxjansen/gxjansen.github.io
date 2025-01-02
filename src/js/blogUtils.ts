// utils
import {
  removeLocaleFromSlug,
  filterCollectionByLanguage,
} from "@js/localeUtils";
import { slugify } from "@js/textUtils";

// data
import { locales } from "@config/siteSettings.json";

// Client-side safe types (without any astro:content imports)
export interface BlogPost {
  id: string;
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
    heroImage: {
      src: string;
      width: number;
      height: number;
      format: "svg" | "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "avif";
    };
    categories: string[];
    authors: Array<{ id: string }>;
    draft?: boolean;
  };
}

/**
 * * returns all blog posts in a formatted array
 * @param posts: BlogPost[] - array of posts, unformatted
 * note: this has an optional options object, params below
 * @param filterOutFuturePosts: boolean - if true, filters out future posts
 * @param sortByDate: boolean - if true, sorts posts by date
 * @param limit: number - if number is passed, limits the number of posts returned
 * @returns formatted blog posts according to passed parameters
 */
interface FormatPostsOptions {
  filterOutFuturePosts?: boolean;
  sortByDate?: boolean;
  limit?: number;
  removeLocale?: boolean;
}

export function formatPosts(
  posts: BlogPost[],
  {
    filterOutFuturePosts = true,
    sortByDate = true,
    limit = undefined,
    removeLocale = true,
  }: FormatPostsOptions = {},
): BlogPost[] {
  // Create a deep copy of the posts array to avoid mutating the original
  const postsCopy = posts.map(post => ({
    ...post,
    data: { ...post.data }
  }));

  const filteredPosts = postsCopy.reduce((acc: BlogPost[], post) => {
    const { pubDate } = post.data;

    // filterOutFuturePosts if true
    if (filterOutFuturePosts && new Date(pubDate) > new Date()) return acc;

    // add post to acc
    acc.push(post);

    return acc;
  }, []);

  // now we have filteredPosts
  // sortByDate or randomize
  if (sortByDate) {
    filteredPosts.sort(
      (a: BlogPost, b: BlogPost) =>
        new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
    );
  } else {
    filteredPosts.sort(() => Math.random() - 0.5);
  }

  // remove locale from URL
  if (removeLocale) {
    filteredPosts.forEach((post) => {
      post.slug = removeLocaleFromSlug(post.slug);
    });
  }

  // limit if number is passed
  if (typeof limit === "number") {
    return filteredPosts.slice(0, limit);
  }

  return filteredPosts;
}

/**
 * * returns true if the posts are related to each other
 * @param postOne: BlogPost
 * @param postTwo: BlogPost
 * @returns true if the posts are related, false if not
 */
export function arePostsRelated(
  postOne: BlogPost,
  postTwo: BlogPost,
): boolean {
  // if titles are the same, then they are the same post. return false
  if (postOne.slug === postTwo.slug) return false;

  const postOneCategories = postOne.data.categories.map((category) =>
    slugify(category),
  );

  const postTwoCategories = postTwo.data.categories.map((category) =>
    slugify(category),
  );

  // if any categories match, return true
  const categoriesMatch = postOneCategories.some((category) =>
    postTwoCategories.includes(category),
  );

  return categoriesMatch;
}

/**
 * * returns an array of processed items, sorted by count
 * @param items: string[] - array of items to count and sort
 * @returns object with counts of each item in the array
 */
export function countItems(items: string[]): object {
  // get counts of each item in the array
  const countedItems = items.reduce((acc, item) => {
    const slugifiedItem = slugify(item);
    const val = acc[slugifiedItem]?.count || 0;

    return {
      ...acc,
      [slugifiedItem]: {
        original: item,
        count: val + 1
      },
    };
  }, {});

  return countedItems;
}

/**
 * * returns array of arrays, sorted by value (high value first)
 * @param jsObj: object - array of "key: value" pairs to sort
 * @returns array of arrays with counts, sorted by count
 */
export function sortByValue(jsObj: object): [string, string, number][] {
  const array: [string, string, number][] = [];
  for (const key in jsObj) {
    array.push([key, jsObj[key].original, jsObj[key].count]);
  }

  return array.sort((a, b) => b[2] - a[2]);
}
