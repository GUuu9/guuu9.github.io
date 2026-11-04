import { it, expect } from 'vitest';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PersistenceService } from './persistence.service.js';
it('초기값, 저장 복원과 손상 데이터 거부', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'game-save-'));
  try {
    const service = new PersistenceService(directory);
    expect(await service.load()).toEqual({ version: 1, score: 0 });
    await service.save({ version: 1, score: 7 });
    expect(await new PersistenceService(directory).load()).toEqual({ version: 1, score: 7 });
    expect(() => service.save({ version: 1, score: -1 })).toThrow();
    await writeFile(path.join(directory, 'save.json'), '{}');
    await expect(service.load()).rejects.toThrow();
  } finally { await rm(directory, { recursive: true, force: true }); }
});
