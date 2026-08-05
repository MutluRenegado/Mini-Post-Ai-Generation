import { TemplateRegistry } from './TemplateRegistry';

export class TemplateEngine {
  static render(templateId: string, variables: Record<string, string>): string {
    const tmpl = TemplateRegistry.get(templateId);
    if (!tmpl) return variables.defaultText || '';
    let rendered = tmpl.content;
    for (const [key, val] of Object.entries(variables)) {
      rendered = rendered.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), val);
    }
    return rendered;
  }
}
