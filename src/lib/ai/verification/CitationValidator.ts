export class CitationValidator {
  static validate(text: string): { valid: boolean; citationsFound: number } {
    const citationRegex = /\((?:according to|source:|study by|report|benchmark)[^)]+\)/gi;
    const matches = text.match(citationRegex) || [];
    return {
      valid: true,
      citationsFound: matches.length,
    };
  }
}
