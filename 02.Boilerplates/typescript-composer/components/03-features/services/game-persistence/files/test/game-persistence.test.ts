import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDI } from '../src/backend/core/di.js';
import { PersistenceService } from '../src/backend/services/persistence/persistence.service.js';
test('Game storage serializes writes, restores values and preserves corrupt data', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'desktop-save-'));
  try {
    const service = new PersistenceService(directory);
    assert.equal((await service.load()).score, 0);
    await Promise.all([service.save({ version: 1, score: 1 }), service.save({ version: 1, score: 2 })]);
    await service.flush(); assert.equal((await service.load()).score, 2);
    await writeFile(join(directory, 'save.json'), '{broken');
    await assert.rejects(service.load()); assert.equal(await readFile(join(directory, 'save.json'), 'utf8'), '{broken');
    assert.throws(() => service.save({ version: 1, score: -1 }));
  } finally { await rm(directory, { recursive: true }); }
});

test('Feature DI keeps greeting and injects the selected data directory', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'feature-di-'));
  try {
    const dependencies = createDI(directory);
    assert.equal(dependencies.greetingUsecase.greet('World').message, 'Hello, World!');
    await dependencies.gamePersistence.save({ version: 1, score: 5 });
    assert.equal((await new PersistenceService(directory).load()).score, 5);
  } finally { await rm(directory, { recursive: true }); }
});
