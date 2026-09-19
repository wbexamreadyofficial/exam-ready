import { z } from 'zod';

/** Mirrors the backend's `createAdminSchema` (exam-ready-backend-node/src/schemas/user.schema.ts). */
export const newAdminFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a 10-digit mobile number starting with 6, 7, 8, or 9'),
  email: z.string().trim().email('Enter a valid email address').or(z.literal('')),
});

export type NewAdminFormInput = z.infer<typeof newAdminFormSchema>;

/** Admin edit of another user — mirrors the backend's `adminUpdateUserSchema`. An email can be changed but not cleared. */
export const editUserFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().trim().email('Enter a valid email address').or(z.literal('')),
});

export type EditUserFormInput = z.infer<typeof editUserFormSchema>;
