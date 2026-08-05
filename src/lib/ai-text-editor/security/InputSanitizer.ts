export class InputSanitizer {
  static sanitizeTopic(input: string): string {
    if (!input) return '';
    // Prevent prompt injection attempts (e.g. "Ignore previous instructions")
    return input
      .replace(/ignore\s+all\s+(previous|prior)\s+instructions/gi, '')
      .replace(/system\s+prompt\s*:/gi, '')
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .trim();
  }

  static sanitizeOutput(text: string): string {
    if (!text) return '';
    // Filter developer metadata labels from final output
    return text
      .replace(/^(Goal|Audience|Platform|Tone|Topic|Master Topic|Strategic Insight|Executive Intel):\s*.+$/gim, '')
      .trim();
  }
}
