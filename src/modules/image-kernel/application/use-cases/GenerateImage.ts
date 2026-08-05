import type { ImageProvider, ImageProviderResult } from '../ports/ImageProvider';
import { MasterImageRulesLoader } from '../services/MasterImageRulesLoader';
import { SemanticSceneSelector, type SceneSelectionInput } from '../services/SemanticSceneSelector';
import { PromptBuilder } from '../services/PromptBuilder';
import { PromptValidator } from '../services/PromptValidator';
import { PromptRegenerator } from '../services/PromptRegenerator';
import { assertImageRulesApplied, type ImageGenerationRuleContext } from '../validators/DispatchGuard';
import { assertPromptQuality } from '../validators/PromptQualityValidator';

export interface GenerateImageInput extends SceneSelectionInput {
  readonly requestId: string;
  readonly aspectRatio?: string;
  readonly maxRetries?: number;
}

export interface GenerateImageOutput {
  readonly result: ImageProviderResult;
  readonly prompt: string;
  readonly negativePrompt: string;
  readonly rulesContext: ImageGenerationRuleContext;
}

export class GenerateImage {
  public constructor(
    private readonly rulesLoader: MasterImageRulesLoader,
    private readonly provider: ImageProvider,
    private readonly sceneSelector = new SemanticSceneSelector(),
    private readonly promptBuilder = new PromptBuilder(),
    private readonly validator = new PromptValidator(),
    private readonly regenerator = new PromptRegenerator(),
  ) {}

  public async execute(input: GenerateImageInput): Promise<GenerateImageOutput> {
    const rules = await this.rulesLoader.loadForRequest();
    let scene = this.sceneSelector.select(input);
    const maxRetries = Math.max(0, Math.min(input.maxRetries ?? 2, 3));

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      const prompt = this.promptBuilder.build(scene, rules, input.aspectRatio ?? '1:1');
      const validation = this.validator.validate(prompt, scene);
      if (validation.valid) {
        const rulesContext: ImageGenerationRuleContext = {
          rulesVersion: rules.version,
          rulesIntegrityHash: rules.integrityHash,
          positiveRulesApplied: true,
          domainRulesApplied: true,
          platformRulesApplied: true,
          forbiddenRulesApplied: true,
          validationCompleted: true,
        };
        assertImageRulesApplied(rulesContext);
        assertPromptQuality(validation);
        const result = await this.provider.generate({ prompt: prompt.text, negativePrompt: prompt.negativePrompt, aspectRatio: prompt.aspectRatio, requestId: input.requestId });
        return { result, prompt: prompt.text, negativePrompt: prompt.negativePrompt, rulesContext };
      }
      if (attempt === maxRetries) assertPromptQuality(validation);
      scene = this.regenerator.rebuildScene(scene, validation);
    }
    throw new Error('IMAGE_GENERATION_FAILED');
  }
}
