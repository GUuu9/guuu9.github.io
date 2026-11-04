export class Api {
  constructor(private readonly request: typeof fetch = fetch) {}

  async get(path: string): Promise<unknown> {
    const response = await this.request(`/api${path}`, {
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });
    const result: unknown = await response.json();
    if (!result || typeof result !== 'object' ||
        !('success' in result) || typeof result.success !== 'boolean' ||
        !('payload' in result)) {
      throw new Error('Invalid API response.');
    }
    if (!response.ok || !result.success) {
      throw new Error(typeof result.payload === 'string' ? result.payload : 'Request failed.');
    }
    return result.payload;
  }
}
