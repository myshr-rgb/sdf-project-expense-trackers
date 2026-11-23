import type { Paise } from './money';

const digits = new Intl.NumberFormat('en-IN');
const dateLabel = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function formatINR(amount: Paise): string {
  const magnitude = BigInt(Math.abs(amount));
  const remainder = magnitude % 100n;
  const fraction =
    remainder === 0n ? '' : '.' + String(remainder).padStart(2, '0');
  return `${amount < 0 ? '-' : ''}₹${digits.format(magnitude / 100n)}${fraction}`;
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00Z');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(isoDate) ||
    Number.isNaN(date.getTime()) ||
    !date.toISOString().startsWith(isoDate)
  ) {
    throw new RangeError('Expected a valid YYYY-MM-DD date');
  }
  return dateLabel.format(date);
}
