import express from 'express';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function createFrontendRouter(directory = new URL('../../frontend/', import.meta.url)) {
  if (!statSync(new URL('index.html', directory)).isFile()) {
    throw new Error('Frontend index.html is missing. Build the frontend first.');
  }
  return express.static(fileURLToPath(directory), {
    dotfiles: 'ignore',
    redirect: false,
  });
}
