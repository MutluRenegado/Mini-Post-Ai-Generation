import { WorkplaceLayoutState } from '../types/workplace.types';

const STORAGE_KEY = 'workplace_framework_layout_v1';

export class DockManager {
  static getInitialState(defaultModuleId: string): WorkplaceLayoutState {
    return {
      leftPanelOpen: true,
      leftPanelWidth: 260,
      rightPanelOpen: true,
      rightPanelWidth: 320,
      bottomPanelOpen: false,
      bottomPanelHeight: 200,
      activeTabId: defaultModuleId,
      activeModuleId: defaultModuleId,
    };
  }

  static loadSavedLayout(defaultModuleId: string): WorkplaceLayoutState {
    if (typeof window === 'undefined') return this.getInitialState(defaultModuleId);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...this.getInitialState(defaultModuleId), ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse saved workplace layout', e);
    }
    return this.getInitialState(defaultModuleId);
  }

  static saveLayout(state: WorkplaceLayoutState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save workplace layout', e);
    }
  }
}
