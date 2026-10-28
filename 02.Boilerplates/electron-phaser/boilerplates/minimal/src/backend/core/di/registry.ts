import { app } from 'electron';
import { PersistenceUsecase } from '../../bridge/persistence/persistence.usecase.js';
import { PersistenceService } from '../../services/persistence/persistence.service.js';
import type { BrowserWindow } from 'electron';
import { GreetingUsecase } from '../../bridge/greeting/greeting.usecase.js';

export class MainRegistry {
  public static initBackend(window: BrowserWindow): void {
    new GreetingUsecase().setupHandlers(window);
    new PersistenceUsecase(new PersistenceService(app.getPath('userData'))).setupHandlers(window);
  }
}
