import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import type { GreetingUsecase } from '../bridge/greeting/greeting.usecase.js';
import { parseName } from '../utils/greeting.util.js';

export function attachGreetingSocketIo(
  server: HttpServer,
  usecase: GreetingUsecase,
  origins: readonly string[] = ['http://127.0.0.1:5173', 'http://127.0.0.1:3104'],
) {
  const io = new Server(server, {
    serveClient: false,
    maxHttpBufferSize: 4096,
    cors: { origin: [...origins] },
    allowRequest: (request, done) => {
      const origin = request.headers.origin;
      done(null, origin === undefined || origins.includes(origin));
    },
  });
  io.on('connection', socket => {
    socket.on('greeting', (value: unknown, acknowledge: unknown) => {
      if (typeof acknowledge !== 'function') return;
      const name = parseName(value && typeof value === 'object' && 'name' in value ? value.name : undefined);
      if (name === null) {
        acknowledge({ success: false, payload: 'Name must contain 1–40 characters.' });
        return;
      }
      try { acknowledge({ success: true, payload: usecase.greet(name) }); }
      catch (error) {
        console.error(error);
        acknowledge({ success: false, payload: 'Internal server error.' });
      }
    });
  });
  return io;
}
