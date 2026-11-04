export const GREETING_CHANNEL = 'sample:greeting';
export type DesktopResult<T> = { success: true; payload: T } | { success: false; error: string };
export interface DesktopApi {
  greet(name: string): Promise<DesktopResult<{ message: string }>>;
}
