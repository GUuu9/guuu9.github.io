import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { parseGameSave, type GameSave } from '../../../shared/ipc/persistence.js';

export class PersistenceService {
  private pending: Promise<void> = Promise.resolve();
  constructor(private readonly directory: string) {}
  async load(): Promise<GameSave> {
    try { return parseGameSave(JSON.parse(await readFile(path.join(this.directory, 'save.json'), 'utf8'))); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { version: 1, score: 0 };
      throw error;
    }
  }
  save(value: unknown): Promise<void> {
    const data = parseGameSave(value);
    const operation = this.pending.then(async () => {
      await mkdir(this.directory, { recursive: true });
      const file = path.join(this.directory, 'save.json');
      await writeFile(file + '.tmp', JSON.stringify(data), 'utf8');
      await rename(file + '.tmp', file);
    });
    this.pending = operation.catch(() => {});
    return operation;
  }
}
