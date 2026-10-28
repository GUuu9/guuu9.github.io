import type { BrowserWindow } from 'electron';

export interface BackendModule {
  setupHandlers(window: BrowserWindow): void;
}
