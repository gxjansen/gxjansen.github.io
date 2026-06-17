import type { BlogData, Author } from "./types";

// utils
import { getTranslatedData } from "@js/translationUtils";
import { injectYears } from "@js/textUtils";
import { defaultLocale } from "@config/siteSettings.json";
import { yearsBuilding } from "@data/siteStats";

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

// ── Event (eventUtils Event shape) ──────────────────────────────────────────
export interface EventData {
  id: string;
  name: string;
  date: string; // ISO string
  url?: string;
  city: string;
  country: string;
  topic?: string;
  role?: string;
  workshop?: boolean;
  loadedIcon?: { src: string } | null;
}

// ── Presentation (content collection entry data) ─────────────────────────────
export interface PresentationData {
  title?: string;
  duration?: string;
  intendedAudience?: string;
  isWorkshop?: boolean;
  image?: string;
  slideshareKey?: string;
  youtubeId?: string;
}

// ── Community (inline data from communities.astro) ───────────────────────────
export interface CommunityData {
  name: string;
  url?: string;
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

export interface EventProps {
  type: "event";
  event: EventData;
  canonicalUrl: URL;
}

export interface EventListProps {
  type: "eventList";
  events: EventData[];
  canonicalUrl: URL;
}

export interface PresentationProps {
  type: "presentation";
  presentation: PresentationData;
  slug: string;
  canonicalUrl: URL;
}

export interface PresentationListProps {
  type: "presentationList";
  presentations: PresentationData[];
  slugs: string[];
  canonicalUrl: URL;
}

export interface CommunitiesProps {
  type: "communities";
  communities: CommunityData[];
  canonicalUrl: URL;
}

export type JsonLDProps =
  | BlogProps
  | GeneralProps
  | EventProps
  | EventListProps
  | PresentationProps
  | PresentationListProps
  | CommunitiesProps;

// Canonical ID for Guido — referenced by all page-specific schemas.
const GUIDO_ID = "https://gui.do/about/#guido";

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
        `${import.meta.env.SITE}/authors/${author.id}`;

      // Build the base author schema
      const authorSchema: PersonSchema = {
        "@type": "Person",
        "@id": `${import.meta.env.SITE}/authors/${author.id}#person`,
        name: author.data.name,
        url: authorUrl,
      };

      // Add optional fields only if they exist
      if (author.data.bio || author.data.bioShort) {
        authorSchema.description = injectYears(
          author.data.bioShort || author.data.bio || "",
        );
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

    let authorsJsonLd: any;

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

  // ── Event detail page ──────────────────────────────────────────────────────
  if (type === "event") {
    const { event, canonicalUrl } = props as EventProps;
    const pageUrl = canonicalUrl.toString();
    const eventUrl = event.url || pageUrl;

    const description = [
      event.topic ? `Topic: ${event.topic}.` : "",
      event.role ? `Role: ${event.role}.` : "",
      event.workshop ? "Hands-on workshop." : "",
    ]
      .filter(Boolean)
      .join(" ");

    const jsonLD: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": "Event",
      "@id": pageUrl,
      name: event.name,
      startDate: event.date,
      location: {
        "@type": "Place",
        name: `${event.city}, ${event.country}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: event.city,
          addressCountry: event.country,
        },
      },
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      performer: { "@id": GUIDO_ID },
      organizer: { "@id": GUIDO_ID },
      url: eventUrl,
    };

    if (description) {
      jsonLD["description"] = description;
    }

    if (
      event.loadedIcon &&
      typeof event.loadedIcon === "object" &&
      "src" in event.loadedIcon
    ) {
      jsonLD["image"] = event.loadedIcon.src;
    }

    return `<script type="application/ld+json">
${JSON.stringify(jsonLD, null, 2)}
</script>`;
  }

  // ── Events index page — ItemList ───────────────────────────────────────────
  if (type === "eventList") {
    const { events, canonicalUrl } = props as EventListProps;
    const site = import.meta.env.SITE;

    const jsonLD = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": canonicalUrl.toString(),
      name: "Events",
      description: "Events where Guido X Jansen has spoken or presented.",
      itemListElement: events.map((event, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: event.name,
        url: `${site}/events/${event.id}/`,
      })),
    };

    return `<script type="application/ld+json">
${JSON.stringify(jsonLD, null, 2)}
</script>`;
  }

  // ── Presentation detail page ───────────────────────────────────────────────
  if (type === "presentation") {
    const { presentation, slug, canonicalUrl } = props as PresentationProps;
    const pageUrl = canonicalUrl.toString();

    const description = [
      presentation.intendedAudience
        ? `For: ${presentation.intendedAudience}.`
        : "",
      presentation.duration ? `Duration: ${presentation.duration}.` : "",
      presentation.isWorkshop ? "Workshop." : "",
    ]
      .filter(Boolean)
      .join(" ");

    const jsonLD: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": "PresentationDigitalDocument",
      "@id": pageUrl,
      name: presentation.title || slug,
      headline: presentation.title || slug,
      url: pageUrl,
      author: { "@id": GUIDO_ID },
      creator: { "@id": GUIDO_ID },
    };

    if (description) {
      jsonLD["description"] = description;
    }

    if (presentation.image) {
      jsonLD["image"] = presentation.image;
      jsonLD["thumbnailUrl"] = presentation.image;
    }

    if (presentation.youtubeId) {
      jsonLD["video"] = {
        "@type": "VideoObject",
        "@id": `https://www.youtube.com/watch?v=${presentation.youtubeId}`,
        url: `https://www.youtube.com/watch?v=${presentation.youtubeId}`,
        embedUrl: `https://www.youtube.com/embed/${presentation.youtubeId}`,
        name: presentation.title || slug,
      };
    }

    return `<script type="application/ld+json">
${JSON.stringify(jsonLD, null, 2)}
</script>`;
  }

