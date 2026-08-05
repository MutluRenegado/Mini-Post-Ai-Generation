import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import type { ImageRulesRepository, LoadedMasterImageRules } from '../../application/ports/ImageRulesRepository';
import { calculateRulesHash, hasRequiredRuleSections } from '../../application/validators/RulesIntegrityValidator';

export class FileSystemImageRulesRepository implements ImageRulesRepository {
  private cachedRules?: LoadedMasterImageRules;
  private cachedMtimeMs?: number;

  public constructor(private readonly filePath = path.join(process.cwd(), 'src', 'modules', 'image-kernel', 'domain', 'rules', 'MASTER_IMAGE_CREATION_RULES.md')) {}

  public async load(): Promise<LoadedMasterImageRules> {
    try {
      const stats = await stat(this.filePath);
      if (this.cachedRules && this.cachedMtimeMs === stats.mtimeMs) {
        return this.cachedRules;
      }
      const content = await readFile(this.filePath, 'utf8');
      if (!content.trim()) {
        this.cachedRules = undefined;
        this.cachedMtimeMs = undefined;
        throw new Error('IMAGE_RULES_EMPTY');
      }
      const version = content.match(/Version:\s*([^\r\n]+)/i)?.[1]?.trim() ?? 'unversioned';
      const requiredSectionsPresent = hasRequiredRuleSections(content);
      if (!requiredSectionsPresent) {
        this.cachedRules = undefined;
        this.cachedMtimeMs = undefined;
        throw new Error('IMAGE_RULES_INCOMPLETE');
      }
      const rules = Object.freeze({
        content,
        version,
        integrityHash: calculateRulesHash(content),
        loadedAt: new Date().toISOString(),
        requiredSectionsPresent,
      });
      this.cachedRules = rules;
      this.cachedMtimeMs = stats.mtimeMs;
      return rules;
    } catch (error) {
      this.cachedRules = undefined;
      this.cachedMtimeMs = undefined;
      if (error instanceof Error && error.message.startsWith('IMAGE_RULES_')) throw error;
      throw new Error('IMAGE_RULES_FILE_NOT_FOUND');
    }
  }
}
