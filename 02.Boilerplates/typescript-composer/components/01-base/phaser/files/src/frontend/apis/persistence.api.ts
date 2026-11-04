import { parseGameSave, type GameSave } from '../scenes/main/main.model.js';

export class PersistenceApi {
  private value: GameSave = { version: 1, score: 0 };
  async load(): Promise<GameSave> { return { ...this.value }; }
  async save(value: GameSave): Promise<void> { this.value = parseGameSave(value); }
}
