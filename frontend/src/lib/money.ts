export type Paise = number & { readonly __unit: 'paise' };

export function asPaise(value: number): Paise {
  if (!Number.isSafeInteger(value))
    throw new RangeError('Expected integer paise');
  return value as Paise;
}

// Parse the form's decimal string before any floating-point conversion.
export function parseRupees(input: string): Paise {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(input.trim());
  if (!match)
    throw new RangeError('Enter a rupee amount with up to two decimal places');
  const [, whole, fraction = ''] = match;
  return asPaise(Number(whole + fraction.padEnd(2, '0')));
}
