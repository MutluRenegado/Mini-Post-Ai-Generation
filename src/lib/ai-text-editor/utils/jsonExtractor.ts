import { Logger } from '../logging/Logger';

export interface JSONParseResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  sanitizedSnippet?: string;
}

/**
 * Extracts and parses JSON safely from AI provider raw text outputs.
 * Correctly handles unescaped control characters (newlines, tabs, etc.) within string literals
 * without corrupting valid JSON syntax structure.
 */
export function extractAndParseJSON<T = any>(rawText: string, requestId?: string): JSONParseResult<T> {
  if (!rawText || !rawText.trim()) {
    return { success: false, error: 'Empty raw response received from provider.' };
  }

  // 1. Remove Markdown code block fences
  let clean = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // 2. Extract first complete JSON object if surrounding text is present
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }

  // 3. Log sanitized snippet before parsing (avoiding secrets or sensitive PII)
  const logSnippet = clean.length > 200 ? `${clean.substring(0, 100)}...${clean.substring(clean.length - 100)}` : clean;
  Logger.info('JSONExtractor', 'parsing_attempt', { length: clean.length, snippet: logSnippet }, requestId);

  // 4. Try standard JSON.parse first
  try {
    const data = JSON.parse(clean);
    return { success: true, data, sanitizedSnippet: logSnippet };
  } catch (err: any) {
    Logger.warn('JSONExtractor', 'standard_parse_failed', { message: err?.message }, requestId);
  }

  // 5. Context-aware character repair for unescaped control characters within string literals
  try {
    const repaired = sanitizeJSONStringLiterals(clean);
    const data = JSON.parse(repaired);
    Logger.info('JSONExtractor', 'repair_parse_success', { length: repaired.length }, requestId);
    return { success: true, data, sanitizedSnippet: logSnippet };
  } catch (repairErr: any) {
    Logger.error('JSONExtractor', 'repair_parse_failed', { message: repairErr?.message }, requestId);
    return {
      success: false,
      error: `JSON_PARSE_ERROR: ${repairErr?.message || 'Invalid JSON format'}`,
      sanitizedSnippet: logSnippet,
    };
  }
}

/**
 * Walks through JSON string character-by-character to escape unescaped control characters
 * ONLY when inside double-quoted string literals.
 */
export function sanitizeJSONStringLiterals(jsonStr: string): string {
  let result = '';
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];

    if (inString) {
      if (isEscaped) {
        result += char;
        isEscaped = false;
      } else if (char === '\\') {
        result += char;
        isEscaped = true;
      } else if (char === '"') {
        result += char;
        inString = false;
      } else if (char === '\n') {
        result += '\\n';
      } else if (char === '\r') {
        result += '\\r';
      } else if (char === '\t') {
        result += '\\t';
      } else {
        const code = char.charCodeAt(0);
        if (code < 0x20) {
          result += `\\u${code.toString(16).padStart(4, '0')}`;
        } else {
          result += char;
        }
      }
    } else {
      if (char === '"') {
        inString = true;
      }
      result += char;
    }
  }

  return result;
}
