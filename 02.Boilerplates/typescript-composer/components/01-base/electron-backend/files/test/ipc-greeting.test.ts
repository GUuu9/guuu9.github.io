import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDI } from '../src/backend/core/di.js';
import { handleGreetingIpc } from '../src/backend/bridge/greeting/greeting.handler.js';
test('IPC checks trust, validates names and hides internal failures', context => {
  const usecase = createDI().greetingUsecase;
  assert.equal(handleGreetingIpc(false, 'World', usecase).success, false);
  assert.equal(handleGreetingIpc(true, '', usecase).success, false);
  assert.deepEqual(handleGreetingIpc(true, 'World', usecase), { success: true, payload: { message: 'Hello, World!' } });
  context.mock.method(console, 'error', () => {});
  context.mock.method(usecase, 'greet', () => { throw new Error('secret'); });
  const failed = handleGreetingIpc(true, 'World', usecase);
  assert.equal(failed.success, false); assert(!JSON.stringify(failed).includes('secret'));
});
