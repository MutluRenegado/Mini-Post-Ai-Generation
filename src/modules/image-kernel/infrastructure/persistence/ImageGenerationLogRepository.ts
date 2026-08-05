export interface ImageGenerationLogEntry {
  readonly requestId: string;
  readonly rulesVersion: string;
  readonly rulesIntegrityHash: string;
  readonly rulesLoaded: true;
  readonly positiveRulesApplied: true;
  readonly forbiddenRulesApplied: true;
  readonly validationPassed: true;
  readonly dispatchedAt: string;
}

export class ImageGenerationLogRepository {
  private readonly entries: ImageGenerationLogEntry[] = [];
  public save(entry: ImageGenerationLogEntry): void { this.entries.push(Object.freeze({ ...entry })); }
  public all(): readonly ImageGenerationLogEntry[] { return Object.freeze([...this.entries]); }
}
