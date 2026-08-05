export interface PromptAsset {
  id: string;
  name: string;
  template: string;
  category: string;
}

export class PromptAssets {
  private static prompts: PromptAsset[] = [
    { id: 'p1', name: 'Thought Leadership LinkedIn', template: 'Act as an industry executive...', category: 'LinkedIn' },
    { id: 'p2', name: 'Viral X Hook', template: 'Write a scroll-stopping tweet about...', category: 'Twitter' },
  ];

  static getPrompts(): PromptAsset[] {
    return [...this.prompts];
  }
}
