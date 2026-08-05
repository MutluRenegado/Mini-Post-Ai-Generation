'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  WorkplaceModuleConfig,
  WorkplaceTool,
  WorkplaceLayoutState,
  WorkspaceContextValue,
} from '../types/workplace.types';
import { DockManager } from '../managers/DockManager';

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: React.ReactNode;
  initialModules?: WorkplaceModuleConfig[];
  defaultModuleId?: string;
}

export function WorkspaceProvider({
  children,
  initialModules = [],
  defaultModuleId = '',
}: WorkspaceProviderProps) {
  const [modules, setModules] = useState<Record<string, WorkplaceModuleConfig>>(() => {
    const map: Record<string, WorkplaceModuleConfig> = {};
    initialModules.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  });

  const [activeModuleId, setActiveModuleId] = useState<string>(
    defaultModuleId || initialModules[0]?.id || ''
  );

  const [layoutState, setLayoutState] = useState<WorkplaceLayoutState>(() => {
    const saved = DockManager.loadSavedLayout(activeModuleId);
    const initialMod = initialModules.find((m) => m.id === activeModuleId) || initialModules[0];
    const targetToolId = initialMod?.defaultToolId || saved.activeToolId || initialMod?.tools[0]?.id;
    return {
      ...saved,
      activeToolId: targetToolId,
    };
  });

  React.useEffect(() => {
    const initialMod = initialModules.find((m) => m.id === activeModuleId) || initialModules[0];
    if (initialMod?.defaultToolId) {
      setLayoutState((prev) => ({
        ...prev,
        activeToolId: initialMod.defaultToolId,
      }));
    }
  }, [initialModules, activeModuleId]);

  const registerModule = (config: WorkplaceModuleConfig) => {
    setModules((prev) => ({ ...prev, [config.id]: config }));
    if (!activeModuleId) {
      setActiveModuleId(config.id);
    }
  };

  const activeModule = modules[activeModuleId] || null;

  const activeTool: WorkplaceTool | null =
    activeModule?.tools.find((t) => t.id === layoutState.activeToolId) ||
    activeModule?.tools[0] ||
    null;

  const openModule = (moduleId: string, toolId?: string) => {
    if (modules[moduleId]) {
      setActiveModuleId(moduleId);
      const mod = modules[moduleId];
      const targetTool = toolId || mod.defaultToolId || mod.tools[0]?.id;
      setLayoutState((prev) => {
        const next = {
          ...prev,
          activeModuleId: moduleId,
          activeTabId: moduleId,
          activeToolId: targetTool,
        };
        DockManager.saveLayout(next);
        return next;
      });
    }
  };

  const closeModule = (moduleId: string) => {
    // If closing active module, switch to another module if available
    const keys = Object.keys(modules).filter((k) => k !== moduleId);
    if (activeModuleId === moduleId && keys.length > 0) {
      openModule(keys[0]);
    }
  };

  const activateTool = (toolId: string) => {
    setLayoutState((prev) => {
      const next = { ...prev, activeToolId: toolId };
      DockManager.saveLayout(next);
      return next;
    });
  };

  const toggleLeftPanel = () => {
    setLayoutState((prev) => {
      const next = { ...prev, leftPanelOpen: !prev.leftPanelOpen };
      DockManager.saveLayout(next);
      return next;
    });
  };

  const toggleRightPanel = () => {
    setLayoutState((prev) => {
      const next = { ...prev, rightPanelOpen: !prev.rightPanelOpen };
      DockManager.saveLayout(next);
      return next;
    });
  };

  const toggleBottomPanel = () => {
    setLayoutState((prev) => {
      const next = { ...prev, bottomPanelOpen: !prev.bottomPanelOpen };
      DockManager.saveLayout(next);
      return next;
    });
  };

  const setLeftPanelWidth = (w: number) => {
    setLayoutState((prev) => ({ ...prev, leftPanelWidth: w }));
  };

  const setRightPanelWidth = (w: number) => {
    setLayoutState((prev) => ({ ...prev, rightPanelWidth: w }));
  };

  const saveWorkspace = () => {
    DockManager.saveLayout(layoutState);
  };

  const restoreWorkspace = () => {
    setLayoutState(DockManager.getInitialState(activeModuleId));
  };


  return (
    <WorkspaceContext.Provider
      value={{
        modules,
        activeModule,
        activeTool,
        layoutState,
        registerModule,
        openModule,
        closeModule,
        activateTool,
        toggleLeftPanel,
        toggleRightPanel,
        toggleBottomPanel,
        setLeftPanelWidth,
        setRightPanelWidth,
        saveWorkspace,
        restoreWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return ctx;
}
