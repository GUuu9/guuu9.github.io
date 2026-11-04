import express, { type ErrorRequestHandler } from 'express';
import type { createDI } from './di.js';
import { GreetingBridge } from '../bridge/greeting/greeting.bridge.js';

export function createApp(dependencies: ReturnType<typeof createDI>) {
  const app = express();
  const greetingBridge = new GreetingBridge(dependencies.greetingUsecase);
  app.disable('x-powered-by');
  app.use(greetingBridge.path, greetingBridge.router);
  app.use((_request, response) => {
    response.status(404).json({ success: false, payload: 'API not found.' });
  });
  const handleError: ErrorRequestHandler = (error, _request, response, next) => {
    console.error(error);
    if (response.headersSent) return next(error);
    response.status(500).json({ success: false, payload: 'Internal server error.' });
  };
  app.use(handleError);
  return app;
}
