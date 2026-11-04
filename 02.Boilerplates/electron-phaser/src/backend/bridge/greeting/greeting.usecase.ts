import { ipcMain, type BrowserWindow } from 'electron';
import { GREETING_CHANNEL, type GreetingResult } from '../../../shared/ipc/greeting.js';
import { createGreeting } from '../../services/greeting/greeting.service.js';
import type { BackendModule } from '../../core/backend-module.js';

export class GreetingUsecase implements BackendModule {
  public setupHandlers(window: BrowserWindow): void {
    ipcMain.handle(GREETING_CHANNEL, (event, name: unknown): GreetingResult => {
      if (event.sender.id !== window.webContents.id) {
        return { success: false, error: '허용되지 않은 IPC 요청입니다.' };
      }

      try {
        return { success: true, message: createGreeting(name) };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : '요청을 처리하지 못했습니다.',
        };
      }
    });
  }
}
