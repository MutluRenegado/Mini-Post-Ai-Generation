import { PromptTemplate } from '../types/studio.types';

export class AIPromptManagerService {
  static getPromptTemplates(): PromptTemplate[] {
    return [
      {
        id: 'prompt_viral_hook',
        title: 'High-Converting Viral Hook Generator',
        description: 'Generates irresistible social media hooks for tech and growth topics',
        category: 'hook',
        promptText: 'Write 3 high-impact scroll-stopping hooks for {topic} targeting {audience}. Tone: {tone}.',
        version: 2,
        qualityScore: 96,
        usageCount: 142,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}
