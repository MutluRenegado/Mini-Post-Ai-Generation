export class ReadabilityOptimizer {
  static optimize(text: string): string {
    // Clean up excessive empty lines and spaces
    return text
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  }
}
