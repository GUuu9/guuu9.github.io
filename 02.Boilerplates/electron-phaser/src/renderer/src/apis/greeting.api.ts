import type { GreetingBridge } from '../../../shared/ipc/greeting.js';

export class GreetingApi {
  public greet(name: string): ReturnType<GreetingBridge['greet']> {
    const bridge = window.API?.greeting;
    if (!bridge) throw new Error('인사 API를 사용할 수 없습니다.');
    return bridge.greet(name);
  }
}
