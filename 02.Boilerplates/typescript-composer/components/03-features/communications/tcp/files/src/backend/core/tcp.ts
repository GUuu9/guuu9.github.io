import { createServer, type Socket } from 'node:net';
import type { GreetingUsecase } from '../bridge/greeting/greeting.usecase.js';
import { handleGreetingMessage } from '../bridge/greeting/message.js';
export function createGreetingTcp(usecase: GreetingUsecase) {
  const sockets = new Set<Socket>();
  const server = createServer(socket => {
    sockets.add(socket);
    let buffered = Buffer.alloc(0);
    let rejected = false;
    socket.setTimeout(10_000, () => socket.destroy());
    socket.on('error', error => console.error('TCP socket:', error.message));
    socket.once('close', () => sockets.delete(socket));
    socket.on('data', chunk => {
      if (rejected) return;
      buffered = Buffer.concat([buffered, chunk]);
      // shortcut: 연결별 미처리 버퍼는 4096바이트, 대량 배치가 필요하면 프레임별 스트리밍으로 변경.
      if (buffered.length > 4096) { rejected = true; socket.end(JSON.stringify({ success: false, payload: 'Message too large.' }) + '\n'); return; }
      let boundary: number;
      while ((boundary = buffered.indexOf(10)) !== -1) {
        const frame = buffered.subarray(0, boundary);
        buffered = buffered.subarray(boundary + 1);
        if (!socket.write(JSON.stringify(handleGreetingMessage(frame, usecase)) + '\n')) { socket.destroy(); return; }
      }
    });
  });
  server.maxConnections = 32;
  return { server, close: () => { if (server.listening) server.close(); for (const socket of sockets) socket.destroy(); } };
}
