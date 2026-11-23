import { z } from 'zod';
import type { DataRepository } from '../repositories/repository';
import {
  DEMO_EMAIL,
  LocalStorageRepository,
} from '../repositories/localStorageRepo';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Enter a valid email address.')),
  password: z.string().min(1, 'Enter your password.'),
});
export const registrationSchema = loginSchema.extend({
  name: z.string().trim().min(1, 'Enter your name.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
  consent: z
    .boolean()
    .refine((value) => value, 'Consent is required to create an account.'),
});
export type AuthFields = z.input<typeof registrationSchema>;

async function hash(password: string) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(password),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}
async function makeUser(name: string, email: string, password: string) {
  const timestamp = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: await hash(password),
    createdAt: timestamp,
    consentedAt: timestamp,
  };
}
export class AuthService {
  subscribeToSessionChanges(listener: () => void) {
    return this.repository.subscribeToSessionChanges(listener);
  }
  constructor(private readonly repository: DataRepository) {}
  session() {
    return this.repository.session();
  }
  async register(input: AuthFields) {
    const { name, email, password } = registrationSchema.parse(input);
    return this.repository.register(await makeUser(name, email, password));
  }
  async login(input: z.input<typeof loginSchema>) {
    const { email, password } = loginSchema.parse(input);
    return this.repository.login(email, await hash(password));
  }
  async demo() {
    return this.repository.demo(
      await makeUser('Demo Student', DEMO_EMAIL, crypto.randomUUID()),
    );
  }
  logout(id: string) {
    return this.repository.logout(id);
  }
  deleteAccount(id: string) {
    return this.repository.deleteAccount(id);
  }
}
export const authService = new AuthService(new LocalStorageRepository());
