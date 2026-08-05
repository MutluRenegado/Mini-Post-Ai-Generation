import { KnowledgeBase, FactVerificationReport } from '../models/ai.types';

export class FactChecker {
  static verify(content: string, kb: KnowledgeBase): FactVerificationReport {
    const lower = content.toLowerCase();
    const unsupportedClaims: string[] = [];
    const contradictions: string[] = [];

    // Check against misconceptions
    kb.misconceptions.forEach((m) => {
      if (lower.includes(m.toLowerCase().slice(0, 20))) {
        contradictions.push(`Content echoes misconception: "${m}"`);
      }
    });

    const confidenceScore = Math.max(60, 100 - (unsupportedClaims.length * 15 + contradictions.length * 25));

    return {
      consistent: contradictions.length === 0,
      confidenceScore,
      unsupportedClaims,
      contradictions,
      missingContext: [],
    };
  }
}
