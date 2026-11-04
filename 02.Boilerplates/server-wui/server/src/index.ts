import { createApp } from './core/web-server.js';

const port = 3101;
const server = createApp().listen(port, '127.0.0.1', () => {
  console.log(`Sample server: http://127.0.0.1:${port}`);
});
server.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
let stopping = false;
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    if (stopping) return;
    stopping = true;
    server.close((error) => {
      if (error) {
        console.error(error);
        process.exitCode = 1;
      }
    });
  });
}
