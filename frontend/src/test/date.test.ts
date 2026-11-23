import { expect, it } from 'vitest';
import { currentMonth, todayISO } from '../lib/date';
import { formatDate } from '../lib/format';

it('NFR8 uses Kolkata midnight for the new year and month', () => {
  const before = new Date('2026-12-31T18:29:59Z');
  const after = new Date('2026-12-31T18:30:00Z');
  expect(todayISO(before)).toBe('2026-12-31');
  expect(todayISO(after)).toBe('2027-01-01');
  expect(currentMonth(after)).toBe('2027-01');
});
it('NFR3 displays a stored calendar date in Indian format', () => {
  expect(formatDate('2024-02-29')).toBe('29 Feb 2024');
});
it.each(['2025-02-29', '2026-13-01', '11/24/2026'])(
  'NFR8 rejects invalid date %s',
  (date) => {
    expect(() => formatDate(date)).toThrow(RangeError);
  },
);
