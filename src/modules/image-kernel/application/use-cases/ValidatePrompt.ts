import type { ImagePrompt } from '../../domain/entities/ImagePrompt';
import type { ImageScene } from '../../domain/entities/ImageScene';
import type { ImageValidationResult } from '../../domain/entities/ImageValidationResult';
import { PromptValidator } from '../services/PromptValidator';

export class ValidatePrompt {
  public constructor(private readonly validator = new PromptValidator()) {}
  public execute(prompt: ImagePrompt, scene: ImageScene): ImageValidationResult { return this.validator.validate(prompt, scene); }
}
