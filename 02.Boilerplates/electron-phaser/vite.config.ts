import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(root, 'src/renderer/src'),
  base: './',
  build: {
    outDir: path.resolve(root, 'dist/renderer'),
    emptyOutDir: true,
  },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
});
