import type { ImageScene } from '../../domain/entities/ImageScene';
import type { ImageValidationResult } from '../../domain/entities/ImageValidationResult';

export class PromptRegenerator {
  public rebuildScene(scene: ImageScene, result: ImageValidationResult): ImageScene {
    const corrections = result.failures.map((failure) => failure.requiredCorrection).join(' ');
    return {
      ...scene,
      visibleAction: `${scene.visibleAction}. Corrective direction: ${corrections}`,
      backgroundContext: 'a context-appropriate setting kept visually subordinate, with no empty or dominant environment',
    };
  }
}
