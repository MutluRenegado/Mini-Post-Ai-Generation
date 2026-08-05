'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { HelpingContextValue } from '../types/helping.types';
import { HelpItem } from '../types/explain-item.types';
import { helpingRegistry } from '../registry/helpingRegistry';

const HelpingContext = createContext<HelpingContextValue | undefined>(undefined);

export function HelpingProvider({ children }: { children: ReactNode }) {
  const [activeHelpId, setActiveHelpId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<HelpItem | null>(null);
  const [isHelpModeActive, setIsHelpModeActive] = useState<boolean>(false);

  const openHelp = useCallback((helpId: string) => {
    const item = helpingRegistry.getById(helpId);
    if (item) {
      setActiveHelpId(helpId);
      setActiveItem(item);
    } else {
      console.warn(`[HelpingModule] Help ID "${helpId}" not found in registry.`);
    }
  }, []);

  const closeHelp = useCallback(() => {
    setActiveHelpId(null);
    setActiveItem(null);
  }, []);

  const toggleHelpMode = useCallback(() => {
    setIsHelpModeActive((prev) => !prev);
  }, []);

  return (
    <HelpingContext.Provider
      value={{
        activeHelpId,
        activeItem,
        isHelpModeActive,
        openHelp,
        closeHelp,
        toggleHelpMode,
      }}
    >
      {children}
    </HelpingContext.Provider>
  );
}

export function useHelping(): HelpingContextValue {
  const context = useContext(HelpingContext);
  if (!context) {
    throw new Error('useHelping must be used within a HelpingProvider');
  }
  return context;
}
