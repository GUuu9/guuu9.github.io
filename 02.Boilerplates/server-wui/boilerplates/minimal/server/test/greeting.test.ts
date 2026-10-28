import assert from 'node:assert/strict';
import { test } from 'node:test';
import { once } from 'node:events';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createApp } from '../src/core/web-server.js';
import { parseName } from '../src/utils/greeting.util.js';
import { GreetingRepository } from '../src/repository/greeting/greeting.repository.js';
import { FileService } from '../src/services/file/file.service.js';
import { Api } from '../../webui/src/api/api.js';
import { GreetingService } from '../../webui/src/scenes/greeting/greeting.service.js';
import { GreetingViewModel } from '../../webui/src/scenes/greeting/greeting.viewmodel.js';

test('HTTP greeting validates requests and returns success/error envelopes', async (context) => {
  const server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const address = server.address();
    assert(address && typeof address === 'object');
    const base = `http://127.0.0.1:${address.port}`;
    const response = await fetch(`${base}/api/greeting?name=World`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      success: true, payload: { message: 'Hello, World!' },
    });
    for (const query of ['', '?name=', '?name=%20', '?name=a&name=b', `?name=${'a'.repeat(41)}`]) {
      const invalid = await fetch(`${base}/api/greeting${query}`);
      assert.equal(invalid.status, 400);
      const body = await invalid.json();
      assert.equal(body.success, false);
      assert.equal(typeof body.payload, 'string');
    }
    assert.equal((await fetch(`${base}/api/missing`)).status, 404);
    const api = new Api((path, options) => fetch(`${base}${path}`, options));
    const vm = new GreetingViewModel(new GreetingService(api));
    vm.setName('Client');
    await vm.submit();
    assert.equal(vm.getSnapshot().message, 'Hello, Client!');
    vm.setName('');
    await vm.submit();
    assert.equal(vm.getSnapshot().error, 'Name must contain 1–40 characters.');
    assert.equal(vm.getSnapshot().name, '');
    const failure = new Error('Private configuration details');
    const log = context.mock.method(console, 'error', () => {});
    const prefix = context.mock.method(GreetingRepository.prototype, 'getPrefix', () => {
      throw failure;
    });
    try {
      const failed = await fetch(`${base}/api/greeting?name=World`);
      assert.equal(failed.status, 500);
      assert.deepEqual(await failed.json(), {
        success: false, payload: 'Internal server error.',
      });
      assert.equal(log.mock.calls[0]?.arguments[0], failure);
    } finally {
      prefix.mock.restore();
      log.mock.restore();
    }
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
});

test('Utils normalize names and Repository validates config', () => {
  assert.equal(parseName(' World '), 'World');
  for (const value of [null, 1, [], ' ', 'a'.repeat(41)]) {
    assert.equal(parseName(value), null);
  }
  assert.equal(new GreetingRepository({ prefix: ' Hi ' }).getPrefix(), 'Hi');
  for (const value of [null, {}, { prefix: '' }, { prefix: 1 }]) {
    assert.throws(() => new GreetingRepository(value), /Invalid greeting config/);
  }
});

test('FileService reads JSON and propagates missing/malformed config errors', () => {
  const directory = mkdtempSync(join(tmpdir(), 'minimal-config-'));
  try {
    const path = join(directory, 'config.json');
    const url = pathToFileURL(path);
    const file = new FileService();
    assert.throws(() => file.readJson(url));
    writeFileSync(path, '{broken');
    assert.throws(() => file.readJson(url), SyntaxError);
    writeFileSync(path, '{"prefix":"Hi"}');
    assert.deepEqual(file.readJson(url), { prefix: 'Hi' });
  } finally {
    rmSync(directory, { recursive: true });
  }
});
