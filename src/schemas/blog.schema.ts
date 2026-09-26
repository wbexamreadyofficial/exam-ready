import { z } from 'zod';

/** Mirrors the backend's Joi schema (exam-ready-backend-node/src/schemas/blog.schema.ts). */
export const blogFormSchema = z
  .object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only')
      .max(220)
      .optional()
      .or(z.literal('')),
    excerpt: z.string().trim().max(500).optional().or(z.literal('')),
    content: z.string().min(1, 'Blog content cannot be empty'),
    category: z.string().trim().min(1, 'Choose or create a category'),
    tags: z.array(z.string().trim().max(30)).max(15).default([]),
    author: z.string().trim().optional().or(z.literal('')),
    authorLabel: z.string().trim().min(2, 'Author name is required').max(120),
    status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']),
    scheduledAt: z.string().optional().or(z.literal('')),
    isFeatured: z.boolean(),
    displayOrder: z.number().int().min(0),
    metaTitle: z.string().trim().max(70).optional().or(z.literal('')),
    metaDescription: z.string().trim().max(160).optional().or(z.literal('')),
  })
  .refine((values) => values.status !== 'SCHEDULED' || Boolean(values.scheduledAt), {
    message: 'Pick a date and time to schedule this blog',
    path: ['scheduledAt'],
  });

export type BlogFormInput = z.infer<typeof blogFormSchema>;
