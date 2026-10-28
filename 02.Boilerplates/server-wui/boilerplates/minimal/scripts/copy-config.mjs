import { cpSync } from 'node:fs';

cpSync(
  new URL('../server/src/config/', import.meta.url),
  new URL('../dist/server/config/', import.meta.url),
  { recursive: true },
);
