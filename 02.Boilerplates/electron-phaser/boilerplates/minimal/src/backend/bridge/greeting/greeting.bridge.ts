import { ipcRenderer } from 'electron';
import { GREETING_CHANNEL, type GreetingBridge } from '../../../shared/ipc/greeting.js';

export const greetingBridge: GreetingBridge = {
  greet: (name) => ipcRenderer.invoke(GREETING_CHANNEL, name),
};
