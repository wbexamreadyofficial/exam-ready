import { z } from 'zod';

export const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Option text is required').max(500),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const createQuestionSchema = z.object({
  text: z.string().min(5, 'Question text must be at least 5 characters').max(2000),
  imageUrl: z.string().url().optional().or(z.literal('')),
  type: z.enum(['MCQ', 'TRUE_FALSE', 'FILL_IN_BLANK']),
  options: z.array(optionSchema).min(2, 'At least 2 options required').max(6),
  correctOptionId: z.string().min(1, 'Correct option is required'),
  explanation: z.string().max(2000).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  subjectId: z.string().min(1, 'Subject is required'),
  topicId: z.string().optional(),
  marks: z.number().min(0.5).max(10).default(1),
  negativeMarks: z.number().min(0).max(5).default(0.25),
  tags: z.array(z.string()).optional(),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
