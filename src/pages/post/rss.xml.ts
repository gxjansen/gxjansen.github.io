import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
export const GET: APIRoute = async () => {
  const siteTitle = "Guido Jansen";
  const siteDescription = "Guido Jansen's Blog";
  // Get all posts and filter out drafts
  const posts = await getCollection('post', ({ data }) => {
    return !data.draft;
  });

  // Sort posts by publication date in descending order
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  return rss({
    // XML metadata
    title: siteTitle,
    description: siteDescription,
    site: import.meta.env.SITE,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.pubDate),
      // Ensure the link is properly formatted
      link: `/post/${post.slug}/`,
      // Include author if available
      author: post.data.authors?.join(', '),
      // Include categories if available
      categories: post.data.categories || [],
      // Clean and sanitize content
      content: post.data.description,
      // Add hero image if available
      customData: post.data.heroImage ? 
        `<media:content 
          url="${import.meta.env.SITE}/post/${post.slug}/heroImage.jpg"
          medium="image" 
          type="image/jpeg" />` : '',
    })),
    // Optional custom XML
    customData: `<language>en-us</language>
    <media:thumbnail url="${import.meta.env.SITE}/images/social-card.jpg"/>
    <media:keywords>optimization,psychology,cro,ux</media:keywords>
    <media:category>Technology</media:category>
    xmlns:media="http://search.yahoo.com/mrss/"`,
  });
};
