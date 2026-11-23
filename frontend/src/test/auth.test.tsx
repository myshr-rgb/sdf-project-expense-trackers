import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from '@testing-library/react';
import App from '../App';
import {
  LocalStorageRepository,
  STORAGE_KEY,
} from '../repositories/localStorageRepo';
import { AuthService } from '../services/authService';

const repo = new LocalStorageRepository();
const auth = new AuthService(repo);
const fields = {
  name: ' Tara Rao ',
  email: ' TARA@example.com ',
  password: 'Example 123',
  consent: true,
};
beforeEach(() => {
  window.history.replaceState(null, '', '/');
});
afterEach(() => {
  vi.restoreAllMocks();
});

it('NFR9 initializes versioned storage and seeds seven categories for each new account', async () => {
  expect(await repo.session()).toBeNull();
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({
    version: 1,
    activeId: null,
    accounts: [],
  });
  const user = await auth.register(fields);
  expect((await repo.ledger(user.id)).categories.map((c) => c.name)).toEqual([
    'Food',
    'Transportation',
    'Education',
    'Shopping',
    'Entertainment',
    'Bills',
    'Income',
  ]);
  expect((await repo.ledger(user.id)).transactions).toEqual([]);
});
it('FR1 / NFR1 normalizes credentials, hashes passwords, records consent and persists sessions', async () => {
  const profile = await auth.register(fields);
  expect(profile).toEqual({
    id: expect.any(String),
    email: 'tara@example.com',
    name: 'Tara Rao',
  });
  const raw = localStorage.getItem(STORAGE_KEY)!;
  expect(raw).not.toContain(fields.password);
  expect(JSON.parse(raw).accounts[0].user).toMatchObject({
    passwordHash: expect.stringMatching(/^[a-f0-9]{64}$/),
    consentedAt: expect.stringMatching(/^\d{4}-/),
  });
  expect(await new LocalStorageRepository().session()).toEqual(profile);
  await expect(auth.register(fields)).rejects.toThrow('unavailable');
  await auth.logout(profile.id);
  for (const email of ['wrong@example.com', fields.email])
    await expect(auth.login({ email, password: 'wrong' })).rejects.toThrow(
      'Email or password is incorrect.',
    );
  expect(await repo.session()).toBeNull();
  expect(await auth.login(fields)).toEqual(profile);
});
it.each([
  { email: 'bad' },
  { password: 'short' },
  { name: ' ' },
  { consent: false },
])('NFR1 rejects invalid registration %o before writing', async (change) => {
  await expect(auth.register({ ...fields, ...change })).rejects.toThrow();
  expect(localStorage.length).toBe(0);
});
it('NFR9 isolates accounts and wipes the deleted account with its demo ledger', async () => {
  const owner = await auth.register(fields);
  await auth.logout(owner.id);
  const demo = await auth.demo();
  expect(await auth.demo()).toEqual(demo);
  const ledger = await repo.ledger(demo.id);
  const sum = (type: 'income' | 'expense') =>
    ledger.transactions
      .filter((t) => t.type === type)
      .reduce((total, t) => total + t.amountPaise, 0);
  expect(sum('income')).toBe(2800000);
  expect(sum('expense')).toBe(1375000);
  await expect(repo.ledger(owner.id)).rejects.toMatchObject({
    name: 'NotFoundError',
  });
  await expect(auth.deleteAccount(owner.id)).rejects.toMatchObject({
    name: 'NotFoundError',
  });
  await auth.deleteAccount(demo.id);
  expect(await auth.session()).toBeNull();
  expect(localStorage.getItem(STORAGE_KEY)).not.toContain(demo.id);
  expect(await auth.login(fields)).toEqual(owner);
});
it('NFR4 preserves unrecognized storage without overwriting it', async () => {
  localStorage.setItem(STORAGE_KEY, '{"version":2}');
  await expect(auth.session()).rejects.toThrow();
  await expect(auth.register(fields)).rejects.toThrow();
  expect(localStorage.getItem(STORAGE_KEY)).toBe('{"version":2}');
});
it('FR1 guards deep links, validates registration, returns to the route, then logs out', async () => {
  window.history.replaceState(null, '', '/budgets');
  render(<App />);
  fireEvent.click(
    await screen.findByRole('button', { name: 'Create Account' }),
  );
  fireEvent.click(
    screen.getByRole('button', { name: 'Create PlumLedger Account' }),
  );
  expect(
    await screen.findByText('Consent is required to create an account.'),
  ).toBeTruthy();
  fireEvent.change(screen.getByLabelText('Full Name'), {
    target: { value: fields.name },
  });
  fireEvent.change(screen.getByLabelText('Email Address'), {
    target: { value: fields.email },
  });
  const password = screen.getByLabelText('Password');
  fireEvent.change(password, { target: { value: fields.password } });
  fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
  expect(password.getAttribute('type')).toBe('text');
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(
    screen.getByRole('button', { name: 'Create PlumLedger Account' }),
  );
  expect(
    await screen.findByRole('heading', { name: 'Budgets & Alerts' }),
  ).toBeTruthy();
  expect(screen.getByText('Hello, Tara!')).toBeTruthy();
  const sidebar = within(screen.getByRole('complementary'));
  fireEvent.click(sidebar.getByText('Reports'));
  expect(
    await screen.findByRole('heading', { name: 'Spending Reports' }),
  ).toBeTruthy();
  fireEvent.click(sidebar.getByLabelText('Account settings'));
  fireEvent.click(sidebar.getByRole('button', { name: 'Log out' }));
  expect(await screen.findByText('Welcome back')).toBeTruthy();
  await waitFor(() => expect(window.location.pathname).toBe('/sign-in'));
});
it('FR1 starts a demo in one click and confirms deletion', async () => {
  render(<App />);
  fireEvent.click(
    await screen.findByRole('button', { name: 'Use Demo Account' }),
  );
  expect(await screen.findByText('Hello, Demo!')).toBeTruthy();
  const sidebar = within(screen.getByRole('complementary'));
  fireEvent.click(sidebar.getByLabelText('Account settings'));
  const confirm = vi
    .spyOn(window, 'confirm')
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true);
  fireEvent.click(
    sidebar.getByRole('button', { name: 'Delete account and data' }),
  );
  expect(await repo.session()).not.toBeNull();
  fireEvent.click(
    sidebar.getByRole('button', { name: 'Delete account and data' }),
  );
  expect(await screen.findByText('Welcome back')).toBeTruthy();
  expect(confirm).toHaveBeenCalledTimes(2);
  expect(await screen.findByText('Account and data deleted.')).toBeTruthy();
});

it('FR1 shows a generic login error and opens the dashboard with valid credentials', async () => {
  const user = await auth.register(fields);
  await auth.logout(user.id);
  render(<App />);
  const email = await screen.findByLabelText('Email Address');
  fireEvent.change(email, { target: { value: user.email } });
  const password = screen.getByLabelText('Password');
  fireEvent.change(password, { target: { value: 'wrong' } });
  fireEvent.click(
    screen.getByRole('button', { name: 'Sign In to PlumLedger' }),
  );
  expect(
    await screen.findByText('Email or password is incorrect.'),
  ).toBeTruthy();
  fireEvent.change(password, { target: { value: fields.password } });
  fireEvent.click(
    screen.getByRole('button', { name: 'Sign In to PlumLedger' }),
  );
  expect(
    await screen.findByRole('heading', { name: 'Financial Overview' }),
  ).toBeTruthy();
});
