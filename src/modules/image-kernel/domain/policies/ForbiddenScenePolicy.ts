export const FORBIDDEN_SCENE_TERMS = Object.freeze(['empty office','empty meeting room','empty warehouse','empty server room','generic corporate stock photo','generic handshake','floating hologram','hooded hacker']);
export function containsForbiddenScene(text: string): boolean { const lower=text.toLowerCase(); return FORBIDDEN_SCENE_TERMS.some((term)=>lower.includes(term)); }
