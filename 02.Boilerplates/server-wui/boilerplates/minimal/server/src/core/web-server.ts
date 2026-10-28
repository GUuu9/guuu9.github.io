import express, { type ErrorRequestHandler } from 'express';
import { fileURLToPath } from 'node:url';
import { createDI } from './DI.js';

export function createApp() {
  const app = express();
  const { greetingBridge } = createDI();
  app.disable('x-powered-by');
  app.use(greetingBridge.path, greetingBridge.router);
  app.use('/api', (_request, response) => {
    response.status(404).json({ success: false, payload: 'API not found.' });
  });
  // Both source/core and dist/server/core are three levels below the sample root.
  const ui = fileURLToPath(new URL('../../../dist/webui/', import.meta.url));
  app.use(express.static(ui));
  const handleError: ErrorRequestHandler = (error, _request, response, next) => {
    console.error(error);
    if (response.headersSent) return next(error);
    response.status(500).json({ success: false, payload: 'Internal server error.' });
  };
  app.use(handleError);
  return app;
}
