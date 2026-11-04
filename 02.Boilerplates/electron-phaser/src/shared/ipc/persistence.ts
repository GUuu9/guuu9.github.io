export interface GameSave { version: 1; score: number }
export function parseGameSave(value: unknown): GameSave {
  if (typeof value !== 'object' || value === null || !('version' in value) || value.version !== 1 || !('score' in value) || typeof value.score !== 'number' || !Number.isSafeInteger(value.score) || value.score < 0) throw new Error('저장 형식이 올바르지 않습니다.');
  return { version: 1, score: value.score };
}
export const PERSISTENCE_CHANNELS = { load: 'persistence:load', save: 'persistence:save' } as const;
export type PersistenceResult<T> = { success: true; payload: T } | { success: false; error: string };
export interface PersistenceBridge {
  load(): Promise<PersistenceResult<GameSave>>;
  save(value: GameSave): Promise<PersistenceResult<null>>;
}
