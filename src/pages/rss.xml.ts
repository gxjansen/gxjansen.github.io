import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getTranslatedData } from "@js/translationUtils";
import { defaultLocale } from "@config/siteSettings.json";

export async function GET(context) {
  const posts = await getCollection("blog", ({ data }) => {
    return !data.draft;
  });
  
  const siteData = getTranslatedData("siteData", defaultLocale);

  return rss({
    title: siteData.title,
    description: siteData.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  });
}
