import { StudioPlugin, PluginRegistry } from './PluginRegistry';

export class PluginLoader {
  static load(plugin: StudioPlugin): void {
    plugin.enabled = true;
    PluginRegistry.register(plugin);
  }

  static unload(pluginId: string): void {
    const p = PluginRegistry.get(pluginId);
    if (p) p.enabled = false;
  }
}
