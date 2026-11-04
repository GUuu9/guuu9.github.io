import type { DesktopApi } from '../../shared/desktop.js';

export class Api {
  constructor(private readonly greet: DesktopApi['greet'] = name => window.desktop.greet(name)) {}
  async get(path: string): Promise<unknown> {
    const url = new URL(path, 'https://local.invalid');
    if (url.pathname !== '/greeting') throw new Error('허용되지 않은 기능입니다.');
    const result: unknown = await this.greet(url.searchParams.get('name') ?? '');
    if (!result || typeof result !== 'object' || !('success' in result) || typeof result.success !== 'boolean') throw new Error('Invalid IPC response.');
    if (!result.success) throw new Error('error' in result && typeof result.error === 'string' ? result.error : 'Request failed.');
    if (!('payload' in result)) throw new Error('Invalid IPC response.');
    return result.payload;
  }
}
