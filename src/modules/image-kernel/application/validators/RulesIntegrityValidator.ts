import { createHash } from 'node:crypto';

export const REQUIRED_RULE_SECTIONS = [
  'MANDATORY ENGINE INSTRUCTION',
  'IMAGE CREATION RULES (DO)',
  "FORBIDDEN IMAGE RULES (DON'T)",
  'RULE PRIORITY',
  'FINAL CHECKLIST',
] as const;

export function calculateRulesHash(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

export function hasRequiredRuleSections(content: string): boolean {
  return REQUIRED_RULE_SECTIONS.every((section) => content.includes(section));
}
