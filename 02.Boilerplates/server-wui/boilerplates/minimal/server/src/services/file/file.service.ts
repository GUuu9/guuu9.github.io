import { readFileSync } from 'node:fs';

export class FileService {
  readJson(path: URL): unknown {
    return JSON.parse(readFileSync(path, 'utf8'));
  }
}
