
import { QualityAuditor } from '@/lib/ai-text-editor/validation/QualityAuditor';

export class QualityEngineService {
  static getQualityGrade(score: number): { grade: 'A+' | 'A' | 'B' | 'C' | 'F'; color: string } {
    if (score >= 95) return { grade: 'A+', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' };
    if (score >= 85) return { grade: 'A', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' };
    if (score >= 75) return { grade: 'B', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' };
    if (score >= 60) return { grade: 'C', color: 'text-orange-400 border-orange-500/40 bg-orange-500/10' };
    return { grade: 'F', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' };
  }

  static auditContent(text: string, platform: string = 'LinkedIn') {
    return QualityAuditor.audit({}, text, platform);
  }
}

