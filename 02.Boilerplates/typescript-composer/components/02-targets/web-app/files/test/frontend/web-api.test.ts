import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Api } from '../../src/frontend/apis/api.js';

test('Web Api joins same-origin or external API base without duplicate slashes', async () => {
  for (const [base, expected] of [
    ['/api', '/api/greeting?name=World'],
    ['/api/', '/api/greeting?name=World'],
    ['https://api.example.com/v1/', 'https://api.example.com/v1/greeting?name=World'],
  ]) {
    const api = new Api(async (url, options) => {
      assert.equal(url, expected);
      assert(options?.signal instanceof AbortSignal);
      return new Response(JSON.stringify({ success: true, payload: { message: 'Hello' } }));
    }, base);
    assert.deepEqual(await api.get('/greeting?name=World'), { message: 'Hello' });
  }
});
