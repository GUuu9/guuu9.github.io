import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { io as connect, type Socket } from 'socket.io-client';
import { createDI } from '../src/backend/core/di.js';
import { createApp } from '../src/backend/core/web-server.js';
import { attachGreetingSocketIo } from '../src/backend/core/socket-io.js';

function waitFor(socket: Socket, event: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const done = () => { clearTimeout(timer); resolve(); };
    const timer = setTimeout(() => { socket.off(event, done); reject(new Error(`Socket event timeout: ${event}`)); }, 3000);
    socket.once(event, done);
  });
}

test('Socket.IO acknowledges validated messages, preserves HTTP and releases clients', { timeout: 10000 }, async context => {
  const dependencies = createDI();
  const server = createServer(createApp(dependencies));
  const io = attachGreetingSocketIo(server, dependencies.greetingUsecase);
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const address = server.address(); assert(address && typeof address === 'object');
  const url = `http://127.0.0.1:${address.port}`;
  const clients: Socket[] = [];
  try {
    for (const transport of ['polling', 'websocket']) {
      const client = connect(url, { transports: [transport], extraHeaders: { Origin: 'http://127.0.0.1:5173' }, reconnection: false, autoConnect: false }); clients.push(client);
      const connected = waitFor(client, 'connect'); client.connect(); await connected;
      assert.deepEqual(await client.timeout(2000).emitWithAck('greeting', { name: 'World' }), { success: true, payload: { message: 'Hello, World!' } });
      for (const value of [null, {}, { name: [] }, { name: '' }, { name: 'x'.repeat(41) }]) {
        const result = await client.timeout(2000).emitWithAck('greeting', value); assert.equal(result.success, false);
      }
      client.emit('greeting', { name: 'World' });
      assert.equal((await client.timeout(2000).emitWithAck('greeting', { name: 'Again' })).success, true);
      client.disconnect();
    }
    assert.equal((await fetch(`${url}/api/greeting?name=Http`)).status, 200);
    const client = connect(url, { transports: ['websocket'], reconnection: false, autoConnect: false }); clients.push(client);
    const connected = waitFor(client, 'connect'); client.connect(); await connected;
    context.mock.method(console, 'error', () => {});
    context.mock.method(dependencies.greetingUsecase, 'greet', () => { throw new Error('private'); });
    assert.deepEqual(await client.timeout(2000).emitWithAck('greeting', { name: 'World' }), { success: false, payload: 'Internal server error.' });
  } finally {
    await new Promise<void>((resolve, reject) => io.close(error => error ? reject(error) : resolve()));
    for (const client of clients) client.disconnect();
    assert.equal(io.engine.clientsCount, 0);
  }
});

test('Socket.IO rejects unlisted browser origins and oversized messages', { timeout: 10000 }, async () => {
  const server = createServer(); const io = attachGreetingSocketIo(server, createDI().greetingUsecase);
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const address = server.address(); assert(address && typeof address === 'object');
  const url = `http://127.0.0.1:${address.port}`;
  const denied = connect(url, { transports: ['websocket'], extraHeaders: { Origin: 'https://untrusted.example' }, reconnection: false, autoConnect: false });
  const large = connect(url, { transports: ['websocket'], reconnection: false, autoConnect: false });
  try {
    const rejected = waitFor(denied, 'connect_error'); denied.connect(); await rejected; assert.equal(denied.connected, false);
    const connected = waitFor(large, 'connect'); large.connect(); await connected;
    const disconnected = waitFor(large, 'disconnect'); large.emit('greeting', { name: 'x'.repeat(5000) }, () => {}); await disconnected;
  } finally {
    denied.disconnect(); large.disconnect();
    await new Promise<void>((resolve, reject) => io.close(error => error ? reject(error) : resolve()));
  }
});
