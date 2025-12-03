import { z } from 'zod';

export const zodSchema = z.object({
  fullName: z
    .string()
    .trim()
    .regex(/^[\p{L} '-]+(?:\s+[\p{L} '-]+)+$/u, {
      message: 'Please enter your full name.',
    })
    .min(1, { message: 'Full name is required.' }),

  firstName: z
    .string()
    .trim()
    .regex(/^[\p{L} '-]+$/u, { message: 'Invalid characters in first name.' })
    .min(1, { message: 'First name is required.' }),

  lastName: z
    .string()
    .trim()
    .regex(/^[\p{L} '-]+$/u, { message: 'Invalid characters in last name.' })
    .min(1, { message: 'Last name is required.' }),

  dateOfBirth: z.date().refine(
    (dob) => {
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();

      const hasHadBirthdayThisYear =
        today.getMonth() > dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

      if (!hasHadBirthdayThisYear) age -= 1;
      return age >= 18;
    },
    { message: 'You must be at least 18 years old.' }
  ),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .refine((val) => /[A-Za-z]/.test(val), {
      message: 'Password must contain a letter.',
    })
    .refine((val) => /\d/.test(val), {
      message: 'Password must contain a digit.',
    })
    .refine((val) => /[@$!%*?&]/.test(val), {
      message: 'Password must contain a special character.',
    }),

  agency: z.string().trim().optional(),
  role: z.string().trim().optional(),

  website: z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (val === '') return;
      try {
        new URL(val);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid website URL.',
        });
      }
    })
    .optional(),

  emailAddress: z.string().trim().email({ message: 'Invalid email address.' }),

  phoneNumber: z.preprocess(
    (val) => {
      if (typeof val === 'string' && val.trim() === '') return undefined;
      return val;
    },
    z
      .string()
      .transform((val) => val.replace(/\D/g, ''))
      .refine((digits) => digits.length >= 10, {
        message: 'Phone number must have at least 10 digits.',
      })
      .optional()
  ),

  message: z.string().trim().min(5, { message: 'Please type your inquiry.' }),

  tos: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms.',
  }),

  inquiryTitle: z.string().refine((val) => val !== 'Select A Title', {
    message: 'Please select an inquiry title.',
  }),

  bookingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Date must be in YYYY-MM-DD format.',
    })
    .refine(
      (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      {
        message: 'Invalid date.',
      }
    ),
});

export type Schema = z.infer<typeof zodSchema>;

export const contactSchema = z.object({
  firstName: zodSchema.shape.firstName,
  lastName: zodSchema.shape.lastName,
  phoneNumber: zodSchema.shape.phoneNumber,
  emailAddress: zodSchema.shape.emailAddress,
  business: zodSchema.shape.agency,
  role: zodSchema.shape.role,
  message: zodSchema.shape.message,
});

export const registrationSchema = z
  .object({
    firstName: zodSchema.shape.firstName,
    lastName: zodSchema.shape.lastName,
    emailAddress: zodSchema.shape.emailAddress,
    password: zodSchema.shape.password,
    passwordConfirmation: z.string().min(1, 'Please retype your password.'),
    tos: zodSchema.shape.tos,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Passwords must match',
  });

export const loginSchema = z.object({
  emailAddress: zodSchema.shape.emailAddress,
  password: zodSchema.shape.password,
});
