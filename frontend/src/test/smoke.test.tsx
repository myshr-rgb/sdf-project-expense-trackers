import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import App from '../App';

it('NFR6 renders the PlumLedger entry point', async () => {
  render(<App />);
  expect(await screen.findByText('PlumLedger')).toBeTruthy();
});
