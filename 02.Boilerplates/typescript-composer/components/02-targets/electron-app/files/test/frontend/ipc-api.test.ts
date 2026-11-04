import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Api } from '../../src/frontend/apis/api.js';
test('IPC Api sends decoded names and propagates failures', async () => {
  const api = new Api(async name => { assert.equal(name, 'A&B'); return { success: true, payload: { message: 'Hi' } }; });
  assert.deepEqual(await api.get('/greeting?name=A%26B'), { message: 'Hi' });
  await assert.rejects(api.get('/missing'), /허용/);
  await assert.rejects(new Api(async () => ({ success: false, error: 'Denied' })).get('/greeting'), /Denied/);
});
