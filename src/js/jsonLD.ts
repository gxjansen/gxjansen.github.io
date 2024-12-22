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
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl.toString(),
        "inLanguage": postFrontmatter.language || "en",
        "accessibilityFeature": [
          "alternativeText",
          "readingOrder",
          "structuralNavigation",
          "tableOfContents",
          "highContrastDisplay",
          "largePrint",
          "taggedPDF"
        ],
        "accessibilityHazard": "none",
        "accessMode": ["textual", "visual"],
        "accessModeSufficient": ["textual"]
      },
      "headline": postFrontmatter.title,
      "description": postFrontmatter.description,
      "author": authorsJsonLd,
      "datePublished": postFrontmatter.pubDate,
      "dateModified": postFrontmatter.updatedDate || postFrontmatter.pubDate,
      "keywords": postFrontmatter.tags?.join(", "),
      "articleBody": postFrontmatter.content,
      "articleSection": postFrontmatter.category || "Blog",
      "wordCount": postFrontmatter.content?.split(/\s+/).length || 0
    };

    // Add image with accessibility attributes if it exists
    if (image && typeof image === 'object' && 'src' in image) {
      jsonLD["image"] = {
        "@type": "ImageObject",
        "url": image.src,
        "caption": postFrontmatter.imageCaption || postFrontmatter.title,
        "description": postFrontmatter.imageAlt || postFrontmatter.description,
        "width": image.width,
        "height": image.height
      };
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
      "url": "${import.meta.env.SITE}",
      "inLanguage": "${siteData.language || 'en'}",
      "accessibilityAPI": "ARIA",
      "accessibilityControl": [
        "fullKeyboardControl",
        "fullMouseControl",
        "fullTouchControl"
      ],
      "accessibilityFeature": [
        "alternativeText",
        "structuralNavigation",
        "highContrastDisplay",
        "largePrint"
      ],
      "accessibilityHazard": "none"
    }
  </script>`;
}
