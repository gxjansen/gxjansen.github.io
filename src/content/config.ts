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
    twitter: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    avatar: image().optional(),
    about: z.string().optional(),
    authorLink: z.string().optional()
  })
});

/**
 * Blog collection schema
 */
const blog = defineCollection({
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
    draft: z.boolean().default(false)
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
  schema: z.object({})
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
  blog,
  countries,
  otherPages,
  services
};
