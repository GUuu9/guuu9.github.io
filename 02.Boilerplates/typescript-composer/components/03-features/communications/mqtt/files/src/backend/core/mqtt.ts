import type { MqttClient } from 'mqtt';
import type { GreetingUsecase } from '../bridge/greeting/greeting.usecase.js';
import { handleGreetingMessage } from '../bridge/greeting/message.js';
export function attachGreetingMqtt(client: MqttClient, usecase: GreetingUsecase, prefix: string) {
  if (!/^[a-zA-Z0-9_-]+$/.test(prefix)) throw new Error('MQTT prefix must be one nonempty topic segment.');
  const requestTopic = `${prefix}/request`;
  const connected = () => client.subscribe(requestTopic, { qos: 0 }, (error, granted) => {
    if (error || !granted?.length || granted.some(item => item.qos === 128)) {
      console.error('MQTT subscribe failed:', error ?? 'Subscription rejected');
      client.end(true);
      process.exitCode = 1;
    }
  });
  const message = (topic: string, payload: Buffer, packet: { retain?: boolean }) => {
    if (topic !== requestTopic || packet.retain) return;
    if (!client.connected) return;
    client.publish(`${prefix}/response`, JSON.stringify(handleGreetingMessage(payload, usecase)), { qos: 0, retain: false }, error => { if (error) console.error('MQTT publish:', error.message); });
  };
  client.on('connect', connected);
  client.on('message', message);
  if (client.connected) connected();
  return () => { client.removeListener('connect', connected); client.removeListener('message', message); };
}
