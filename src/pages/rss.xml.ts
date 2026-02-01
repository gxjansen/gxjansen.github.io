import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { getTranslatedData } from "@js/translationUtils";
import { defaultLocale } from "@config/siteSettings.json";

export async function GET(context: APIContext) {
  const posts = await getCollection("post", ({ data }) => {
    return !data.draft;
  });

  // Sort posts by publication date in descending order
  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  const siteData = getTranslatedData("siteData", defaultLocale);

  return rss({
    title: siteData.title,
    description: siteData.description,
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.pubDate),
      description: post.data.description,
      link: `/post/${post.slug}/`,
      author: post.data.authors?.join(", "),
      categories: post.data.categories || [],
      content: post.data.description,
      customData: post.data.heroImage
        ? `<media:content
            url="${context.site}post/${post.slug}/heroImage.jpg"
            medium="image"
            type="image/jpeg" />`
        : "",
    })),
    xmlns: {
      media: "http://search.yahoo.com/mrss/",
    },
    customData: `<language>en-us</language>
      <media:thumbnail url="${context.site}images/social-card.jpg"/>
      <media:keywords>optimization,psychology,cro,ux</media:keywords>
      <media:category>Technology</media:category>`,
  });
}
