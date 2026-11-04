import { PersistenceApi } from '../apis/persistence.api.js';

export function createDI() {
  return { persistence: new PersistenceApi() };
}
