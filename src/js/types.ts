// Client-safe types that mirror Astro's CollectionEntry types
export interface AuthorData {
  name: string;
  email?: string;
  website?: string;

  // Social profiles (for sameAs schema)
  twitter?: string;
  github?: string;
  linkedin?: string;
  bluesky?: string;
  instagram?: string;
  mastodon?: string;

  // Visual identity
  avatar?: {
    src: string;
    width: number;
    height: number;
    format: "svg" | "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "avif";
  };

  // Professional information
  jobTitle?: string;
  organization?: string;
  organizationUrl?: string;

  // Biography
  bio?: string;
  bioShort?: string;

  // Expertise & Credentials
  expertise: string[];
  credentials: string[];
  yearsOfExperience?: number;

  // Authority Signals
  awards: string[];
  publications: Array<{
    title: string;
    url: string;
    publication?: string;
    date?: string;
  }>;
  speakingEngagements: string[];

  // Legacy fields (keep for backward compatibility)
  about?: string;
  authorLink: string;
}

export interface BlogData {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  heroImage: {
    src: string;
    width: number;
    height: number;
    format: "svg" | "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "avif";
  };
  categories: string[];
  authors: Array<{ id: string }>;
  draft?: boolean;
  // New fields for enhanced accessibility and SEO
  language?: string;
  tags?: string[];
  content?: string;
  category?: string;
  imageCaption?: string;
  imageAlt?: string;
}

export interface SiteDataProps {
  title: string;
  description: string;
  author: {
    name: string;
    twitter: string;
  };
  language?: string;
  defaultImage: {
    src: string;
    width: number;
    height: number;
    format: string;
  };
}

export interface AccessibilityFeatures {
  alternativeText: boolean;
  readingOrder: boolean;
  structuralNavigation: boolean;
  tableOfContents: boolean;
  highContrastDisplay: boolean;
  largePrint: boolean;
  taggedPDF: boolean;
}

export interface AccessibilityControls {
  fullKeyboardControl: boolean;
  fullMouseControl: boolean;
  fullTouchControl: boolean;
}

export interface Author {
  id: string;
  slug: string;
  data: AuthorData;
}

export interface BlogPost {
  id: string;
  slug: string;
  data: BlogData;
}
