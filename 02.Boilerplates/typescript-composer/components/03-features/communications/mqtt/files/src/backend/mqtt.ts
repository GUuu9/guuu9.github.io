import { connect } from 'mqtt';
import { createDI } from './core/di.js';
import { attachGreetingMqtt } from './core/mqtt.js';
const broker = process.env.MQTT_URL ?? 'mqtt://127.0.0.1:1883';
const prefix = process.env.MQTT_PREFIX ?? 'sample-greeting';
if (!/^[a-zA-Z0-9_-]+$/.test(prefix)) throw new Error('Invalid MQTT_PREFIX.');
const usecase = createDI().greetingUsecase;
const client = connect(broker, { username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD, reconnectPeriod: 1000, connectTimeout: 5000, clean: true, resubscribe: false });
const detach = attachGreetingMqtt(client, usecase, prefix);
client.on('error', error => console.error('MQTT:', error.message));
let stopping = false;
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => {
  if (stopping) return;
  stopping = true; detach();
  const timer = setTimeout(() => client.end(true), 3000);
  client.end(false, {}, () => clearTimeout(timer));
});
