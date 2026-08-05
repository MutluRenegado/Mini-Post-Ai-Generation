import React from 'react';

export interface WorkplaceTool {
  id: string;
  name: string;
  icon: React.ElementType;
  shortcut?: string;
  description?: string;
  category?: string;
}

export interface WorkplacePanel {
  id: string;
  title: string;
  position: 'left' | 'right' | 'bottom';
  icon?: React.ElementType;
  defaultSize?: number;
  isCollapsible?: boolean;
  component: React.ComponentType<{ contextData?: unknown }>;
}

export interface WorkplaceCommand {
  id: string;
  label: string;
  icon?: React.ElementType;
  shortcut?: string;
  action: () => void;
  group?: string;
}

export interface WorkplaceModuleConfig {
  id: string;
  name: string;
  subtitle?: string;
  version?: string;
  icon: React.ElementType;
  tools: WorkplaceTool[];
  panels?: WorkplacePanel[];
  commands?: WorkplaceCommand[];
  defaultToolId?: string;
  workspaceComponent: React.ComponentType<{ activeToolId?: string }>;
  inspectorComponent?: React.ComponentType<{ activeToolId?: string }>;
}

export interface WorkplaceLayoutState {
  leftPanelOpen: boolean;
  leftPanelWidth: number;
  rightPanelOpen: boolean;
  rightPanelWidth: number;
  bottomPanelOpen: boolean;
  bottomPanelHeight: number;
  activeTabId: string;
  activeToolId?: string;
  activeModuleId: string;
}

export interface WorkspaceContextValue {
  modules: Record<string, WorkplaceModuleConfig>;
  activeModule: WorkplaceModuleConfig | null;
  activeTool: WorkplaceTool | null;
  layoutState: WorkplaceLayoutState;
  registerModule: (config: WorkplaceModuleConfig) => void;
  openModule: (moduleId: string, toolId?: string) => void;
  closeModule: (moduleId: string) => void;
  activateTool: (toolId: string) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleBottomPanel: () => void;
  setLeftPanelWidth: (w: number) => void;
  setRightPanelWidth: (w: number) => void;
  saveWorkspace: () => void;
  restoreWorkspace: () => void;
}
