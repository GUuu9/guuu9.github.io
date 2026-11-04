import { createDI } from './core/di.js';
import { createGreetingUdp } from './core/udp.js';
const socket = createGreetingUdp(createDI().greetingUsecase);
let stopping = false;
const close = () => { if (!stopping) { stopping = true; try { socket.close(); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ERR_SOCKET_DGRAM_NOT_RUNNING') throw error; } } };
socket.on('error', error => { console.error(error); process.exitCode = 1; close(); });
socket.bind(3103, '127.0.0.1', () => console.log('UDP 127.0.0.1:3103'));
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, close);
