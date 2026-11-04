import type { GreetingUsecase } from './greeting.usecase.js';
import { parseName } from '../../utils/greeting.util.js';
import type { DesktopResult } from '../../../shared/desktop.js';

export function handleGreetingIpc(trusted: boolean, value: unknown, usecase: GreetingUsecase): DesktopResult<{ message: string }> {
  if (!trusted) return { success: false, error: '허용되지 않은 요청입니다.' };
  const name = parseName(value);
  if (name === null) return { success: false, error: '이름은 1~40자로 입력합니다.' };
  try { return { success: true, payload: usecase.greet(name) }; }
  catch (error) { console.error(error); return { success: false, error: '요청 처리에 실패했습니다.' }; }
}
