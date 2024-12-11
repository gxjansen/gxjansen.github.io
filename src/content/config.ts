import { defineCollection, z } from 'astro:content';

/**
 * Presentation collection schema
 */
const presentations = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string().optional(),  // Make title optional
    duration: z.string().optional(),
    intendedAudience: z.string().optional(),
    isWorkshop: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    image: z.string().optional(),
    slideshareKey: z.string().optional(),
    youtubeId: z.string().optional(),
    relatedEventSlugs: z.array(z.string()).default([])
  })
});

/**
 * Authors collection schema
 */
const authors = defineCollection({
  type: 'content',
  schema: z.object({})
});

/**
 * Blog collection schema
 */
const blog = defineCollection({
  type: 'content',
  schema: z.object({})
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
  authors,
  blog,
  countries,
  otherPages,
  services
};
