import { z } from 'zod';

/** Mirrors the backend's Joi schema (exam-ready-backend-node/src/schemas/category.schema.ts). */
export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  fullForm: z.string().trim().max(200).optional().or(z.literal('')),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  isActive: z.boolean(),
  displayOrder: z.number().int().min(0, 'Display order cannot be negative'),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
