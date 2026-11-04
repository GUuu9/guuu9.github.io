import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';
import { createDI } from './core/di.js';
import { registerGreetingIpc } from './bridge/greeting/greeting.ipc.js';

const page = new URL('../frontend/index.html', import.meta.url).href;
let cleanup: (() => void) | undefined;
void app.whenReady().then(async () => {
  const { greetingUsecase } = createDI();
  const window = new BrowserWindow({ width: 800, height: 600, webPreferences: {
    preload: fileURLToPath(new URL('../preload/index.cjs', import.meta.url)),
    contextIsolation: true, nodeIntegration: false, sandbox: true,
  } });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', event => event.preventDefault());
  cleanup = registerGreetingIpc(window, page, greetingUsecase);
  window.once('closed', () => { cleanup?.(); cleanup = undefined; });
  await window.loadURL(page);
}).catch(error => { console.error('앱 시작 실패:', error); app.exit(1); });
app.on('before-quit', () => { cleanup?.(); cleanup = undefined; });
app.on('window-all-closed', () => app.quit());
