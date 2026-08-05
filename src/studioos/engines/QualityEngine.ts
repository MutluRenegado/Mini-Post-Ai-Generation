import { QualityAuditor } from '@/lib/ai-text-editor/validation/QualityAuditor';

export class StudioQualityEngine {
  static audit(content: any, rawText: string, platform: string) {
    return QualityAuditor.audit(content, rawText, platform);
  }
}
