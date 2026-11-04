import type { Api } from '../../api/api.js';

export class GreetingService {
  constructor(private readonly api: Pick<Api, 'get'>) {}

  async greet(name: string): Promise<string> {
    const result = await this.api.get(`/greeting?name=${encodeURIComponent(name)}`);
    if (!result || typeof result !== 'object' ||
        !('message' in result) || typeof result.message !== 'string') {
      throw new Error('Invalid greeting response.');
    }
    return result.message;
  }
}
