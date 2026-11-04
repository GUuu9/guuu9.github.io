import { createDI } from './core/di.js';
import { createGreetingTcp } from './core/tcp.js';
const { server, close } = createGreetingTcp(createDI().greetingUsecase);
server.on('error', error => { console.error(error); process.exitCode = 1; close(); });
server.listen(3102, '127.0.0.1', () => console.log('TCP 127.0.0.1:3102'));
let stopping = false;
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => { if (!stopping) { stopping = true; close(); } });
