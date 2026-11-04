import { cpSync } from 'node:fs';
cpSync(new URL('../desktop-shell/', import.meta.url), new URL('../dist/frontend/', import.meta.url), { recursive: true });
