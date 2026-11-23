import { describe, expect, it } from 'vitest';
import { asPaise, parseRupees } from '../lib/money';
import { formatINR } from '../lib/format';

describe('NFR8 integer paise', () => {
  it.each([
    ['0', 0],
    [' 1.2 ', 120],
    ['19.99', 1999],
    ['0.01', 1],
  ])('converts %s exactly', (value, expected) =>
    expect(parseRupees(String(value))).toBe(expected),
  );
  it.each(['', '-1', '1e2', '1.005', '90071992547409.92'])(
    'rejects %j',
    (value) => {
      expect(() => parseRupees(value)).toThrow(RangeError);
    },
  );
  it('rejects fractional paise', () =>
    expect(() => asPaise(1.5)).toThrow(RangeError));
  it.each([
    [12500000, '₹1,25,000'],
    [-1, '-₹0.01'],
    [0, '₹0'],
    [Number.MAX_SAFE_INTEGER, '₹9,00,71,99,25,47,409.91'],
  ])('formats %s paise for display', (value, expected) =>
    expect(formatINR(asPaise(Number(value)))).toBe(expected),
  );
});
