import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Api } from '../src/api/api.js';
import { GreetingService } from '../src/scenes/greeting/greeting.service.js';
import { GreetingViewModel } from '../src/scenes/greeting/greeting.viewmodel.js';

test('Service encodes names and rejects invalid payloads', async () => {
  const service = new GreetingService({ get: async (path) => {
    assert.equal(path, '/greeting?name=A%26B');
    return { message: 'Hello, A&B!' };
  } });
  assert.equal(await service.greet('A&B'), 'Hello, A&B!');
  await assert.rejects(new GreetingService({ get: async () => ({ message: 1 }) }).greet('A'));
});

test('Api propagates errors and validates envelopes', async () => {
  const api = new Api(async () => new Response(JSON.stringify({
    success: false, payload: 'Invalid name.',
  }), { status: 400 }));
  await assert.rejects(api.get('/greeting'), /Invalid name/);
  await assert.rejects(new Api(async () => new Response('{}')).get('/greeting'), /Invalid API/);
});

test('ViewModel blocks duplicate submissions and preserves input on failure', async () => {
  let finish!: (message: string) => void;
  let calls = 0;
  const vm = new GreetingViewModel({ greet: () => {
    calls++;
    return new Promise<string>((resolve) => { finish = resolve; });
  } });
  const pending = vm.submit();
  assert.equal(vm.getSnapshot().loading, true);
  await vm.submit();
  assert.equal(calls, 1);
  finish('Hello, World!');
  await pending;
  assert.equal(vm.getSnapshot().message, 'Hello, World!');
  assert.equal(vm.getSnapshot().loading, false);
  const failed = new GreetingViewModel({ greet: async () => { throw new Error('Unavailable'); } });
  failed.setName('Draft');
  await failed.submit();
  assert.equal(failed.getSnapshot().name, 'Draft');
  assert.equal(failed.getSnapshot().error, 'Unavailable');
  assert.equal(failed.getSnapshot().loading, false);
});

test('Communication failures release loading and allow retry', async () => {
  for (const failure of [new TypeError('Network unavailable'), new DOMException('Timed out', 'TimeoutError')]) {
    let calls = 0;
    const api = new Api(async (_path, options) => {
      assert(options?.signal instanceof AbortSignal);
      if (calls++ === 0) throw failure;
      return new Response(JSON.stringify({ success: true, payload: { message: 'Recovered' } }));
    });
    const vm = new GreetingViewModel(new GreetingService(api));
    vm.setName('Draft');
    await vm.submit();
    assert.equal(vm.getSnapshot().loading, false);
    assert.equal(vm.getSnapshot().name, 'Draft');
    assert.equal(vm.getSnapshot().error, failure.message);
    await vm.submit();
    assert.equal(vm.getSnapshot().message, 'Recovered');
    assert.equal(vm.getSnapshot().error, '');
    assert.equal(vm.getSnapshot().loading, false);
  }
  await assert.rejects(new Api(async () => new Response('<html>Error</html>', {
    status: 502,
  })).get('/greeting'), SyntaxError);
});
