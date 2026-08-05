export interface StudioPlugin {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  onExecute?(payload: any): Promise<any>;
}

export class PluginRegistry {
  private static plugins: Map<string, StudioPlugin> = new Map();

  static register(plugin: StudioPlugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  static get(id: string): StudioPlugin | undefined {
    return this.plugins.get(id);
  }

  static list(): StudioPlugin[] {
    return Array.from(this.plugins.values());
  }
}
