import { z } from 'zod';

export const companyTypes = ['autonomo', 'startup', 'pyme', 'otra'] as const;

/** Error messages: keys of `form.errors` in the dictionary. */
export type ContactErrorKey = 'name' | 'email' | 'phone' | 'company' | 'message' | 'privacy';

/** Contact form schema, shared by the island and any future endpoint. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'name'),
  email: z.string().trim().pipe(z.email('email')),
  phone: z
    .string()
    .trim()
    .regex(/^$|^\+?[0-9 ()-]{7,20}$/, 'phone'),
  company: z.enum(companyTypes, { message: 'company' }),
  message: z.string().trim().min(10, 'message'),
  privacy: z.literal(true, { message: 'privacy' }),
});

export type ContactData = z.infer<typeof contactSchema>;
