// data
import { locales, defaultLocale } from "@config/siteSettings.json.ts";

// Type helper for locale checking
type Locale = (typeof locales)[number];

/**
 * Type guard to check if a string is a valid locale
 */
function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * * returns the current locale gathered from the URL
 * @param url: current URL
 * @returns current locale as a string
 * use like `const currentLocale = getLocaleFromUrl(Astro.url);`
 *
 * This gives you the same result as `Astro.currentLocale` except:
 * - it never returns "undefined", and instead defaults to the defaultLocale
 * - It is useable in this typescript file and other non-astro files
 */
export function getLocaleFromUrl(url: URL): Locale {
  const [, locale] = url.pathname.split("/");

  if (isValidLocale(locale)) return locale;
  return defaultLocale;
}

/**
 * Interface for collection items with id and slug properties
 */
interface CollectionItem {
  id: string;
  slug: string;
  [key: string]: unknown;
}

/**
 * * return a content collection (such as blog posts) array filtered by language
 * @param collection: content collection array
 * @param locale: language to filter by (one of the above locales)
 * @param removeLocale: boolean (optional, default TRUE) - remove the locale from the slug field
 * @returns filtered content collection array (new array, does not mutate input)
 *
 *  ## Example
 *
 * ```ts
 *  import { getAllPosts } from "@js/blogServerUtils";
 *  import { filterCollectionByLanguage } from "@js/i18nUtils";
 *  const posts = await getAllPosts();
 *  const filteredPosts = filterCollectionByLanguage(posts, "de");
 * ```
 *
 * ## How to setup content collection
 *
 * Your content collections should be paths like `src/content/blog/de/my-post.md` and `src/content/post/my-post.md`
 */
export function filterCollectionByLanguage<T extends CollectionItem>(
  collection: T[],
  locale: Locale,
  removeLocale: boolean = true,
): T[] {
  // check if the passed language is in the languages array
  if (!isValidLocale(locale)) {
    console.error(`Language ${locale} not found in locales array`);
    return [];
  }

  const filteredCollection = collection.filter((item) =>
    item.id.startsWith(`${locale}/`),
  );

  // Return new objects with updated slugs (no mutation)
  if (removeLocale) {
    return filteredCollection.map((item) => ({
      ...item,
      slug: removeLocaleFromSlug(item.slug),
    }));
  }

  return filteredCollection;
}

/**
 * * removes any instances of the locale from the URL
 * @param slug: string URL to remove locale from
 * @returns string URL with locale removed
 * Useful for content colection subfolders like blog/en/my-post where the slug field will be "en/my-post"
 */
export function removeLocaleFromSlug(slug: string): string {
  // split the URL into parts separated by "/"
  const slugElements = slug.split("/");

  // map over the URL parts and remove any locales
  const newSlugElements = slugElements.filter(
    (element) => !isValidLocale(element),
  );

  // combine the URL parts back into a string
  return newSlugElements.join("/");
}
