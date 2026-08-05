import { StudioRequest, StudioOutput, QualityReport } from '../models/ai.types';

export class RegenerationEngine {
  static shouldRegenerate(report: QualityReport, attempt: number, maxAttempts: number = 2): boolean {
    if (attempt >= maxAttempts) return false;
    return report.score < 92 || !report.passed || report.promptLeakage || report.genericWording;
  }

  static buildRetryPromptModifier(report: QualityReport): string {
    const fixes: string[] = [];

    if (report.promptLeakage) {
      fixes.push('CRITICAL: Remove developer metadata labels (Goal:, Audience:, Platform:, Tone:, Topic:).');
    }
    if (report.genericWording) {
      fixes.push('CRITICAL: Replace all generic boilerplate language with concrete, specific industry facts.');
    }
    if (report.hookStrength < 80) {
      fixes.push('Strengthen opening hooks — make the first line extremely provocative, sharp, or data-driven.');
    }
    if (report.ctaQuality < 80) {
      fixes.push('Ensure every post ends with a clear, natural call-to-action.');
    }
    if (report.authority < 85) {
      fixes.push('Adopt a more authoritative, expert subject-matter voice with precise domain terminology.');
    }

    return `\n\nREGENERATION ADVISORY (Previous score: ${report.score}/100):\n` + fixes.map(f => `• ${f}`).join('\n');
  }
}
