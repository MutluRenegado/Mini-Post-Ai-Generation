import { HelpItem } from '../types/explain-item.types';
import { GLOBAL_HELP_ITEMS } from '../content/globalHelp';
import { FORMS_HELP_ITEMS } from '../content/formsHelp';
import { STUDIO_HELP_ITEMS } from '../content/studioHelp';

class HelpingRegistry {
  private items: Map<string, HelpItem> = new Map();

  constructor() {
    this.registerBatch(GLOBAL_HELP_ITEMS);
    this.registerBatch(FORMS_HELP_ITEMS);
    this.registerBatch(STUDIO_HELP_ITEMS);
  }

  public register(item: HelpItem): void {
    if (this.items.has(item.id)) {
      console.warn(`[HelpingRegistry] Overwriting existing help item: ${item.id}`);
    }
    this.items.set(item.id, item);
  }

  public registerBatch(items: HelpItem[]): void {
    items.forEach((i) => this.register(i));
  }

  public getById(id: string): HelpItem | undefined {
    return this.items.get(id);
  }

  public getByRoute(route: string): HelpItem[] {
    return Array.from(this.items.values()).filter((i) => i.route === route);
  }

  public getByCategory(category: string): HelpItem[] {
    return Array.from(this.items.values()).filter((i) => i.category === category);
  }

  public getAll(): HelpItem[] {
    return Array.from(this.items.values());
  }

  public getCount(): number {
    return this.items.size;
  }
}

export const helpingRegistry = new HelpingRegistry();
