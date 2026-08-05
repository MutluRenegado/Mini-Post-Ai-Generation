import type { GenerateImageInput, GenerateImageOutput } from './GenerateImage';
import { GenerateImage } from './GenerateImage';
export class RegenerateImage {
  public constructor(private readonly generateImage: GenerateImage) {}
  public execute(input: GenerateImageInput): Promise<GenerateImageOutput> { return this.generateImage.execute({ ...input, maxRetries: input.maxRetries ?? 2 }); }
}
