import { parseGameSave, type GameSave } from '../scenes/main/main.model.js';

export const SAVE_KEY = 'web-phaser.save.v1';
export class PersistenceApi {
  constructor(private readonly storage?: Pick<Storage, 'getItem' | 'setItem'>) {}
  async load(): Promise<GameSave> {
    const raw = (this.storage ?? window.localStorage).getItem(SAVE_KEY);
    return raw === null ? { version: 1, score: 0 } : parseGameSave(JSON.parse(raw));
  }
  async save(value: GameSave): Promise<void> {
    const validated = parseGameSave(value);
    (this.storage ?? window.localStorage).setItem(SAVE_KEY, JSON.stringify(validated));
  }
}
