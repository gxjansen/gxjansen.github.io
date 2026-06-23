import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { getTranslatedData } from "@js/translationUtils";
import { defaultLocale } from "@config/siteSettings.json";
import { isPublished } from "../lib/isPublished";

export async function GET(context: APIContext) {
  // Exclude future-dated (scheduled) posts so the feed never leaks them early.
  const posts = await getCollection("post", ({ data }) => isPublished(data));

  // Sort posts by publication date in descending order
  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
  );

  const siteData = getTranslatedData("siteData", defaultLocale);

  return rss({
    title: siteData.title,
    description: siteData.description,
    site: context.site!,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.pubDate),
      description: post.data.description,
      link: `/post/${post.id}/`,
      author: post.data.authors?.join(", "),
      categories: post.data.categories || [],
      content: post.data.description,
      customData: post.data.heroImage
        ? `<media:content
            url="${context.site}post/${post.id}/heroImage.jpg"
            medium="image"
            type="image/jpeg" />`
        : "",
    })),
    xmlns: {
      media: "http://search.yahoo.com/mrss/",
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: `<language>en-us</language>
      <atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />
      <media:thumbnail url="${context.site}images/social-card.jpg"/>
      <media:keywords>optimization,psychology,cro,ux</media:keywords>
      <media:category>Technology</media:category>`,
  });
}
