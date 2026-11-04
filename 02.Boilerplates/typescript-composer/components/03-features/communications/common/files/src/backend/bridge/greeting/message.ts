import type { GreetingUsecase } from './greeting.usecase.js';
import { parseName } from '../../utils/greeting.util.js';
export function handleGreetingMessage(payload: Buffer, usecase: GreetingUsecase) {
  if (payload.length > 4096) return { success: false, payload: 'Message too large.' };
  let value: unknown;
  try { value = JSON.parse(payload.toString('utf8')); }
  catch { return { success: false, payload: 'Invalid JSON.' }; }
  const name = parseName(value && typeof value === 'object' && 'name' in value ? value.name : undefined);
  if (name === null) return { success: false, payload: 'Name must contain 1–40 characters.' };
  try { return { success: true, payload: usecase.greet(name) }; }
  catch (error) { console.error(error); return { success: false, payload: 'Internal server error.' }; }
}
