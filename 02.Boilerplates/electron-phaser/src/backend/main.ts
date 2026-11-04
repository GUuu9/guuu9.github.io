import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { MainRegistry } from './core/di/registry.js';

const directory = path.dirname(fileURLToPath(import.meta.url));

async function start(): Promise<void> {
  await app.whenReady();
  const window = new BrowserWindow({
    width: 800,
    height: 560,
    webPreferences: {
      preload: path.join(directory, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  MainRegistry.initBackend(window);
  if (process.env.NODE_ENV === 'development') {
    await window.loadURL('http://127.0.0.1:5173');
  } else {
    await window.loadURL(pathToFileURL(path.resolve(directory, '../../dist/renderer/index.html')).toString());
  }
}

void start().catch((error: unknown) => {
  console.error('앱 시작 실패:', error);
  app.quit();
});

app.on('window-all-closed', () => app.quit());
