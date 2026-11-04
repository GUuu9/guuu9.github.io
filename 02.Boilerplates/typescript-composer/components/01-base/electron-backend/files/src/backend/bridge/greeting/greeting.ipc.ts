import { ipcMain, type BrowserWindow } from 'electron';
import { GREETING_CHANNEL, type DesktopResult } from '../../../shared/desktop.js';
import type { GreetingUsecase } from './greeting.usecase.js';
import { handleGreetingIpc } from './greeting.handler.js';

export function registerGreetingIpc(window: BrowserWindow, page: string, usecase: GreetingUsecase) {
  ipcMain.handle(GREETING_CHANNEL, (event, value: unknown): DesktopResult<{ message: string }> => {
    const trusted = event.sender === window.webContents && event.senderFrame === window.webContents.mainFrame && event.senderFrame.url === page;
    return handleGreetingIpc(trusted, value, usecase);
  });
  return () => ipcMain.removeHandler(GREETING_CHANNEL);
}
