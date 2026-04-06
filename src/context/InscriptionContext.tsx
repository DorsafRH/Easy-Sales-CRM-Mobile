import React, { createContext, useContext, ReactNode } from 'react';
import { useInscription, UseInscriptionReturn } from '../hooks/useInscription';

const InscriptionContext = createContext<UseInscriptionReturn | null>(null);

export const InscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const inscription = useInscription();
  return (
    <InscriptionContext.Provider value={inscription}>
      {children}
    </InscriptionContext.Provider>
  );
};

export const useInscriptionContext = (): UseInscriptionReturn => {
  const ctx = useContext(InscriptionContext);
  if (!ctx) throw new Error('useInscriptionContext doit être utilisé dans un InscriptionProvider');
  return ctx;
};
