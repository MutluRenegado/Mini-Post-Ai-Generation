export interface TemplateRecord {
  id: string;
  name: string;
  version: number;
  author: string;
  content: string;
  status: 'active' | 'deprecated';
}

export class TemplateRegistry {
  private static templates: Map<string, TemplateRecord> = new Map();

  static register(template: TemplateRecord): void {
    this.templates.set(template.id, template);
  }

  static get(id: string): TemplateRecord | undefined {
    return this.templates.get(id);
  }

  static list(): TemplateRecord[] {
    return Array.from(this.templates.values());
  }
}
