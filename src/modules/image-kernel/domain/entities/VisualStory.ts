export interface VisualStory {
  readonly who: string;
  readonly action: string;
  readonly evidence: readonly string[];
  readonly setting: string;
  readonly viewerTakeaway: string;
}
