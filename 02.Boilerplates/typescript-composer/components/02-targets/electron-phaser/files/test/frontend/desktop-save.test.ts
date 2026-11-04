import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PersistenceApi } from '../../src/frontend/apis/persistence.api.js';
test('Desktop game Api validates loaded data and propagates IPC storage errors', async () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  let reply: unknown = { success: true, payload: { version: 1, score: 3 } };
  let saved: unknown;
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { gameSave: {
    load: async () => reply,
    save: async (value: unknown) => { saved = value; return reply; },
  } } });
  try {
    const api = new PersistenceApi();
    assert.equal((await api.load()).score, 3);
    await api.save({ version: 1, score: 4 }); assert.deepEqual(saved, { version: 1, score: 4 });
    reply = { success: true, payload: { version: 2, score: 0 } }; await assert.rejects(api.load());
    reply = { success: false, error: 'Unavailable' };
    await assert.rejects(api.load(), /Unavailable/); await assert.rejects(api.save({ version: 1, score: 1 }), /Unavailable/);
  } finally {
    if (previous) Object.defineProperty(globalThis, 'window', previous);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});
