import { ipcMain, type BrowserWindow } from 'electron';
import { PERSISTENCE_CHANNELS } from '../../../shared/ipc/persistence.js';
import { PersistenceService } from '../../services/persistence/persistence.service.js';
import type { BackendModule } from '../../core/backend-module.js';
export class PersistenceUsecase implements BackendModule {
  constructor(private readonly service: PersistenceService) {}
  setupHandlers(window: BrowserWindow): void {
    for (const operation of ['load', 'save'] as const) {
      ipcMain.handle(PERSISTENCE_CHANNELS[operation], async (event, value: unknown) => {
        if (event.sender.id !== window.webContents.id) return { success: false, error: '허용되지 않은 요청입니다.' };
        try {
          const payload = operation === 'load' ? await this.service.load() : (await this.service.save(value), null);
          return { success: true, payload };
        } catch { return { success: false, error: '저장 데이터를 처리하지 못했습니다. 기존 파일을 보존합니다.' }; }
      });
    }
  }
}
