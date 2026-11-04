import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('gameSave', {
  load: () => ipcRenderer.invoke('game:load'),
  save: (value: unknown) => ipcRenderer.invoke('game:save', value),
});
