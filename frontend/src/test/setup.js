import { cleanup } from '@testing-library/react';
import { webcrypto } from 'node:crypto';
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => vi.stubGlobal('crypto', webcrypto));

afterEach(() => {
  cleanup();
  globalThis.localStorage.clear();
  vi.unstubAllGlobals();
});
