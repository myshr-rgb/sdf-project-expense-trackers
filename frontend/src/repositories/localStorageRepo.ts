import { defaultCategories, demoLedger } from '../lib/seed';
import type { User } from '../types/domain';
import { storageSchema, type StoredData } from './storageSchema';
import type { DataRepository, Profile } from './repository';

export const STORAGE_KEY = 'plumledger.v1';
export const DEMO_EMAIL = 'demo@plumledger.example';
function profile({ id, email, name }: User): Profile {
  return { id, email, name };
}
function owner(data: StoredData, id: string) {
  const account = data.accounts.find(
    (a) => a.user.id === id && data.activeId === id,
  );
  if (!account) throw new DOMException('Account unavailable.', 'NotFoundError');
  return account;
}

export class LocalStorageRepository implements DataRepository {
  subscribeToSessionChanges(listener: () => void) {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY || event.key === null) listener();
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }
  constructor(
    private readonly storage: () => Storage = () => window.localStorage,
  ) {}
  private read(): StoredData {
    const raw = this.storage().getItem(STORAGE_KEY);
    if (raw === null) return { version: 1, activeId: null, accounts: [] };
    return storageSchema.parse(JSON.parse(raw));
  }
  private async update<T>(change: (data: StoredData) => T): Promise<T> {
    const commit = () => {
      const data = this.read();
      const result = change(data);
      this.storage().setItem(
        STORAGE_KEY,
        JSON.stringify(storageSchema.parse(data)),
      );
      return result;
    };
    return globalThis.navigator?.locks
      ? navigator.locks.request(STORAGE_KEY, commit)
      : commit();
  }
  async session() {
    if (this.storage().getItem(STORAGE_KEY) === null)
      await this.update(() => undefined);
    const data = this.read();
    return data.activeId ? profile(owner(data, data.activeId).user) : null;
  }
  private create(data: StoredData, user: User, isDemo: boolean) {
    const ledger = isDemo
      ? demoLedger(user.id, new Date(user.createdAt))
      : { transactions: [], budgets: [] };
    data.accounts.push({ user, categories: defaultCategories(), ...ledger });
    data.activeId = user.id;
    return profile(user);
  }
  register(user: User) {
    return this.update((data) => {
      if (
        user.email === DEMO_EMAIL ||
        data.accounts.some((a) => a.user.email === user.email)
      )
        throw new Error('This email is unavailable.');
      return this.create(data, user, false);
    });
  }
  login(email: string, passwordHash: string) {
    return this.update((data) => {
      const account = data.accounts.find(
        (a) => a.user.email === email && a.user.passwordHash === passwordHash,
      );
      if (!account) throw new Error('Email or password is incorrect.');
      data.activeId = account.user.id;
      return profile(account.user);
    });
  }
  demo(user: User) {
    return this.update((data) => {
      if (user.email !== DEMO_EMAIL) throw new Error('Invalid demo account.');
      const account = data.accounts.find((a) => a.user.email === DEMO_EMAIL);
      if (!account) return this.create(data, user, true);
      data.activeId = account.user.id;
      return profile(account.user);
    });
  }
  async ledger(userId: string) {
    const { categories, transactions, budgets } = owner(this.read(), userId);
    return { categories, transactions, budgets };
  }
  logout(userId: string) {
    return this.update((data) => {
      owner(data, userId);
      data.activeId = null;
    });
  }
  deleteAccount(userId: string) {
    return this.update((data) => {
      owner(data, userId);
      data.accounts = data.accounts.filter((a) => a.user.id !== userId);
      data.activeId = null;
    });
  }
}
