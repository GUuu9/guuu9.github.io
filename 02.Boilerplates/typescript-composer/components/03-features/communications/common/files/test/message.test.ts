import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDI } from '../src/backend/core/di.js';
import { handleGreetingMessage } from '../src/backend/bridge/greeting/message.js';
test('Message boundary validates JSON, size and names and hides failures', context => {
  const usecase = createDI().greetingUsecase;
  assert.equal(handleGreetingMessage(Buffer.from('{"name":"World"}'), usecase).success, true);
  for (const raw of ['{broken', '{}', '{"name":[]}', 'x'.repeat(4097)]) assert.equal(handleGreetingMessage(Buffer.from(raw), usecase).success, false);
  context.mock.method(console, 'error', () => {}); context.mock.method(usecase, 'greet', () => { throw new Error('private'); });
  const failed = handleGreetingMessage(Buffer.from('{"name":"World"}'), usecase);
  assert.equal(failed.success, false); assert(!JSON.stringify(failed).includes('private'));
});
