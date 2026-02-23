import type { BlogData, Author } from "./types";

// utils
import { getTranslatedData } from "@js/translationUtils";
import { defaultLocale } from "@config/siteSettings.json";

// data - siteData.title should not change based on locale so this should be fine
const siteData = getTranslatedData("siteData", defaultLocale);

/**
 * Image metadata interface (compatible with Astro's getImage result)
 */
interface ImageMetadata {
  src: string;
  width?: number;
  height?: number;
  format?: string;
}

/**
 * Schema.org Person type for JSON-LD
 */
interface PersonSchema {
  "@type": "Person";
  "@id": string;
  name: string;
  url: string;
  description?: string;
  sameAs?: string[];
  image?: {
    "@type": "ImageObject";
    url: string;
    caption: string;
  };
  jobTitle?: string;
  worksFor?: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
  knowsAbout?: string[];
  email?: string;
}

interface GeneralProps {
  type: "general";
}

export interface BlogProps {
  type: "blog";
  postFrontmatter?: BlogData;
  image?: ImageMetadata;
  authors?: Author[];
  canonicalUrl?: URL;
}

export type JsonLDProps = BlogProps | GeneralProps;

export default function jsonLDGenerator(props: JsonLDProps) {
  const { type } = props;
  if (type === "blog") {
    const {
      postFrontmatter,
      image,
      authors = [],
      canonicalUrl,
    } = props as BlogProps;

    if (!postFrontmatter || !canonicalUrl) {
      return "";
    }

    let authorsJsonLdArray = authors.map((author) => {
      // Build sameAs array from social profiles
      const sameAsLinks = [
        author.data.linkedin,
        author.data.twitter,
        author.data.github,
        author.data.bluesky,
        author.data.mastodon,
        author.data.website,
        author.data.instagram,
        author.data.authorLink, // Include authorLink as a sameAs profile
      ].filter(Boolean); // Remove undefined/null values

      // Ensure we always have a valid URL for the author
      const authorUrl =
        author.data.authorLink ||
        author.data.website ||
        `${import.meta.env.SITE}/authors/${author.slug}`;

      // Build the base author schema
      const authorSchema: PersonSchema = {
        "@type": "Person",
        "@id": `${import.meta.env.SITE}/authors/${author.slug}#person`,
        name: author.data.name,
        url: authorUrl,
      };

      // Add optional fields only if they exist
      if (author.data.bio || author.data.bioShort) {
        authorSchema.description = author.data.bioShort || author.data.bio;
      }

      if (sameAsLinks.length > 0) {
        authorSchema.sameAs = sameAsLinks as string[];
      }

      if (
        author.data.avatar &&
        typeof author.data.avatar === "object" &&
        "src" in author.data.avatar
      ) {
        authorSchema.image = {
          "@type": "ImageObject",
          url: author.data.avatar.src,
          caption: `Photo of ${author.data.name}`,
        };
      }

      if (author.data.jobTitle) {
        authorSchema.jobTitle = author.data.jobTitle;
      }

      if (author.data.organization) {
        authorSchema.worksFor = {
          "@type": "Organization",
          name: author.data.organization,
          ...(author.data.organizationUrl && {
            url: author.data.organizationUrl,
          }),
        };
      }

      if (author.data.expertise && author.data.expertise.length > 0) {
        authorSchema.knowsAbout = author.data.expertise;
      }

      if (author.data.email) {
        authorSchema.email = author.data.email;
      }

      return authorSchema;
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
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl.toString(),
        inLanguage: postFrontmatter.language || "en",
        accessibilityFeature: [
          "alternativeText",
          "readingOrder",
          "structuralNavigation",
          "tableOfContents",
          "highContrastDisplay",
          "largePrint",
          "taggedPDF",
        ],
        accessibilityHazard: "none",
        accessMode: ["textual", "visual"],
        accessModeSufficient: ["textual"],
      },
      headline: postFrontmatter.title,
      description: postFrontmatter.description,
      author: authorsJsonLd,
      datePublished: postFrontmatter.pubDate,
      dateModified: postFrontmatter.updatedDate || postFrontmatter.pubDate,
      keywords: postFrontmatter.tags?.join(", "),
      articleBody: postFrontmatter.content,
      articleSection: postFrontmatter.category || "Blog",
      wordCount: postFrontmatter.content?.split(/\s+/).length || 0,
    };

    // Add image with accessibility attributes if it exists
    if (image && typeof image === "object" && "src" in image) {
      jsonLD["image"] = {
        "@type": "ImageObject",
        url: image.src,
        caption: postFrontmatter.imageCaption || postFrontmatter.title,
        description: postFrontmatter.imageAlt || postFrontmatter.description,
        width: image.width,
        height: image.height,
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
      "inLanguage": "${"language" in siteData ? (siteData as any).language : "en"}",
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
