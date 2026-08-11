import { z } from 'zod';

export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 5 * 1024 * 1024, 'Image must be less than 5MB')
    .refine(
      (f) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(f.type),
      'Only JPEG, PNG, WebP, or GIF images are allowed'
    ),
});

export const pdfUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 20 * 1024 * 1024, 'PDF must be less than 20MB')
    .refine((f) => f.type === 'application/pdf', 'Only PDF files are allowed'),
});

export const videoUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 200 * 1024 * 1024, 'Video must be less than 200MB')
    .refine((f) => f.type.startsWith('video/'), 'Only video files are allowed'),
});
