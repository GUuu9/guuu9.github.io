import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PersistenceApi, SAVE_KEY } from '../../src/frontend/apis/persistence.api.js';

test('Browser persistence restores saved score and preserves corrupt data on failure', async () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  const api = new PersistenceApi(storage);
  assert.equal((await api.load()).score, 0);
  await api.save({ version: 1, score: 9 });
  assert.equal((await new PersistenceApi(storage).load()).score, 9);
  for (const broken of ['{broken', '{"version":2,"score":4}', '{"version":1,"score":-1}']) {
    values.set(SAVE_KEY, broken);
    await assert.rejects(api.load()); assert.equal(values.get(SAVE_KEY), broken);
  }
});
test('Storage failures propagate instead of reporting success', async () => {
  const api = new PersistenceApi({ getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('quota'); } });
  await assert.rejects(api.load(), /blocked/);
  await assert.rejects(api.save({ version: 1, score: 1 }), /quota/);
});
