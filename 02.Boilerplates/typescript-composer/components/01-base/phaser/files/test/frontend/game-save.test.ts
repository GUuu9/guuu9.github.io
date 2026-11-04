import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseGameSave } from '../../src/frontend/scenes/main/main.model.js';

test('Game save validates version and safe nonnegative score', () => {
  assert.deepEqual(parseGameSave({ version: 1, score: 4 }), { version: 1, score: 4 });
  for (const value of [null, {}, { version: 2, score: 1 }, { version: 1, score: -1 }, { version: 1, score: 0.5 }, { version: 1, score: Number.MAX_SAFE_INTEGER + 1 }]) {
    assert.throws(() => parseGameSave(value));
  }
});
