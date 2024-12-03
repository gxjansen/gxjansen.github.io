// Client-safe types that mirror Astro's CollectionEntry types
export interface AuthorData {
  name: string;
  authorLink: string;
  about: string;
  email: string;
  avatar: {
    src: string;
    width: number;
    height: number;
    format: "svg" | "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "avif";
  };
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
