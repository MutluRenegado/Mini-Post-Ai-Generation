export class ContradictionDetector {
  static detect(text: string): { hasContradiction: boolean; issues: string[] } {
    const issues: string[] = [];
    const lower = text.toLowerCase();

    if (lower.includes('always') && lower.includes('never') && text.length < 100) {
      issues.push('Potential absolute statement contradiction detected');
    }

    return {
      hasContradiction: issues.length > 0,
      issues,
    };
  }
}
