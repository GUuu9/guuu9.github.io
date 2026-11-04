import { createSocket } from 'node:dgram';
import type { GreetingUsecase } from '../bridge/greeting/greeting.usecase.js';
import { handleGreetingMessage } from '../bridge/greeting/message.js';
export function createGreetingUdp(usecase: GreetingUsecase) {
  const socket = createSocket('udp4');
  socket.on('message', (payload, remote) => {
    const reply = Buffer.from(JSON.stringify(handleGreetingMessage(payload, usecase)));
    socket.send(reply, remote.port, remote.address, error => { if (error) console.error('UDP send:', error.message); });
  });
  return socket;
}
