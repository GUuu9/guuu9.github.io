import { parseGameSave, type GameSave } from '../../../shared/ipc/persistence.js';
export class PersistenceApi {
  async load(): Promise<GameSave> {
    if (!window.API) throw new Error('Electron에서 실행해 주세요.');
    const result = await window.API.persistence.load();
    if (!result.success) throw new Error(result.error);
    return parseGameSave(result.payload);
  }
  async save(value: GameSave): Promise<void> {
    if (!window.API) throw new Error('Electron에서 실행해 주세요.');
    const result = await window.API.persistence.save(parseGameSave(value));
    if (!result.success) throw new Error(result.error);
  }
}
