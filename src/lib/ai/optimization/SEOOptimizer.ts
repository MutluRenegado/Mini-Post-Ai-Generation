export class SEOOptimizer {
  static optimize(text: string, keywords: string[]): string {
    if (!keywords || keywords.length === 0) return text;
    // Ensure primary keyword appears naturally if missing
    const primary = keywords[0];
    if (primary && !text.toLowerCase().includes(primary.toLowerCase())) {
      return `${text}\n\nKey focus: ${primary}.`;
    }
    return text;
  }
}
