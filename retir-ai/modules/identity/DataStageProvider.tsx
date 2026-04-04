'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type DataStage = 'before' | 'after';

interface DataStageContextType {
  stage: DataStage;
  toggleStage: () => void;
}

const DataStageContext = createContext<DataStageContextType>({ stage: 'before', toggleStage: () => {} });

export function DataStageProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<DataStage>('before');

  const toggleStage = useCallback(() => {
    setStage((prev) => (prev === 'before' ? 'after' : 'before'));
  }, []);

  return (
    <DataStageContext.Provider value={{ stage, toggleStage }}>
      {children}
    </DataStageContext.Provider>
  );
}

export function useDataStage() {
  return useContext(DataStageContext);
}
