import type { PersistenceBridge } from './persistence.js';
export const GREETING_CHANNEL = 'greeting:create';

export type GreetingResult =
  | { success: true; message: string }
  | { success: false; error: string };

export interface GreetingBridge {
  greet(name: string): Promise<GreetingResult>;
}

export interface AppBridge {
  persistence: PersistenceBridge;
  greeting: GreetingBridge;
}
