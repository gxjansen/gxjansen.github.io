import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { getTranslatedData } from "@js/translationUtils";
import { defaultLocale } from "@config/siteSettings.json";

export async function GET(context: APIContext) {
  const posts = await getCollection("post", ({ data }) => {
    return !data.draft;
  });

  const siteData = getTranslatedData("siteData", defaultLocale);

  return rss({
    title: siteData.title,
    description: siteData.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.pubDate),
      description: post.data.description,
      link: `/post/${post.slug}/`,
    })),
  });
}
