import { createContext, useContext, type ReactNode } from 'react';
import type { Dependencies } from './DI.js';

const Context = createContext<Dependencies | null>(null);

export function DIProvider({ dependencies, children }: {
  dependencies: Dependencies;
  children: ReactNode;
}) {
  return <Context.Provider value={dependencies}>{children}</Context.Provider>;
}

export function useDI(): Dependencies {
  const dependencies = useContext(Context);
  if (!dependencies) throw new Error('DIProvider is missing.');
  return dependencies;
}
