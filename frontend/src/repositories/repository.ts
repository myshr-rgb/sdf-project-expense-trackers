import type { Budget, Category, Transaction, User } from '../types/domain';

export type Profile = Pick<User, 'id' | 'name' | 'email'>;
export interface Ledger {
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
}
export interface DataRepository {
  subscribeToSessionChanges(listener: () => void): () => void;
  session(): Promise<Profile | null>;
  register(user: User): Promise<Profile>;
  login(email: string, passwordHash: string): Promise<Profile>;
  demo(user: User): Promise<Profile>;
  ledger(userId: string): Promise<Ledger>;
  logout(userId: string): Promise<void>;
  deleteAccount(userId: string): Promise<void>;
}
