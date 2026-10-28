import { Router } from 'express';
import { parseName } from '../../utils/greeting.util.js';
import type { GreetingUsecase } from './greeting.usecase.js';

export class GreetingBridge {
  readonly path = '/api/greeting';
  readonly router = Router();

  constructor(usecase: GreetingUsecase) {
    this.router.get('/', (request, response) => {
      const name = parseName(request.query.name);
      if (name === null) {
        return response.status(400).json({
          success: false,
          payload: 'Name must contain 1–40 characters.',
        });
      }
      return response.json({ success: true, payload: usecase.greet(name) });
    });
  }
}
