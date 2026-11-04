import { ipcRenderer } from 'electron';
import { PERSISTENCE_CHANNELS, type PersistenceBridge } from '../../../shared/ipc/persistence.js';
export const persistenceBridge: PersistenceBridge = {
  load: () => ipcRenderer.invoke(PERSISTENCE_CHANNELS.load),
  save: value => ipcRenderer.invoke(PERSISTENCE_CHANNELS.save, value),
};
