import { WorkplacePanel } from '../types/workplace.types';

export class PanelManager {
  private panels: Map<string, WorkplacePanel> = new Map();

  registerPanel(panel: WorkplacePanel): void {
    this.panels.set(panel.id, panel);
  }

  getPanel(id: string): WorkplacePanel | undefined {
    return this.panels.get(id);
  }

  getAllPanels(): WorkplacePanel[] {
    return Array.from(this.panels.values());
  }
}
