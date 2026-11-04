import { contextBridge, ipcRenderer } from 'electron';
import { GREETING_CHANNEL, type DesktopApi } from '../shared/desktop.js';

const desktop: DesktopApi = { greet: name => ipcRenderer.invoke(GREETING_CHANNEL, name) };
contextBridge.exposeInMainWorld('desktop', desktop);
