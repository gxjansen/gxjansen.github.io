// utils
import {
  removeLocaleFromSlug,
  filterCollectionByLanguage,
} from "@js/localeUtils";
import { slugify } from "@js/textUtils";

// data
import { locales } from "@config/siteSettings.json";

/**
 * Interface for counted item results
 */
export interface CountedItem {
  original: string;
  count: number;
}

/**
 * Record type for counted items keyed by slugified string
 */
export type CountedItems = Record<string, CountedItem>;

/**
 * Interface for posts with category data (used by filterCategoriesByCount)
 */
interface PostWithCategories {
  data: {
    categories?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Fisher-Yates shuffle for unbiased array randomization
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

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
  let sortedPosts: BlogPost[];
  if (sortByDate) {
    sortedPosts = [...filteredPosts].sort(
      (a: BlogPost, b: BlogPost) =>
        new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
    );
  } else {
    // Use Fisher-Yates shuffle for unbiased randomization
    sortedPosts = shuffleArray(filteredPosts);
  }

  // remove locale from URL
  if (removeLocale) {
    sortedPosts.forEach((post) => {
      post.slug = removeLocaleFromSlug(post.slug);
    });
  }

  // limit if number is passed
  if (typeof limit === "number") {
    return sortedPosts.slice(0, limit);
  }

  return sortedPosts;
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
 * * returns an object of processed items with counts
 * @param items: string[] - array of items to count
 * @returns Record of counted items keyed by slugified string
 */
export function countItems(items: string[]): CountedItems {
  // get counts of each item in the array
  const countedItems = items.reduce<CountedItems>((acc, item) => {
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
 * * returns array of tuples, sorted by count (high value first)
 * @param countedItems - Record of counted items from countItems()
 * @returns array of [slug, original, count] tuples, sorted by count descending
 */
export function sortByValue(countedItems: CountedItems): [string, string, number][] {
  const array: [string, string, number][] = [];
  for (const key in countedItems) {
    array.push([key, countedItems[key].original, countedItems[key].count]);
  }

  return array.sort((a, b) => b[2] - a[2]);
}

/**
 * * filters categories to only include those with minimum number of posts
 * @param categories: string[] - array of category names to filter
 * @param allPosts: PostWithCategories[] - all posts to count categories from
 * @param minCount: number - minimum number of posts required (default: 2)
 * @returns filtered array of category names
 */
export function filterCategoriesByCount(
  categories: string[],
  allPosts: PostWithCategories[],
  minCount: number = 2
): string[] {
  // Get all categories from all posts
  const allCategories = allPosts
    .map((post) => post.data.categories || [])
    .flat()
    .filter(Boolean);

  // Count occurrences
  const categoryCounts = countItems(allCategories);

  // Filter input categories to only include those with enough posts
  return categories.filter((category) => {
    const slugifiedCategory = slugify(category);
    return categoryCounts[slugifiedCategory]?.count >= minCount;
  });
}
