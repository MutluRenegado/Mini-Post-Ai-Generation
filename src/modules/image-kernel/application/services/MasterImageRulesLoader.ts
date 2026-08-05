import type { ImageRulesRepository, LoadedMasterImageRules } from '../ports/ImageRulesRepository';

export class MasterImageRulesLoader {
  public constructor(private readonly repository: ImageRulesRepository) {}

  public async loadForRequest(): Promise<LoadedMasterImageRules> {
    const rules = await this.repository.load();
    if (!rules.requiredSectionsPresent || !rules.content.trim()) {
      throw new Error('IMAGE_RULES_UNAVAILABLE');
    }
    return Object.freeze({ ...rules });
  }
}
