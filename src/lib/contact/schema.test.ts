import { describe, expect, it } from 'vitest';
import { contactSchema } from './schema';

const valid = {
  name: 'Sara Keller',
  email: 'sara@atelier-keller.ch',
  phone: '+41 44 512 30 00',
  company: 'pyme',
  message: 'Necesito ayuda con el IVA del trimestre.',
  privacy: true,
};

describe('contact schema', () => {
  it('accepts a complete form; phone is optional', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, phone: '' }).success).toBe(true);
  });
  it('returns the dictionary key of each error', () => {
    const r = contactSchema.safeParse({
      ...valid,
      email: 'sara',
      phone: 'abc',
      message: 'hola',
      privacy: false,
    });
    expect(r.success).toBe(false);
    const keys = r.success ? [] : r.error.issues.map((i) => i.message).sort();
    expect(keys).toEqual(['email', 'message', 'phone', 'privacy']);
  });
});
