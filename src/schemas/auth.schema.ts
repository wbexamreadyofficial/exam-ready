import { z } from 'zod';

/** Step 1 — matches the backend's appMobileSchema. */
export const mobileSchema = z.object({
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
});

/** Step 2 — OTP verification, matches the backend's verifyAppOtpSchema. */
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Enter the 6-digit code')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
});

export type MobileInput = z.infer<typeof mobileSchema>;
export type OtpInput = z.infer<typeof otpSchema>;

/** Web (email) signup — matches the backend's webRegisterSchema. */
export const webRegisterSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  role: z.enum(['examiner', 'partner', 'student'], {
    message: 'Select a role to continue',
  }),
});

/** Web login — matches the backend's webEmailSchema. */
export const webEmailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export type WebRegisterInput = z.infer<typeof webRegisterSchema>;
export type WebEmailInput = z.infer<typeof webEmailSchema>;
