import { parseGameSave, type GameSave } from '../../shared/game-save.js';
import type { DesktopResult } from '../../shared/desktop.js';
declare global { interface Window { gameSave: { load(): Promise<DesktopResult<GameSave>>; save(value: GameSave): Promise<DesktopResult<null>> } } }
export class PersistenceApi {
  async load(): Promise<GameSave> {
    const result = await window.gameSave.load();
    if (!result.success) throw new Error(result.error);
    return parseGameSave(result.payload);
  }
  async save(value: GameSave): Promise<void> {
    const result = await window.gameSave.save(parseGameSave(value));
    if (!result.success) throw new Error(result.error);
  }
}
