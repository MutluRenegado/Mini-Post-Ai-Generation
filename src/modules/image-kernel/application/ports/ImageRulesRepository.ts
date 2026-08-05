export interface LoadedMasterImageRules {
  readonly content: string;
  readonly version: string;
  readonly integrityHash: string;
  readonly loadedAt: string;
  readonly requiredSectionsPresent: boolean;
}

export interface ImageRulesRepository {
  load(): Promise<LoadedMasterImageRules>;
}
