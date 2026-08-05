export interface ImagePrompt {
  readonly text: string;
  readonly negativePrompt: string;
  readonly rulesVersion: string;
  readonly rulesIntegrityHash: string;
  readonly platform: string;
  readonly aspectRatio: string;
}
