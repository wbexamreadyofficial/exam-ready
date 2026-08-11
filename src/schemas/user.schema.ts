import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number').optional().or(z.literal('')),
  bio: z.string().max(500).optional(),
  district: z.string().max(100).optional(),
  targetExams: z.array(z.string()).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
