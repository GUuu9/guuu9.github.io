import type { AppBridge } from '../../../shared/ipc/greeting.js';

declare global {
  interface Window {
    API?: AppBridge;
  }
}

export {};
