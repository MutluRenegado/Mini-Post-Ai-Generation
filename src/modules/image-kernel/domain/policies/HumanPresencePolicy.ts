const OPTIONAL_HUMAN_DOMAINS = new Set(['environment-design', 'architecture', 'interior-design', 'product-photography', 'landscape']);
export function requiresHumanPresence(domain: string): boolean { return !OPTIONAL_HUMAN_DOMAINS.has(domain); }
