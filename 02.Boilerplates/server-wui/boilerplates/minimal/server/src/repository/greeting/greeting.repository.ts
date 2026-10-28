export class GreetingRepository {
  private readonly prefix: string;

  constructor(config: unknown) {
    if (!config || typeof config !== 'object' ||
        !('prefix' in config) || typeof config.prefix !== 'string' ||
        !config.prefix.trim() || config.prefix.length > 40) {
      throw new Error('Invalid greeting config: prefix must contain 1–40 characters.');
    }
    this.prefix = config.prefix.trim();
  }

  getPrefix(): string {
    return this.prefix;
  }
}
