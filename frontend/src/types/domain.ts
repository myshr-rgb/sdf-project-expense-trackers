import type { Paise } from '../lib/money';

export type TransactionKind = 'expense' | 'income';
export type AlertThreshold = 80 | 90 | 100;

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  consentedAt: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  kind: TransactionKind;
  icon: string;
  colorToken: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionKind;
  title: string;
  amountPaise: Paise;
  categoryId: string;
  occurredOn: string;
  note?: string;
  isRecurring?: boolean;
  recurrenceDay?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  month: string;
  categoryId: string | null;
  limitPaise: Paise;
  alertThresholdPct: AlertThreshold;
}

export interface Notification {
  id: string;
  userId: string;
  kind: 'budget_warning' | 'budget_exceeded' | 'insight';
  message: string;
  budgetId?: string;
  readAt?: string;
  createdAt: string;
  dedupeKey: string;
}

export interface InsightSnapshot {
  month: string;
  healthScore: number;
  healthDelta: number;
  potentialSavingsPaise: Paise;
  insights: { title: string; evidence: string }[];
  recommendations: {
    id: string;
    categoryId: string;
    title: string;
    savingPaise: Paise;
    explanation: string;
    action: { kind: 'set_monthly_cap'; limitPaise: Paise };
  }[];
}
