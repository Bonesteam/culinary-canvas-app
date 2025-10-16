'use client';

import { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';
import type { Currency } from './types';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: Dispatch<SetStateAction<Currency>>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('GBP');

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export type { Currency };