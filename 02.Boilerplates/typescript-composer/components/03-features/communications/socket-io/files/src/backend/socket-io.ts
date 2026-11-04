import { createServer } from 'node:http';
import { createDI } from './core/di.js';
import { createApp } from './core/web-server.js';
import { attachGreetingSocketIo } from './core/socket-io.js';

const dependencies = createDI();
const server = createServer(createApp(dependencies));
const io = attachGreetingSocketIo(server, dependencies.greetingUsecase);
let stopping = false;
const close = () => {
  if (stopping) return;
  stopping = true;
  io.close(error => { if (error && (error as NodeJS.ErrnoException).code !== 'ERR_SERVER_NOT_RUNNING') { console.error(error); process.exitCode = 1; } });
};
server.on('error', error => { console.error(error); process.exitCode = 1; close(); });
server.listen(3104, '127.0.0.1', () => console.log('Socket.IO http://127.0.0.1:3104'));
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, close);
