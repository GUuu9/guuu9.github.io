import { app, ipcMain, type BrowserWindow } from 'electron';
import { PersistenceService } from '../../services/persistence/persistence.service.js';
import { parseGameSave } from '../../../shared/game-save.js';
export function registerPersistenceIpc(window: BrowserWindow, page: string, directory: string) {
  const service = new PersistenceService(directory);
  app.once('before-quit', event => {
    event.preventDefault();
    void service.flush().then(() => app.quit());
  });
  for (const channel of ['game:load', 'game:save']) ipcMain.handle(channel, async (event, value: unknown) => {
    if (event.sender !== window.webContents || event.senderFrame !== window.webContents.mainFrame || event.senderFrame.url !== page) return { success: false, error: '허용되지 않은 요청입니다.' };
    try {
      if (channel === 'game:save') { await service.save(parseGameSave(value)); return { success: true, payload: null }; }
      return { success: true, payload: await service.load() };
    } catch (error) { console.error(error); return { success: false, error: '저장 처리에 실패했습니다.' }; }
  });
  return () => { for (const channel of ['game:load', 'game:save']) ipcMain.removeHandler(channel); };
}
