import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("post", ({ data }) => !data.draft);

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
};

/**
 * Strip MDX-specific syntax (imports, JSX components) from the body
 * to produce clean, readable markdown for AI agents and readers.
 */
function mdxToMarkdown(body: string): string {
  return body
    .split("\n")
    // Remove import statements
    .filter((line) => !line.match(/^import\s+.*from\s+["']/))
    // Remove standalone JSX component tags (self-closing and block)
    .filter((line) => !line.match(/^<[A-Z]\w*\s[^>]*\/>\s*$/))
    .filter((line) => !line.match(/^<\/?[A-Z]\w*\s*>\s*$/))
    .join("\n")
    // Collapse 3+ consecutive blank lines into 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatDate(date: string | Date): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split("T")[0];
}

export const GET: APIRoute = ({ props }) => {
  const { post } = props;
  const { title, description, pubDate, updatedDate, categories, authors } =
    post.data;

  // Build YAML frontmatter
  const frontmatterLines = [`title: "${title.replace(/"/g, '\\"')}"`];

  if (description) {
    frontmatterLines.push(
      `description: "${description.replace(/"/g, '\\"')}"`,
    );
  }

  frontmatterLines.push(`date: ${formatDate(pubDate)}`);

  if (updatedDate) {
    frontmatterLines.push(`updated: ${formatDate(updatedDate)}`);
  }

  if (authors.length > 0) {
    frontmatterLines.push(`authors: [${authors.join(", ")}]`);
  }

  if (categories.length > 0) {
    frontmatterLines.push(`categories: [${categories.join(", ")}]`);
  }

  frontmatterLines.push(`url: https://gui.do/post/${post.slug}/`);

  const frontmatter = `---\n${frontmatterLines.join("\n")}\n---`;
  const body = mdxToMarkdown(post.body ?? "");
  const markdown = `${frontmatter}\n\n${body}\n`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
