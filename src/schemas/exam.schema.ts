import { z } from 'zod';

export const createExamSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(1000).optional(),
  category: z.string().min(1, 'Category is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  totalMarks: z.number().min(1).max(1000),
  passingMarks: z.number().min(0),
  duration: z.number().min(5, 'Minimum 5 minutes').max(360, 'Maximum 6 hours'),
  negativeMarking: z.number().min(0).max(1),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  isPaid: z.boolean().default(false),
  price: z.number().min(0).optional(),
  instructions: z.string().max(2000).optional(),
  scheduledAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateExamInput = z.infer<typeof createExamSchema>;
