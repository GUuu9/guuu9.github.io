import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createApp } from '../src/backend/core/web-server.js';
import { createDI } from '../src/backend/core/di.js';
import { createFrontendRouter } from '../src/backend/core/frontend.js';

test('Web UI and API keep separate response and error paths', async () => {
  const server = createApp(createDI()).listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const address = server.address();
    assert(address && typeof address === 'object');
    const base = `http://127.0.0.1:${address.port}`;
    const page = await fetch(base);
    assert.equal(page.status, 200);
    assert.match(page.headers.get('content-type') ?? '', /text\/html/);
    assert.match(await page.text(), /id="app"/);
    assert.equal((await fetch(`${base}/api/greeting?name=World`)).status, 200);
    assert.equal((await fetch(`${base}/api/greeting?name=`)).status, 400);
    const missing = await fetch(`${base}/api/missing`);
    assert.equal(missing.status, 404);
    assert.deepEqual(await missing.json(), { success: false, payload: 'API not found.' });
    for (const path of ['/missing-page', '/assets/missing.js', '/.env', '/%2eenv']) {
      assert.equal((await fetch(`${base}${path}`)).status, 404);
    }
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});

test('Missing frontend index fails during assembly', () => {
  const directory = mkdtempSync(join(tmpdir(), 'frontend-missing-'));
  try {
    assert.throws(() => createFrontendRouter(pathToFileURL(`${directory}/`)));
  } finally {
    rmSync(directory, { recursive: true });
  }
});
