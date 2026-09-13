import { z } from 'zod';

/** Mirrors the backend's `dobSchema` age check in user.schema.ts. */
function calculateAge(dob: Date, today = new Date()): number {
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const birthdayHasPassed =
    today.getUTCMonth() > dob.getUTCMonth() ||
    (today.getUTCMonth() === dob.getUTCMonth() && today.getUTCDate() >= dob.getUTCDate());
  if (!birthdayHasPassed) age -= 1;
  return age;
}

const addressFieldsSchema = z.object({
  houseNoStreet: z.string().trim(),
  area: z.string().trim(),
  city: z.string().trim(),
  district: z.string().trim(),
  pinCode: z.string().trim(),
});

/** Matches the backend's `updateUserSchema` — `mobileNumber` is read-only
 *  from this form (the backend rejects it outright on the update endpoint). */
export const profileFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .or(z.literal('')),
    email: z.string().trim().email('Enter a valid email address').or(z.literal('')),
    dob: z.string().trim().or(z.literal('')),
    preferredLanguage: z.enum(['en', 'bn']),
    address: addressFieldsSchema,
  })
  .superRefine((data, ctx) => {
    if (data.dob) {
      const age = calculateAge(new Date(data.dob));
      if (Number.isNaN(age) || age < 18 || age > 40) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['dob'],
          message: 'Date of birth must correspond to an age between 18 and 40',
        });
      }
    }

    const { houseNoStreet, area, city, district, pinCode } = data.address;
    const filledCount = [houseNoStreet, area, city, district, pinCode].filter(
      (v) => v.length > 0
    ).length;

    if (filledCount > 0 && filledCount < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['address'],
        message: 'Fill in every address field, or leave the whole section empty',
      });
    }

    if (pinCode && !/^\d{6}$/.test(pinCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['address', 'pinCode'],
        message: 'PIN code must contain exactly 6 digits',
      });
    }
  });

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
