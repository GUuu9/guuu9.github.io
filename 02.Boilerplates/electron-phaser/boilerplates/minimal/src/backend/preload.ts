import { persistenceBridge } from './bridge/persistence/persistence.bridge.js';
import { contextBridge } from 'electron';
import { greetingBridge } from './bridge/greeting/greeting.bridge.js';

contextBridge.exposeInMainWorld('API', { greeting: greetingBridge, persistence: persistenceBridge });
