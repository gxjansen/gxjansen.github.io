import type { BlogData, Author } from "./types";

// utils
import { getTranslatedData } from "@js/translationUtils";
import { defaultLocale } from "@config/siteSettings.json";

// data - siteData.title should not change based on locale so this should be fine
const siteData = getTranslatedData("siteData", defaultLocale);

interface GeneralProps {
  type: "general";
}

export interface BlogProps {
  type: "blog";
  postFrontmatter?: BlogData;
  image?: any; // result of getImage() from Seo.astro
  authors?: Author[];
  canonicalUrl?: URL;
}

export type JsonLDProps = BlogProps | GeneralProps;

export default function jsonLDGenerator(props: JsonLDProps) {
  const { type } = props;
  if (type === "blog") {
    const { postFrontmatter, image, authors = [], canonicalUrl } =
      props as BlogProps;

    if (!postFrontmatter || !canonicalUrl) {
      return '';
    }

    let authorsJsonLdArray = authors.map((author) => {
      return {
        "@type": "Person",
        name: author.data.name,
        url: author.data.authorLink,
      };
    });

    let authorsJsonLd;

    if (authorsJsonLdArray.length === 1) {
      authorsJsonLd = authorsJsonLdArray[0];
    } else if (authorsJsonLdArray.length > 1) {
      authorsJsonLd = authorsJsonLdArray;
    } else {
      authorsJsonLd = {
        "@type": "Person",
        name: siteData.author.name,
        url: `https://twitter.com/${siteData.author.twitter}`,
      };
    }

    const jsonLD = {
      "@context": "https://schema.org",
      "@type": "Blogposting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl.toString()
      },
      "headline": postFrontmatter.title,
      "description": postFrontmatter.description,
      "author": authorsJsonLd,
      "datePublished": postFrontmatter.pubDate,
      "dateModified": postFrontmatter.updatedDate || postFrontmatter.pubDate
    };

    // Only add image if it exists and has a src property
    if (image && typeof image === 'object' && 'src' in image) {
      jsonLD["image"] = image.src;
    }

    return `<script type="application/ld+json">
      ${JSON.stringify(jsonLD, null, 2)}
    </script>`;
  }

  return `<script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "WebSite",
      "name": "${siteData.title}",
      "url": "${import.meta.env.SITE}"
    }
  </script>`;
}
