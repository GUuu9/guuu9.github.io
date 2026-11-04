import assert from 'node:assert/strict';
import { test } from 'node:test';
import { once } from 'node:events';
import { createSocket } from 'node:dgram';
import { createDI } from '../src/backend/core/di.js';
import { createGreetingUdp } from '../src/backend/core/udp.js';
test('UDP replies per datagram and rejects malformed or oversized messages', { timeout: 5000 }, async () => {
  const socket = createGreetingUdp(createDI().greetingUsecase); const client = createSocket('udp4');
  socket.bind(0, '127.0.0.1'); await once(socket, 'listening');
  try {
    for (const [payload, success] of [['{"name":"World"}', true], ['{bad', false], ['x'.repeat(4097), false]] as const) {
      const result = once(client, 'message'); client.send(payload, socket.address().port, '127.0.0.1');
      assert.equal(JSON.parse(String((await result)[0])).success, success);
    }
  } finally { client.close(); socket.close(); }
});
