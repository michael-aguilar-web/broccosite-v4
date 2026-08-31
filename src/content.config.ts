import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const common = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  publishedDate: z.coerce.date().optional(),
  updatedDate: z.coerce.date().optional(),
});

const braindump = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/braindump' }),
  schema: common,
});

const games = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/games' }),
  schema: common.extend({
    game: z.enum(['tft', 'apex']),
    order: z.number().default(0),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/projects' }),
  schema: common.extend({
    cover: z.string(),
    coverAlt: z.string(),
    featured: z.boolean().default(false),
  }),
});

const wiki = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/wiki' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
    publishedDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    order: z.number().default(0),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { braindump, games, projects, wiki, pages };
