import { PluginRegistry } from './PluginRegistry';
import { PluginLoader } from './PluginLoader';

export class PluginManager {
  static loadPlugins(): void {
    PluginLoader.load({
      id: 'translation_plugin',
      name: 'Multi-Language Translation',
      version: '1.0.0',
      enabled: true,
      onExecute: async (payload) => payload,
    });
  }

  static getActivePlugins() {
    return PluginRegistry.list().filter((p) => p.enabled);
  }
}
