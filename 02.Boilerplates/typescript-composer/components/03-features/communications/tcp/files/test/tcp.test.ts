import assert from 'node:assert/strict';
import { test } from 'node:test';
import { once } from 'node:events';
import { connect } from 'node:net';
import { createDI } from '../src/backend/core/di.js';
import { createGreetingTcp } from '../src/backend/core/tcp.js';
test('TCP assembles fragmented lines and rejects oversized buffered input', { timeout: 5000 }, async () => {
  const { server, close } = createGreetingTcp(createDI().greetingUsecase);
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const address = server.address(); assert(address && typeof address === 'object');
  const client = connect(address.port, '127.0.0.1');
  try {
    await once(client, 'connect');
    const reply = once(client, 'data'); client.write('{"na'); client.write('me":"World"}\n');
    assert.equal(JSON.parse(String((await reply)[0])).success, true);
    const invalid = once(client, 'data'); client.write('{bad}\n'); assert.equal(JSON.parse(String((await invalid)[0])).success, false);
    const oversized = once(client, 'data'); client.write('x'.repeat(4097)); assert.equal(JSON.parse(String((await oversized)[0])).payload, 'Message too large.');
  } finally { client.destroy(); const done = once(server, 'close'); close(); await done; }
});
