'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { College } from '@/lib/api';

interface CompareContextType {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<College[]>([]);

  const addToCompare = useCallback((college: College) => {
    setCompareList(prev => {
      if (prev.find(c => c.id === college.id)) return prev;
      if (prev.length >= 3) {
        alert('You can compare at most 3 colleges at a time');
        return prev;
      }
      return [...prev, college];
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareList(prev => prev.filter(c => c.id !== id));
  }, []);

  const isInCompare = useCallback((id: string) => {
    return compareList.some(c => c.id === id);
  }, [compareList]);

  const clearCompare = useCallback(() => setCompareList([]), []);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
