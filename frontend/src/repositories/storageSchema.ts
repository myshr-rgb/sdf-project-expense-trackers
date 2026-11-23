import { z } from 'zod';
import { asPaise } from '../lib/money';
const kind = z.enum(['income', 'expense']);
const amount = z.int().positive().transform(asPaise);
const category = z.object({
  id: z.string(),
  name: z.string(),
  kind,
  icon: z.string(),
  colorToken: z.string(),
});
const transaction = z.object({
  id: z.string(),
  userId: z.string(),
  type: kind,
  title: z.string(),
  categoryId: z.string(),
  amountPaise: amount,
  occurredOn: z.iso.date(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  note: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurrenceDay: z.int().min(1).max(31).optional(),
});
const budget = z.object({
  id: z.string(),
  userId: z.string(),
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  categoryId: z.string().nullable(),
  limitPaise: amount,
  alertThresholdPct: z.union([z.literal(80), z.literal(90), z.literal(100)]),
});
const user = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.email(),
  passwordHash: z.string().regex(/^[a-f0-9]{64}$/),
  consentedAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});
const account = z.object({
  user,
  categories: z.array(category),
  transactions: z.array(transaction),
  budgets: z.array(budget),
});
export const storageSchema = z.object({
  version: z.literal(1),
  activeId: z.string().nullable(),
  accounts: z.array(account),
});
export type StoredData = z.infer<typeof storageSchema>;
