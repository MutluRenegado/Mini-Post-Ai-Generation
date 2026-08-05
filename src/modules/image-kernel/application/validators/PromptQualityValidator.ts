import type { ImageValidationResult } from '../../domain/entities/ImageValidationResult';

export function assertPromptQuality(result: ImageValidationResult): void {
  if (!result.valid) {
    const codes = result.failures.map((failure) => failure.code).join(',');
    throw new Error(`IMAGE_PROMPT_VALIDATION_FAILED:${codes}`);
  }
}
