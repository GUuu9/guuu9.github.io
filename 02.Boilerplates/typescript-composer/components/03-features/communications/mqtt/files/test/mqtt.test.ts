import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EventEmitter } from 'node:events';
import type { MqttClient } from 'mqtt';
import { createDI } from '../src/backend/core/di.js';
import { attachGreetingMqtt } from '../src/backend/core/mqtt.js';
test('MQTT resubscribes after reconnect, ignores retained requests and detaches', () => {
  const client = new EventEmitter(); let subscriptions = 0; const replies: string[] = [];
  Object.assign(client, { connected: true, subscribe: (_topic: string, _options: unknown, done: (error: null, grants: { qos: number }[]) => void) => { subscriptions++; done(null, [{ qos: 0 }]); }, publish: (topic: string, message: string, _options: unknown, done: () => void) => { assert.equal(topic, 'sample/response'); replies.push(message); done(); } });
  const detach = attachGreetingMqtt(client as unknown as MqttClient, createDI().greetingUsecase, 'sample');
  client.emit('connect'); assert.equal(subscriptions, 2);
  client.emit('message', 'sample/request', Buffer.from('{"name":"World"}'), { retain: true }); assert.equal(replies.length, 0);
  client.emit('message', 'sample/request', Buffer.from('{"name":"World"}'), { retain: false }); assert.equal(JSON.parse(replies[0]!).success, true);
  client.emit('message', 'sample/request', Buffer.from('{bad'), {}); assert.equal(JSON.parse(replies[1]!).success, false);
  detach(); assert.equal(client.listenerCount('connect'), 0); assert.equal(client.listenerCount('message'), 0);
});
