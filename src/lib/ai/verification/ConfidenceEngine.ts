import { FactVerificationReport } from '../models/ai.types';

export class ConfidenceEngine {
  static evaluate(report: FactVerificationReport): { passes: boolean; action: 'approve' | 'revise' | 'reject' } {
    if (report.confidenceScore >= 85 && report.consistent) {
      return { passes: true, action: 'approve' };
    }
    if (report.confidenceScore >= 65) {
      return { passes: false, action: 'revise' };
    }
    return { passes: false, action: 'reject' };
  }
}
