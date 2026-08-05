import { TemplateRecord } from './TemplateRegistry';

export class VersionManager {
  private static versionHistory: Map<string, TemplateRecord[]> = new Map();

  static saveVersion(template: TemplateRecord): void {
    const history = this.versionHistory.get(template.id) || [];
    history.push({ ...template });
    this.versionHistory.set(template.id, history);
  }

  static rollback(templateId: string, targetVersion: number): TemplateRecord | undefined {
    const history = this.versionHistory.get(templateId);
    if (!history) return undefined;
    return history.find((t) => t.version === targetVersion);
  }
}
