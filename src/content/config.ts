import { defineCollection, z } from 'astro:content';

/**
 * Presentation collection schema
 */
const presentations = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    isHidden: z.boolean(),  // Make isHidden required and strictly boolean
    title: z.string().optional(),  // Make title optional
    duration: z.string().optional(),
    intendedAudience: z.string().optional(),
    isWorkshop: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    image: z.string().optional(),
    slideshareKey: z.string().optional(),
    youtubeId: z.string().optional(),
    // Array of related event slugs for bi-directional relationship
    relatedEventSlugs: z.array(z.string()).default([])
  })
});

/**
 * Events collection schema
 */
const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(), // ISO date string
    location: z.string(),
    url: z.string().optional(),
    description: z.string().optional(),
    // Array of related presentation slugs for bi-directional relationship
    relatedPresentationSlugs: z.array(z.string()).default([])
  })
});

/**
 * Authors collection schema
 */
const authors = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    name: z.string(),
    email: z.string().optional(),
    website: z.string().optional(),

    // Social profiles (for sameAs schema)
    twitter: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    bluesky: z.string().optional(),
    instagram: z.string().optional(),
    mastodon: z.string().optional(),

    // Visual identity
    avatar: image().optional(),

    // Professional information
    jobTitle: z.string().optional(),
    organization: z.string().optional(),
    organizationUrl: z.string().optional(),

    // Expertise and credentials
    bio: z.string().optional(), // Detailed bio for profile page
    bioShort: z.string().optional(), // 1-2 sentence inline bio
    expertise: z.array(z.string()).default([]), // Areas of knowledge
    credentials: z.array(z.string()).default([]), // Certifications, degrees
    yearsOfExperience: z.number().optional(),

    // Authority signals
    awards: z.array(z.string()).default([]),
    publications: z.array(z.object({
      title: z.string(),
      url: z.string(),
      publication: z.string().optional(),
      date: z.string().optional()
    })).default([]),
    speakingEngagements: z.array(z.string()).default([]),

    // Legacy fields (keep for backward compatibility)
    about: z.string().optional(), // Can deprecate in favor of bio
    authorLink: z.string().optional() // Author profile URL
  })
});

/**
 * Post collection schema (formerly blog)
 */
const post = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    pubDate: z.union([
      z.string(),
      z.date()
    ]).transform((val) => {
      if (val instanceof Date) {
        return val.toISOString();
      }
      return new Date(val).toISOString();
    }),
    updatedDate: z.union([
      z.string(),
      z.date()
    ]).transform((val) => {
      if (val instanceof Date) {
        return val.toISOString();
      }
      return new Date(val).toISOString();
    }).optional(),
    heroImage: image().optional(),
    description: z.string().optional(),
    authors: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Bluesky AT URI for comments (e.g., "at://did:plc:xxx/app.bsky.feed.post/yyy")
    blueskyUri: z.string().optional()
  })
});

/**
 * Countries collection schema
 */
const countries = defineCollection({
  type: 'content',
  schema: z.object({})
});

/**
 * Other pages collection schema
 */
const otherPages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    draft: z.boolean().default(false)
  })
});

/**
 * Services collection schema
 */
const services = defineCollection({
  type: 'content',
  schema: z.object({})
});

export const collections = {
  presentations,
  events,
  authors,
  post, // Changed from 'blog' to 'post'
  countries,
  otherPages,
  services
};
