import { todayISO } from './date';
import { asPaise } from './money';
import type { Category, Transaction, Budget } from '../types/domain';

const defaults = [
  ['Food', 'restaurant'],
  ['Transportation', 'directions_bus'],
  ['Education', 'school'],
  ['Shopping', 'shopping_bag'],
  ['Entertainment', 'movie'],
  ['Bills', 'receipt_long'],
  ['Income', 'payments'],
] as const;

export function defaultCategories(): Category[] {
  return defaults.map(([name, icon]) => ({
    id: name.toLowerCase(),
    name,
    icon,
    kind: name === 'Income' ? 'income' : 'expense',
    colorToken: 'peach-cream',
  }));
}

export function demoLedger(userId: string, now: Date) {
  const occurredOn = todayISO(now);
  const createdAt = now.toISOString();
  const rows: [string, string, number][] = [
    ['Monthly allowance', 'income', 2000000],
    ['Freelance project', 'income', 800000],
    ['Meals and groceries', 'food', 420000],
    ['Bus pass', 'transportation', 125000],
    ['Course books', 'education', 180000],
    ['Clothes', 'shopping', 160000],
    ['Movie tickets', 'entertainment', 90000],
    ['Hostel and Wi-Fi', 'bills', 400000],
  ];
  const transactions: Transaction[] = rows.map(
    ([title, categoryId, amount]) => ({
      id: crypto.randomUUID(),
      userId,
      title,
      categoryId,
      type: categoryId === 'income' ? 'income' : 'expense',
      amountPaise: asPaise(amount),
      occurredOn,
      createdAt,
      updatedAt: createdAt,
    }),
  );
  const budgets: Budget[] = [
    {
      id: crypto.randomUUID(),
      userId,
      month: occurredOn.slice(0, 7),
      categoryId: null,
      limitPaise: asPaise(2000000),
      alertThresholdPct: 80,
    },
  ];
  return { transactions, budgets };
}
