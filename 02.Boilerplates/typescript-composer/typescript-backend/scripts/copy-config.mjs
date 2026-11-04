import { cpSync } from 'node:fs';

cpSync(
  new URL('../src/backend/config/', import.meta.url),
  new URL('../dist/backend/config/', import.meta.url),
  { recursive: true },
);