  // ── Presentations index page — ItemList ────────────────────────────────────
  if (type === "presentationList") {
    const { presentations, slugs, canonicalUrl } =
      props as PresentationListProps;
    const site = import.meta.env.SITE;

    const jsonLD = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": canonicalUrl.toString(),
      name: "Presentations",
      description: "Presentations and workshops by Guido X Jansen.",
      itemListElement: presentations.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: p.title || slugs[index],
        url: `${site}/presentations/${slugs[index]}/`,
      })),
    };

    return `<script type="application/ld+json">
${JSON.stringify(jsonLD, null, 2)}
</script>`;
  }

  // ── Communities page — ItemList of Organizations ───────────────────────────
  if (type === "communities") {
    const { communities, canonicalUrl } = props as CommunitiesProps;

    const jsonLD = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": canonicalUrl.toString(),
      name: "Communities",
      description:
        "Technical and developer communities built or contributed to by Guido X Jansen.",
      itemListElement: communities.map((community, index) => {
        const item: Record<string, any> = {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Organization",
            name: community.name,
          },
        };
        if (community.url) {
          item["item"]["url"] = community.url;
        }
        return item;
      }),
    };

    return `<script type="application/ld+json">
${JSON.stringify(jsonLD, null, 2)}
</script>`;
  }

  const site = import.meta.env.SITE;
  const inLanguage = "language" in siteData ? (siteData as any).language : "en";

  // Person graph for Guido — sourced from the authors collection front-matter
  // (src/content/authors/gxjansen/index.mdx). Kept in sync manually because
  // siteData has no access to the content layer at this point.
  const personId = GUIDO_ID;
  const person = {
    "@type": "Person",
    "@id": personId,
    name: "Guido X Jansen",
    alternateName: "Guido Jansen",
    url: site,
    email: "mailto:x@gui.do",
    jobTitle: "Global Business & Technology Evangelist",
    description: `Community strategist with ${yearsBuilding}+ years building technical ecosystems around open-source platforms.`,
    worksFor: {
      "@type": "Organization",
      name: "Spryker",
      url: "https://spryker.com/",
    },
    knowsAbout: [
      "Community Building",
      "Developer Relations",
      "E-commerce & CRO",
      "Experimentation & A/B Testing",
      "Open Source Strategy",
      "Digital Usability",
      "Community-Led Growth",
      "Developer Experience",
    ],
    sameAs: [
      "https://www.linkedin.com/in/guidoxjansen/",
      "https://github.com/gxjansen",
      "https://bsky.app/profile/gui.do",
      "https://sifa.id/p/gui.do",
    ],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${site}/#website`,
    name: siteData.title,
    url: site,
    inLanguage,
    publisher: { "@id": personId },
    author: { "@id": personId },
    accessibilityAPI: "ARIA",
    accessibilityControl: [
      "fullKeyboardControl",
      "fullMouseControl",
      "fullTouchControl",
    ],
    accessibilityFeature: [
      "alternativeText",
      "structuralNavigation",
      "highContrastDisplay",
      "largePrint",
    ],
    accessibilityHazard: "none",
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [website, person],
  };

  return `<script type="application/ld+json">
${JSON.stringify(graph, null, 2)}
</script>`;
}

/**
 * Generates a BreadcrumbList JSON-LD block from a URL pathname.
 * Returns an empty string for the root path.
 */
export function breadcrumbGenerator(pathname: string, site: string): string {
  // Normalize: strip trailing slash, then split
  const clean = pathname.replace(/\/$/, "");
  if (!clean || clean === "") {
    return "";
  }

  const segments = clean.split("/").filter(Boolean);
  if (segments.length === 0) {
    return "";
  }

  // Build breadcrumb items: Home + each path segment
  const items: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: site.replace(/\/$/, "") + "/",
    },
  ];

  let accumulated = "";
  for (let i = 0; i < segments.length; i++) {
    accumulated += "/" + segments[i];
    const name = segments[i]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    items.push({
      "@type": "ListItem",
      position: i + 2,
      name,
      item: site.replace(/\/$/, "") + accumulated + "/",
    });
  }

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };

  return `<script type="application/ld+json">
${JSON.stringify(jsonLD, null, 2)}
</script>`;
}
