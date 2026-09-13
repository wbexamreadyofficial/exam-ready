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

/** Register page's form — web signup keyed on mobile number + role, matches
 *  the backend's webRegisterSchema (mobile-number-identified; no email
 *  involved anywhere in the web flow). */
export const registerMobileRoleSchema = z.object({
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  role: z.enum(['examiner', 'partner', 'student'], {
    message: 'Select a role to continue',
  }),
});

export type RegisterMobileRoleInput = z.infer<typeof registerMobileRoleSchema>;
